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

  protected _chunks = new WeakMap<FileItem, ChunkState>();

  constructor(options: ChunkedFileUploaderOptions) {
    super(options);
  }

  setOptions(options: ChunkedFileUploaderOptions): void {
    super.setOptions(options);
  }

  getChunk(item: FileItem): FileChunk | undefined {
    return this._chunks.get(item)?.chunk;
  }

  resumeItem(item: FileItem): void {
    const state = this._chunks.get(item);
    if (item.isUploading) {
      return;
    }
    if (state?.chunk && !item.isSuccess) {
      state.resume = state.chunk;
    }
    item.upload();
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
      return super._xhrTransport(item);
    }
    const resume = this._chunks.get(item)?.resume;
    this._chunks.set(item, {});
    this._onBeforeUploadItem(item);

    if (typeof item._file.size !== 'number') {
      throw new TypeError('The file specified is no longer valid');
    }
    const total = Math.max(1, Math.ceil(item._file.size / chunkSize));
    this._sendChunk(item, resume || this._getChunk(item, 0, 0, chunkSize, total));
  }

  protected _getChunk(item: FileItem, index: number, start: number, length: number, total: number): FileChunk {
    const end = Math.min(start + length, item._file.size);

    return { index, total, start, end, blob: item._file.slice(start, end, item._file.type) };
  }

  protected _sendChunk(item: FileItem, chunk: FileChunk): void {
    const state = this._chunks.get(item) as ChunkState;
    const xhr = item._xhr = new XMLHttpRequest();
    let sendable: any = chunk.blob;
    state.chunk = chunk;
    this.onBeforeUploadChunk(item, chunk);

    if (!this.options.disableMultipart) {
      sendable = new FormData();
      this._onBuildItemForm(item, sendable);
      const appendFile = () => sendable.append(item.alias, chunk.blob, item.file.name);
      if (!this.options.parametersBeforeFiles) {
        appendFile();
      }
      Object.keys(this.options.additionalParameter || {}).forEach((key: string) => {
        const paramVal = this.options.additionalParameter?.[ key ];
        sendable.append(key, typeof paramVal === 'string' && item.file?.name ? paramVal.replace('{{file_name}}', item.file.name) : paramVal);
      });
      sendable.append(this.options.chunkIndexParam || 'chunkIndex', chunk.index.toString());
      sendable.append(this.options.totalChunksParam || 'totalChunks', chunk.total.toString());
      if (this.options.parametersBeforeFiles) {
        appendFile();
      }
    }
    if (state.cancelled) {
      this._onCancelItem(item, '', 0, {});
      this._onCompleteItem(item, '', 0, {});

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
    if (item.method && item.url) {
      xhr.open(item.method, item.url, true);
    }
    xhr.withCredentials = item.withCredentials;
    const headers = [ ...(this.options.headers || []), ...item.headers ];
    for (const header of headers) {
      xhr.setRequestHeader(header.name, header.value);
    }
    if (this.authToken && this.authTokenHeader) {
      xhr.setRequestHeader(this.authTokenHeader, this.authToken);
    }
    if (this.options.disableMultipart && !headers.some(header => header.name.toLowerCase() === 'content-range')) {
      const range = chunk.end > chunk.start ? `${ chunk.start }-${ chunk.end - 1 }` : '*';
      xhr.setRequestHeader('Content-Range', `bytes ${ range }/${ item._file.size }`);
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        this.response.emit(xhr.responseText);
      }
    };
    xhr.send(sendable);
    this._render();
  }

  protected _onChunkDone(item: FileItem, chunk: FileChunk, xhr: XMLHttpRequest, isSuccess: boolean): void {
    const state = this._chunks.get(item) as ChunkState;
    const headers = this._parseHeaders(xhr.getAllResponseHeaders());
    const response = this._transformResponse(xhr.response);
    if (!state.cancelled && !isSuccess) {
      this.onErrorChunk(item, chunk, response, xhr.status, headers);
      this._onErrorItem(item, response, xhr.status, headers);
      this._onCompleteItem(item, response, xhr.status, headers);

      return;
    }
    if (!state.cancelled) {
      this.onSuccessChunk(item, chunk, response, xhr.status, headers);
    }
    // cancel() between chunks has no request to abort, so it is picked up here
    if (state.cancelled) {
      this._onCancelItem(item, response, xhr.status, headers);
      this._onCompleteItem(item, response, xhr.status, headers);

      return;
    }
    if (chunk.index + 1 < chunk.total) {
      this._sendChunk(item, this._getChunk(item, chunk.index + 1, chunk.end, chunk.end - chunk.start, chunk.total));

      return;
    }
    this._onSuccessItem(item, response, xhr.status, headers);
    this._onCompleteItem(item, response, xhr.status, headers);
  }
}
