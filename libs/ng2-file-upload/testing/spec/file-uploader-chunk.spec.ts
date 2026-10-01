import { FileUploader, FileUploaderOptions } from '../../file-upload/file-uploader.class';

class FakeXhr {
  static instances: FakeXhr[] = [];
  upload: any = {};
  status = 0;
  response = '';
  responseText = '';
  readyState = 0;
  withCredentials = false;
  method?: string;
  url?: string;
  body: any;
  requestHeaders: { [ name: string ]: string } = {};
  aborted = false;
  sent = false;
  onload?: () => void;
  onerror?: () => void;
  onabort?: () => void;
  onreadystatechange?: () => void;

  constructor() {
    FakeXhr.instances.push(this);
  }

  open(method: string, url: string): void {
    this.method = method;
    this.url = url;
  }

  setRequestHeader(name: string, value: string): void {
    this.requestHeaders[ name ] = value;
  }

  send(body: any): void {
    this.body = body;
    this.sent = true;
  }

  abort(): void {
    if (!this.sent || this.readyState === 4) {
      return;
    }
    this.aborted = true;
    this.onabort?.();
  }

  responseHeaders = '';

  getAllResponseHeaders(): string {
    return this.responseHeaders;
  }

  respond(status: number, response = ''): void {
    this.status = status;
    this.response = response;
    this.readyState = 4;
    this.onload?.();
  }
}

const KB = 1024;

function createUploader(options: Partial<FileUploaderOptions>): FileUploader {
  const uploader = new FileUploader({ url: '/upload', ...options });
  uploader.addToQueue([ new File([ 'x'.repeat(10 * KB) ], 'file.bin') ]);

  return uploader;
}

function sent(): FakeXhr[] {
  return FakeXhr.instances.filter(xhr => xhr.sent);
}

function last(): FakeXhr {
  const requests = sent();

  return requests[ requests.length - 1 ];
}

describe('FileUploader: chunked upload', () => {
  const originalXhr = (globalThis as any).XMLHttpRequest;

  beforeEach(() => {
    FakeXhr.instances = [];
    (globalThis as any).XMLHttpRequest = FakeXhr;
    (FakeXhr as any).DONE = 4;
  });

  afterEach(() => {
    (globalThis as any).XMLHttpRequest = originalXhr;
  });

  it('sends the whole file in one request when chunkSize is not set', () => {
    const uploader = createUploader({});
    const success = jest.spyOn(uploader, 'onSuccessItem');

    uploader.uploadAll();
    last().respond(200);

    expect(sent().length).toBe(1);
    expect((last().body as FormData).get('chunkIndex')).toBeNull();
    expect(success).toHaveBeenCalledTimes(1);
  });

  it('splits the file into chunks and reports success once', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];
    const beforeChunk = jest.spyOn(uploader, 'onBeforeUploadChunk');
    const completeChunk = jest.spyOn(uploader, 'onSuccessChunk');
    const success = jest.spyOn(uploader, 'onSuccessItem');
    const complete = jest.spyOn(uploader, 'onCompleteItem');

    uploader.uploadAll();
    for (let i = 0; i < 3; i++) {
      const form = last().body as FormData;
      expect(form.get('chunkIndex')).toBe(String(i));
      expect(form.get('totalChunks')).toBe('3');
      expect((form.get('file') as File).size).toBe(i < 2 ? 4 * KB : 2 * KB);
      last().respond(200, `chunk-${i}`);
    }

    expect(sent().length).toBe(3);
    expect(beforeChunk).toHaveBeenCalledTimes(3);
    expect(completeChunk).toHaveBeenCalledTimes(3);
    expect(success).toHaveBeenCalledTimes(1);
    expect(success.mock.calls[ 0 ][ 1 ]).toBe('chunk-2');
    expect(complete).toHaveBeenCalledTimes(1);
    expect(item.isSuccess).toBe(true);
    expect(uploader.isUploading).toBe(false);
  });

  it('uses custom chunk param names', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, chunkIndexParam: 'current_chunk', totalChunksParam: 'total_chunks' });

    uploader.uploadAll();
    const form = last().body as FormData;

    expect(form.get('current_chunk')).toBe('0');
    expect(form.get('total_chunks')).toBe('3');
  });

  it('lets onSuccessChunk change the url and method of the next chunk', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    uploader.onSuccessChunk = (item, chunk, response) => {
      item.url = `/upload/${response}`;
      item.method = 'PUT';
    };

    uploader.uploadAll();
    last().respond(200, 'abc');

    expect(last().url).toBe('/upload/abc');
    expect(last().method).toBe('PUT');
  });

  it('sends raw slices with Content-Range when multipart is disabled', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, disableMultipart: true });

    uploader.uploadAll();
    expect(last().body).toBeInstanceOf(Blob);
    expect(last().requestHeaders[ 'Content-Range' ]).toBe(`bytes 0-${4 * KB - 1}/${10 * KB}`);
    last().respond(200);
    expect(last().requestHeaders[ 'Content-Range' ]).toBe(`bytes ${4 * KB}-${8 * KB - 1}/${10 * KB}`);
  });

  it('reports overall progress across chunks', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];

    uploader.uploadAll();
    last().respond(200);
    last().upload.onprogress({ lengthComputable: true, loaded: 1, total: 2 });

    expect(item.progress).toBe(60);
  });

  it('retries a failed chunk and then continues', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, chunkRetries: 2, chunkRetryDelay: 0 });
    const error = jest.spyOn(uploader, 'onErrorItem');
    const success = jest.spyOn(uploader, 'onSuccessItem');

    uploader.uploadAll();
    last().respond(500);
    last().onerror?.();
    expect((last().body as FormData).get('chunkIndex')).toBe('0');
    last().respond(200);
    last().respond(200);
    last().respond(200);

    expect(sent().length).toBe(5);
    expect(error).not.toHaveBeenCalled();
    expect(success).toHaveBeenCalledTimes(1);
  });

  it('fails the item once retries are used up', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, chunkRetries: 1, chunkRetryDelay: 0 });
    const item = uploader.queue[ 0 ];
    const error = jest.spyOn(uploader, 'onErrorItem');

    uploader.uploadAll();
    last().respond(200);
    last().respond(500);
    last().respond(500);

    expect(sent().length).toBe(3);
    expect(error).toHaveBeenCalledTimes(1);
    expect(item.isError).toBe(true);
    expect(uploader.isUploading).toBe(false);
  });

  it('does not retry client errors', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, chunkRetries: 3, chunkRetryDelay: 0 });
    const item = uploader.queue[ 0 ];
    const error = jest.spyOn(uploader, 'onErrorItem');

    uploader.uploadAll();
    last().respond(404);

    expect(sent().length).toBe(1);
    expect(error).toHaveBeenCalledTimes(1);
    expect(item.isError).toBe(true);
  });

  it('retries timeouts and rate limits', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, chunkRetries: 2, chunkRetryDelay: 0 });
    const success = jest.spyOn(uploader, 'onSuccessItem');

    uploader.uploadAll();
    last().respond(408);
    last().respond(429);
    last().respond(200);
    last().respond(200);
    last().respond(200);

    expect(sent().length).toBe(5);
    expect(success).toHaveBeenCalledTimes(1);
  });

  describe('errors thrown by callbacks', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('fail the item when a chunk hook throws and are rethrown asynchronously', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const item = uploader.queue[ 0 ];
      const error = jest.spyOn(uploader, 'onErrorItem');
      const complete = jest.spyOn(uploader, 'onCompleteItem');
      uploader.onBeforeUploadChunk = (_item, chunk) => {
        if (chunk.index === 1) {
          throw new Error('hook failed');
        }
      };

      uploader.uploadAll();
      expect(() => last().respond(200)).not.toThrow();

      expect(sent().length).toBe(1);
      expect(error).toHaveBeenCalledTimes(1);
      expect(error.mock.calls[ 0 ].slice(1)).toEqual([ '', 0, {} ]);
      expect(complete).toHaveBeenCalledTimes(1);
      expect(item.isError).toBe(true);
      expect(uploader.isUploading).toBe(false);
      expect(() => jest.runOnlyPendingTimers()).toThrow('hook failed');
    });

    it('fail the item when onSuccessChunk throws', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const item = uploader.queue[ 0 ];
      uploader.onSuccessChunk = () => {
        throw new Error('hook failed');
      };

      uploader.uploadAll();
      last().respond(200);

      expect(sent().length).toBe(1);
      expect(item.isError).toBe(true);
      expect(uploader.isUploading).toBe(false);
      expect(() => jest.runOnlyPendingTimers()).toThrow('hook failed');
    });

    it('report error before complete when a hook throws on the first chunk', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const order: string[] = [];
      uploader.onErrorItem = () => order.push('error');
      uploader.onCompleteItem = () => order.push('complete');
      uploader.onBeforeUploadChunk = () => {
        throw new Error('hook failed');
      };

      uploader.uploadAll();

      expect(order).toEqual([ 'error', 'complete' ]);
      expect(uploader.isUploading).toBe(false);
      expect(() => jest.runOnlyPendingTimers()).toThrow('hook failed');
    });

    it('report the item once when thrown after the chunk was sent', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const complete = jest.spyOn(uploader, 'onCompleteItem');
      jest.spyOn(uploader as any, '_render').mockImplementationOnce(() => {
        throw new Error('render failed');
      });

      uploader.uploadAll();
      last().respond(200);

      expect(complete).toHaveBeenCalledTimes(1);
      expect(uploader.queue[ 0 ].isError).toBe(true);
      expect(() => jest.runOnlyPendingTimers()).toThrow('render failed');
    });

    it('do not report the item twice when onCompleteItem throws during a cancel', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const item = uploader.queue[ 0 ];
      const error = jest.spyOn(uploader, 'onErrorItem');
      uploader.onBeforeUploadChunk = (fileItem, chunk) => {
        if (chunk.index === 1) {
          fileItem.cancel();
        }
      };
      uploader.onCompleteItem = () => {
        throw new Error('app failed');
      };

      uploader.uploadAll();
      last().respond(200);

      expect(error).not.toHaveBeenCalled();
      expect(item.isCancel).toBe(true);
      expect(() => jest.runOnlyPendingTimers()).toThrow('app failed');
    });

    it('do not report the item twice when onErrorItem throws on the first chunk', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const errors: string[] = [];
      uploader.onBeforeUploadChunk = () => {
        throw new Error('hook failed');
      };
      uploader.onErrorItem = () => {
        errors.push('error');
        throw new Error('app failed');
      };
      const complete = jest.spyOn(uploader, 'onCompleteItem');

      uploader.uploadAll();

      expect(errors).toEqual([ 'error' ]);
      expect(complete).toHaveBeenCalledTimes(1);
      expect(uploader.isUploading).toBe(false);
    });
  });

  it('cancel aborts the chunk in flight and stops the upload', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];
    const cancel = jest.spyOn(uploader, 'onCancelItem');

    uploader.uploadAll();
    last().respond(200);
    item.cancel();

    expect(last().aborted).toBe(true);
    expect(sent().length).toBe(2);
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(item.isCancel).toBe(true);
  });

  it('cancel from onSuccessChunk stops before the next chunk', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];
    const cancel = jest.spyOn(uploader, 'onCancelItem');
    uploader.onSuccessChunk = (fileItem) => fileItem.cancel();

    uploader.uploadAll();
    last().respond(200);

    expect(sent().length).toBe(1);
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(item.isCancel).toBe(true);
    expect(uploader.isUploading).toBe(false);
  });

  it('uploads an empty file as a single chunk', () => {
    const uploader = new FileUploader({ url: '/upload', chunkSize: 4 * KB });
    uploader.addToQueue([ new File([], 'empty.txt') ]);
    const success = jest.spyOn(uploader, 'onSuccessItem');

    uploader.uploadAll();
    expect((last().body as FormData).get('totalChunks')).toBe('1');
    last().respond(200);

    expect(success).toHaveBeenCalledTimes(1);
  });

  it('ignores the fractional part of chunkSize', () => {
    const uploader = createUploader({ chunkSize: 4 * KB + 0.5, disableMultipart: true });

    uploader.uploadAll();

    expect(last().requestHeaders[ 'Content-Range' ]).toBe(`bytes 0-${4 * KB - 1}/${10 * KB}`);
  });

  it('keeps the file MIME type on chunks', () => {
    const uploader = new FileUploader({ url: '/upload', chunkSize: 4 * KB });
    uploader.addToQueue([ new File([ 'x'.repeat(10 * KB) ], 'photo.png', { type: 'image/png' }) ]);

    uploader.uploadAll();

    expect((last().body as FormData).get('file')).toHaveProperty('type', 'image/png');
  });

  it('sends Content-Range with only the length for an empty file in raw mode', () => {
    const uploader = new FileUploader({ url: '/upload', chunkSize: 4 * KB, disableMultipart: true });
    uploader.addToQueue([ new File([], 'empty.txt') ]);

    uploader.uploadAll();

    expect(last().requestHeaders[ 'Content-Range' ]).toBe('bytes */0');
  });

  it('puts chunk fields before the file when parametersBeforeFiles is set', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, parametersBeforeFiles: true, additionalParameter: { id: '1' } });

    uploader.uploadAll();
    const keys = [ ...(last().body as FormData).keys() ];

    expect(keys).toEqual([ 'id', 'chunkIndex', 'totalChunks', 'file' ]);
  });

  it('emits response and builds the form once per chunk request', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const buildForm = jest.spyOn(uploader, 'onBuildItemForm');
    const responses: string[] = [];
    uploader.response.subscribe((res: string) => responses.push(res));

    uploader.uploadAll();
    for (let i = 0; i < 3; i++) {
      const xhr = last();
      xhr.responseText = `r${ i }`;
      xhr.respond(200);
      xhr.onreadystatechange?.();
    }

    expect(buildForm).toHaveBeenCalledTimes(3);
    expect(responses).toEqual([ 'r0', 'r1', 'r2' ]);
  });

  it('cancel from onBeforeUploadChunk on the first chunk stops before sending', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];
    const cancel = jest.spyOn(uploader, 'onCancelItem');
    const error = jest.spyOn(uploader, 'onErrorItem');
    uploader.onBeforeUploadChunk = (fileItem) => fileItem.cancel();

    uploader.uploadAll();

    expect(sent().length).toBe(0);
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(error).not.toHaveBeenCalled();
    expect(item.isCancel).toBe(true);
    expect(uploader.isUploading).toBe(false);
  });

  it('cancel from onBeforeUploadChunk on a later chunk stops before sending it', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];
    const success = jest.spyOn(uploader, 'onSuccessItem');
    uploader.onBeforeUploadChunk = (fileItem, chunk) => {
      if (chunk.index === 2) {
        fileItem.cancel();
      }
    };

    uploader.uploadAll();
    last().respond(200);
    last().respond(200);

    expect(sent().length).toBe(2);
    expect(success).not.toHaveBeenCalled();
    expect(item.isCancel).toBe(true);
    expect(uploader.isUploading).toBe(false);
  });

  it('cancel from onSuccessChunk on the last chunk reports cancel', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];
    const success = jest.spyOn(uploader, 'onSuccessItem');
    uploader.onSuccessChunk = (fileItem, chunk) => {
      if (chunk.index === chunk.total - 1) {
        fileItem.cancel();
      }
    };

    uploader.uploadAll();
    last().respond(200);
    last().respond(200);
    last().respond(200);

    expect(success).not.toHaveBeenCalled();
    expect(item.isCancel).toBe(true);
  });

  it('calls onBeforeUploadChunk again for retries', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, chunkRetries: 1, chunkRetryDelay: 0 });
    const retries: number[] = [];
    uploader.onBeforeUploadChunk = (_item, chunk) => retries.push(chunk.retry);

    uploader.uploadAll();
    last().respond(503);

    expect(retries).toEqual([ 0, 1 ]);
  });

  it('does not retry 501 Not Implemented', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, chunkRetries: 2, chunkRetryDelay: 0 });

    uploader.uploadAll();
    last().respond(501);

    expect(sent().length).toBe(1);
    expect(uploader.queue[ 0 ].isError).toBe(true);
  });

  it('continues with the next queued item and removes uploaded items', () => {
    const uploader = new FileUploader({ url: '/upload', chunkSize: 4 * KB, removeAfterUpload: true });
    uploader.addToQueue([ new File([ 'x'.repeat(6 * KB) ], 'a.bin'), new File([ 'y'.repeat(2 * KB) ], 'b.bin') ]);
    const completeAll = jest.spyOn(uploader, 'onCompleteAll');

    uploader.uploadAll();
    last().respond(200);
    last().respond(200);
    last().respond(200);

    expect(sent().length).toBe(3);
    expect(uploader.queue.length).toBe(0);
    expect(completeAll).toHaveBeenCalledTimes(1);
  });

  it('uploads chunks automatically with autoUpload', () => {
    const uploader = new FileUploader({ url: '/upload', chunkSize: 4 * KB, autoUpload: true });

    uploader.addToQueue([ new File([ 'x'.repeat(10 * KB) ], 'file.bin') ]);

    expect((last().body as FormData).get('chunkIndex')).toBe('0');
  });

  it('creates the request before onBeforeUploadItem without chunking', () => {
    const uploader = createUploader({});
    let xhrInHook: unknown;
    uploader.onBeforeUploadItem = (fileItem) => xhrInHook = fileItem._xhr;

    uploader.uploadAll();

    expect(xhrInHook).toBe(last());
  });

  it('creates each chunk request before onBeforeUploadChunk', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const seen: unknown[] = [];
    uploader.onBeforeUploadChunk = (fileItem) => seen.push(fileItem._xhr);

    uploader.uploadAll();
    last().respond(200);

    expect(seen).toEqual(sent());
  });

  it('cancel from onBuildItemForm stops before the chunk is sent', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];
    const error = jest.spyOn(uploader, 'onErrorItem');
    uploader.onBuildItemForm = (fileItem) => {
      if (fileItem.chunk?.index === 1) {
        fileItem.cancel();
      }
    };

    uploader.uploadAll();
    last().respond(200);

    expect(sent().length).toBe(1);
    expect(error).not.toHaveBeenCalled();
    expect(item.isCancel).toBe(true);
    expect(uploader.isUploading).toBe(false);
  });

  it('reports cancel, not error, when a cancelled chunk then fails', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, chunkRetries: 2, chunkRetryDelay: 0 });
    const item = uploader.queue[ 0 ];
    const error = jest.spyOn(uploader, 'onErrorItem');

    uploader.uploadAll();
    item._cancelRequested = true;
    last().respond(500);

    expect(sent().length).toBe(1);
    expect(error).not.toHaveBeenCalled();
    expect(item.isCancel).toBe(true);
  });

  it('does not call onSuccessChunk for a failed chunk', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const successChunk = jest.spyOn(uploader, 'onSuccessChunk');

    uploader.uploadAll();
    last().respond(400);

    expect(successChunk).not.toHaveBeenCalled();
  });

  it('starts a re-upload at the original url after hooks changed it', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];
    uploader.onSuccessChunk = (fileItem) => {
      fileItem.url = '/upload/session-1';
      fileItem.method = 'PUT';
    };

    uploader.uploadAll();
    last().respond(200);
    last().respond(404);
    item.upload();

    expect(last().url).toBe('/upload');
    expect(last().method).toBe('POST');
  });

  it('keeps a url set by the app in onErrorItem for the re-upload', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];
    uploader.onSuccessChunk = (fileItem) => fileItem.url = '/upload/session-1';
    uploader.onErrorItem = (fileItem) => fileItem.url = '/fallback';

    uploader.uploadAll();
    last().respond(200);
    last().respond(404);
    item.upload();

    expect(last().url).toBe('/fallback');
  });

  it('gives per-file callbacks the item url from before the upload', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    let urlInSuccess = '';
    uploader.onSuccessChunk = (fileItem) => fileItem.url = '/upload/session-1';
    uploader.onSuccessItem = (fileItem) => urlInSuccess = fileItem.url;

    uploader.uploadAll();
    last().respond(200);
    last().respond(200);
    last().respond(200);

    expect(urlInSuccess).toBe('/upload');
  });

  it('keeps the chunk size of a running upload when options change', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, disableMultipart: true });

    uploader.uploadAll();
    last().respond(200);
    uploader.setOptions({ url: '/upload', chunkSize: 3 * KB });
    last().respond(200);

    expect(sent().map(xhr => xhr.requestHeaders[ 'Content-Range' ])).toEqual([
      `bytes 0-${4 * KB - 1}/${10 * KB}`,
      `bytes ${4 * KB}-${8 * KB - 1}/${10 * KB}`,
      `bytes ${8 * KB}-${10 * KB - 1}/${10 * KB}`
    ]);
  });

  it('moves on to the next item when a hook removes the uploading item', () => {
    const uploader = new FileUploader({ url: '/upload', chunkSize: 4 * KB, removeAfterUpload: true });
    uploader.addToQueue([ new File([ 'x'.repeat(6 * KB) ], 'a.bin'), new File([ 'y'.repeat(2 * KB) ], 'b.bin') ]);
    uploader.onSuccessChunk = (fileItem) => {
      if (fileItem.file.name === 'a.bin') {
        fileItem.remove();
      }
    };

    uploader.uploadAll();
    expect(() => last().respond(200)).not.toThrow();
    last().respond(200);

    expect(sent().length).toBe(2);
    expect(uploader.queue.length).toBe(0);
    expect(uploader.isUploading).toBe(false);
  });

  it('keeps the original progress rounding without chunking', () => {
    const uploader = createUploader({});
    const item = uploader.queue[ 0 ];

    uploader.uploadAll();
    last().upload.onprogress({ lengthComputable: true, loaded: 23, total: 40 });

    expect(item.progress).toBe(58);
  });

  it('keeps a url set by the app between uploads', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];
    uploader.onSuccessChunk = (fileItem) => fileItem.url = '/upload/session-1';

    uploader.uploadAll();
    last().respond(200);
    last().respond(404);
    item.url = '/other';
    item.upload();

    expect(last().url).toBe('/other');
  });

  it('keeps a Content-Range header set by the app', () => {
    const uploader = createUploader({
      chunkSize: 4 * KB,
      disableMultipart: true,
      headers: [ { name: 'Content-Range', value: 'custom' } ]
    });

    uploader.uploadAll();

    expect(last().requestHeaders[ 'Content-Range' ]).toBe('custom');
  });

  it('sends headers and the auth token with every chunk', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, authToken: 'Bearer t', headers: [ { name: 'X-App', value: '1' } ] });

    uploader.uploadAll();
    last().respond(200);
    last().respond(200);

    expect(sent().map(xhr => [ xhr.requestHeaders[ 'Authorization' ], xhr.requestHeaders[ 'X-App' ] ]))
      .toEqual([ [ 'Bearer t', '1' ], [ 'Bearer t', '1' ], [ 'Bearer t', '1' ] ]);
  });

  it('ignores formatDataFunction for chunks', () => {
    const formatDataFunction = jest.fn(() => Promise.resolve({ name: 'x' }));
    const uploader = createUploader({ chunkSize: 4 * KB, disableMultipart: true, formatDataFunction, formatDataFunctionIsAsync: true });

    uploader.uploadAll();

    expect(formatDataFunction).not.toHaveBeenCalled();
    expect(last().body).toBeInstanceOf(Blob);
  });

  it('still uses formatDataFunction without chunking', async () => {
    const uploader = createUploader({
      disableMultipart: true,
      formatDataFunction: () => Promise.resolve({ name: 'x' }),
      formatDataFunctionIsAsync: true
    });

    uploader.uploadAll();
    await Promise.resolve();

    expect(last().body).toBe('{"name":"x"}');
  });

  describe('retry delay', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    it('waits 1s by default and doubles the delay on every retry', () => {
      const uploader = createUploader({ chunkSize: 4 * KB, chunkRetries: 2 });

      uploader.uploadAll();
      last().respond(503);
      jest.advanceTimersByTime(999);
      expect(sent().length).toBe(1);
      jest.advanceTimersByTime(1);
      expect(sent().length).toBe(2);

      last().respond(503);
      jest.advanceTimersByTime(1999);
      expect(sent().length).toBe(2);
      jest.advanceTimersByTime(1);
      expect(sent().length).toBe(3);
    });

    it('uses the Retry-After header when the server sends one', () => {
      const uploader = createUploader({ chunkSize: 4 * KB, chunkRetries: 1, chunkRetryDelay: 100 });

      uploader.uploadAll();
      last().responseHeaders = 'Retry-After: 3';
      last().respond(429);
      jest.advanceTimersByTime(2999);
      expect(sent().length).toBe(1);
      jest.advanceTimersByTime(1);
      expect(sent().length).toBe(2);
    });

    it('cancel during the delay reports cancel right away and never retries', () => {
      const uploader = createUploader({ chunkSize: 4 * KB, chunkRetries: 1 });
      const item = uploader.queue[ 0 ];
      const cancel = jest.spyOn(uploader, 'onCancelItem');

      uploader.uploadAll();
      last().respond(503);
      item.cancel();
      expect(cancel).toHaveBeenCalledTimes(1);
      jest.advanceTimersByTime(10000);

      expect(cancel).toHaveBeenCalledTimes(1);
      expect(sent().length).toBe(1);
      expect(item.isCancel).toBe(true);
      expect(uploader.isUploading).toBe(false);
    });

    it('caps the delay at 30 seconds', () => {
      const uploader = createUploader({ chunkSize: 4 * KB, chunkRetries: 1 });

      uploader.uploadAll();
      last().responseHeaders = 'Retry-After: 3600';
      last().respond(503);
      jest.advanceTimersByTime(30000);

      expect(sent().length).toBe(2);
    });

    it('accepts Retry-After as an HTTP date', () => {
      jest.setSystemTime(new Date('2026-01-01T00:00:00Z'));
      const uploader = createUploader({ chunkSize: 4 * KB, chunkRetries: 1, chunkRetryDelay: 0 });

      uploader.uploadAll();
      last().responseHeaders = 'Retry-After: Thu, 01 Jan 2026 00:00:05 GMT';
      last().respond(503);
      jest.advanceTimersByTime(4999);
      expect(sent().length).toBe(1);
      jest.advanceTimersByTime(1);
      expect(sent().length).toBe(2);
    });

    it.each([
      [ 'removeFromQueue', (uploader: FileUploader) => uploader.removeFromQueue(uploader.queue[ 0 ]) ],
      [ 'clearQueue', (uploader: FileUploader) => uploader.clearQueue() ],
      [ 'cancelAll', (uploader: FileUploader) => uploader.cancelAll() ]
    ])('%s during the delay stops the upload', (_name, action) => {
      const uploader = createUploader({ chunkSize: 4 * KB, chunkRetries: 1 });
      const item = uploader.queue[ 0 ];

      uploader.uploadAll();
      last().respond(503);
      action(uploader);
      jest.advanceTimersByTime(10000);

      expect(sent().length).toBe(1);
      expect(item.isCancel).toBe(true);
      expect(uploader.isUploading).toBe(false);
    });
  });
});
