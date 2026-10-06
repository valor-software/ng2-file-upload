import { FileItem } from './file-item.class';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from './file-uploader.class';

export interface ChunkedFileUploaderOptions extends FileUploaderOptions {
  chunkSize?: number;
  chunkIndexParam?: string;
  totalChunksParam?: string;
}

export interface FileChunk {
  index: number;
  total: number;
  start: number;
  end: number;
  blob: Blob;
}

interface ChunkState {
  chunk?: FileChunk;
  resume?: FileChunk;
  cancelled?: boolean;
}

export class ChunkedFileUploader extends FileUploader {
  declare options: ChunkedFileUploaderOptions;

  private _chunks = new WeakMap<FileItem, ChunkState>();

  constructor(options: ChunkedFileUploaderOptions) {
    super(options);
  }

  setOptions(options: ChunkedFileUploaderOptions): void {
    super.setOptions(options);
    // chunk hooks may retarget item.method along with item.url, so reset both
    for (const item of this.queue) {
      item.method = this.options.method || 'POST';
    }
  }

  getChunk(item: FileItem): FileChunk | undefined {
    return this._chunks.get(item)?.chunk;
  }

  resumeItem(item: FileItem): void {
    if (item.isUploading || this.getIndexOfItem(item) < 0) {
      return;
    }
    this._setResumePoint(item);
    item.upload();
  }

  resumeAll(): void {
    const items = this.queue.filter(item => !item.isSuccess && !item.isUploading);
    if (!items.length) {
      return;
    }
    items.forEach(item => {
      this._setResumePoint(item);
      item._prepareToUploading();
    });
    items[ 0 ].upload();
  }

  _onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): void {
    item._onError(response, status, headers);
    this._keepProgress(item);
    this.onErrorItem(item, response, status, headers);
  }

  cancelItem(value: FileItem): void {
    const item = this.queue[ this.getIndexOfItem(value) ];
    const state = item && this._chunks.get(item);
    if (state && item.isUploading) {
      state.cancelled = true;
      item._xhr?.abort();

      return;
    }
    super.cancelItem(value);
  }

  onBeforeUploadChunk(item: FileItem, chunk: FileChunk): any {
    return { item, chunk };
  }

  onSuccessChunk(item: FileItem, chunk: FileChunk, response: string, status: number, headers: ParsedResponseHeaders): any {
    return { item, chunk, response, status, headers };
  }

  onErrorChunk(item: FileItem, chunk: FileChunk, response: string, status: number, headers: ParsedResponseHeaders): any {
    return { item, chunk, response, status, headers };
  }

  protected _xhrTransport(item: FileItem): any {
    const chunkSize = Math.floor(this.options.chunkSize || 0);
    if (chunkSize <= 0) {
      this._chunks.delete(item);

      return super._xhrTransport(item);
    }
    const resume = this._chunks.get(item)?.resume;
    this._chunks.set(item, { chunk: resume });
    this._onBeforeUploadItem(item);

    if (typeof item._file.size !== 'number') {
      throw new TypeError('The file specified is no longer valid');
    }
    const total = Math.max(1, Math.ceil(item._file.size / chunkSize));
    this._sendChunk(item, resume || this._sliceChunk(item, 0, 0, chunkSize, total));
  }

  protected _onCancelItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): void {
    item._onCancel(response, status, headers);
    this._keepProgress(item);
    // an item cancelled while waiting to resume starts over on upload(), like any cancelled item
    const state = this._chunks.get(item);
    if (state) {
      state.resume = undefined;
    }
    this.onCancelItem(item, response, status, headers);
  }

  // a paused or failed chunked item counts with the progress it keeps, not as 0 or as done
  protected _getTotalProgress(value = 0): number {
    if (this.options.removeAfterUpload || !this.queue.length) {
      return super._getTotalProgress(value);
    }
    const total = this.queue.reduce((sum: number, item: FileItem) => {
      if (item.isUploading) {
        return sum + value;
      }
      if (this._chunks.has(item) && !item.isSuccess) {
        return sum + item.progress;
      }

      return sum + (item.isUploaded ? 100 : 0);
    }, 0);

    return Math.round(total / this.queue.length);
  }

  private _setResumePoint(item: FileItem): void {
    const state = this._chunks.get(item);
    if (state?.chunk) {
      state.resume = state.chunk;
    }
  }

  // a failed or cancelled item resumes from its current chunk, so its progress stays at that chunk's start
  private _keepProgress(item: FileItem): void {
    const chunk = this._chunks.get(item)?.chunk;
    if (chunk && item._file.size) {
      item.progress = Math.round(chunk.start * 100 / item._file.size);
    }
  }

  private _sliceChunk(item: FileItem, index: number, start: number, length: number, total: number): FileChunk {
    const end = Math.min(start + length, item._file.size);

    return { index, total, start, end, blob: item._file.slice(start, end, item._file.type) };
  }

  private _sendChunk(item: FileItem, chunk: FileChunk): void {
    const state = this._chunks.get(item) as ChunkState;
    const xhr = item._xhr = new XMLHttpRequest();
    state.chunk = chunk;
    this.onBeforeUploadChunk(item, chunk);
    const sendable = this.options.disableMultipart ? chunk.blob : this._buildFormData(item, chunk.blob, {
      [ this.options.chunkIndexParam || 'chunkIndex' ]: chunk.index.toString(),
      [ this.options.totalChunksParam || 'totalChunks' ]: chunk.total.toString()
    });
    if (state.cancelled) {
      this._finishItem(item, '_onCancelItem', '', 0, {});

      return;
    }

    xhr.upload.onprogress = (event: any) => {
      const sent = event.lengthComputable ? event.loaded / event.total * (chunk.end - chunk.start) : 0;
      this._onProgressItem(item, item._file.size ? Math.round((chunk.start + sent) * 100 / item._file.size) : 0);
    };
    xhr.onload = () => this._onChunkDone(item, chunk, xhr, this._isSuccessCode(xhr.status));
    xhr.onerror = () => this._onChunkDone(item, chunk, xhr, false);
    xhr.onabort = () => {
      state.cancelled = true;
      this._onChunkDone(item, chunk, xhr, false);
    };
    this._openRequest(xhr, item);
    const hasContentRange = [ ...(this.options.headers || []), ...item.headers ].some(header => header.name.toLowerCase() === 'content-range');
    if (this.options.disableMultipart && !hasContentRange) {
      const range = chunk.end > chunk.start ? `${ chunk.start }-${ chunk.end - 1 }` : '*';
      xhr.setRequestHeader('Content-Range', `bytes ${ range }/${ item._file.size }`);
    }
    xhr.send(sendable);
    this._render();
  }

  private _onChunkDone(item: FileItem, chunk: FileChunk, xhr: XMLHttpRequest, isSuccess: boolean): void {
    const state = this._chunks.get(item) as ChunkState;
    const headers = this._parseHeaders(xhr.getAllResponseHeaders());
    const response = this._transformResponse(xhr.response);
    // cancel() from a hook aborts the finished request, which resets xhr.status to 0
    const status = xhr.status;
    if (state.cancelled) {
      this._finishItem(item, '_onCancelItem', response, status, headers);

      return;
    }
    if (!isSuccess) {
      try {
        this.onErrorChunk(item, chunk, response, status, headers);
      } finally {
        this._finishItem(item, '_onErrorItem', response, status, headers);
      }

      return;
    }
    this._runChunkHook(item, () => this.onSuccessChunk(item, chunk, response, status, headers));
    if (chunk.index + 1 >= chunk.total) {
      state.chunk = undefined;
      this._finishItem(item, '_onSuccessItem', response, status, headers);

      return;
    }
    const next = this._sliceChunk(item, chunk.index + 1, chunk.end, chunk.end - chunk.start, chunk.total);
    if (state.cancelled) {
      state.chunk = next;
      this._finishItem(item, '_onCancelItem', response, status, headers);

      return;
    }
    this._runChunkHook(item, () => this._sendChunk(item, next));
  }

  // hooks after the first chunk run in XHR callbacks: fail the item so the queue moves on, then rethrow
  private _runChunkHook(item: FileItem, hook: () => void): void {
    try {
      hook();
    } catch (e) {
      if (item.isUploading) {
        this._finishItem(item, '_onErrorItem', '', 0, {});
      }
      throw e;
    }
  }
}
