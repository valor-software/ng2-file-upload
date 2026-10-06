import { ChunkedFileUploader, ChunkedFileUploaderOptions } from '../../file-upload/chunked-file-uploader.class';
import { FileItem } from '../../file-upload/file-item.class';
import { FileUploader } from '../../file-upload/file-uploader.class';
import { FakeXhr, installFakeXhr, last, sent } from './fake-xhr';

const KB = 1024;

function createUploader(options: Partial<ChunkedFileUploaderOptions>, file = new File([ 'x'.repeat(10 * KB) ], 'file.bin')): ChunkedFileUploader {
  const uploader = new ChunkedFileUploader({ url: '/upload', ...options });
  uploader.addToQueue([ file ]);

  return uploader;
}

function form(xhr: FakeXhr = last()): FormData {
  return xhr.body as FormData;
}

describe('ChunkedFileUploader', () => {
  installFakeXhr();

  it('is a FileUploader', () => {
    expect(new ChunkedFileUploader({ url: '/upload' })).toBeInstanceOf(FileUploader);
  });

  it('uploads the whole file in one request without chunkSize', () => {
    const uploader = createUploader({});
    const success = jest.spyOn(uploader, 'onSuccessItem');

    uploader.uploadAll();
    last().respond(200);

    expect(sent().length).toBe(1);
    expect(form().get('chunkIndex')).toBeNull();
    expect(success).toHaveBeenCalledTimes(1);
  });

  it('splits the file into chunks and reports the file once', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];
    const beforeChunk = jest.spyOn(uploader, 'onBeforeUploadChunk');
    const successChunk = jest.spyOn(uploader, 'onSuccessChunk');
    const beforeItem = jest.spyOn(uploader, 'onBeforeUploadItem');
    const success = jest.spyOn(uploader, 'onSuccessItem');
    const complete = jest.spyOn(uploader, 'onCompleteItem');

    uploader.uploadAll();
    for (let i = 0; i < 3; i++) {
      expect(form().get('chunkIndex')).toBe(String(i));
      expect(form().get('totalChunks')).toBe('3');
      expect((form().get('file') as File).size).toBe(i < 2 ? 4 * KB : 2 * KB);
      last().respond(200, `chunk-${ i }`);
    }

    expect(sent().length).toBe(3);
    expect(beforeItem).toHaveBeenCalledTimes(1);
    expect(beforeChunk).toHaveBeenCalledTimes(3);
    expect(successChunk).toHaveBeenCalledTimes(3);
    expect(success).toHaveBeenCalledTimes(1);
    expect(success.mock.calls[ 0 ][ 1 ]).toBe('chunk-2');
    expect(complete).toHaveBeenCalledTimes(1);
    expect(item.isSuccess).toBe(true);
    expect(uploader.isUploading).toBe(false);
  });

  it('exposes the current chunk', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];
    const seen: number[] = [];
    uploader.onBuildItemForm = (fileItem) => seen.push(uploader.getChunk(fileItem)?.index as number);

    uploader.uploadAll();
    last().respond(200);

    expect(seen).toEqual([ 0, 1 ]);
    expect(uploader.getChunk(item)?.index).toBe(1);
    last().respond(200);
    last().respond(200);
    expect(uploader.getChunk(item)).toBeUndefined();
  });

  it('forgets chunk state when the item is uploaded without chunkSize', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];

    uploader.uploadAll();
    last().respond(500);
    uploader.setOptions({ url: '/upload', chunkSize: 0 });
    item.upload();
    last().respond(200);

    expect(uploader.getChunk(item)).toBeUndefined();
  });

  it('uses custom chunk field names', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, chunkIndexParam: 'current_chunk', totalChunksParam: 'total_chunks' });

    uploader.uploadAll();

    expect(form().get('current_chunk')).toBe('0');
    expect(form().get('total_chunks')).toBe('3');
  });

  it('puts the chunk fields before the file', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, additionalParameter: { name: '{{file_name}}' } });

    uploader.uploadAll();

    expect([ ...form().keys() ]).toEqual([ 'chunkIndex', 'totalChunks', 'file', 'name' ]);
    expect(form().get('name')).toBe('file.bin');
  });

  it('keeps parametersBeforeFiles for additional parameters', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, parametersBeforeFiles: true, additionalParameter: { name: 'x' } });

    uploader.uploadAll();

    expect([ ...form().keys() ]).toEqual([ 'chunkIndex', 'totalChunks', 'name', 'file' ]);
  });

  it('keeps the file MIME type on chunks', () => {
    const uploader = createUploader({ chunkSize: 4 * KB }, new File([ 'x'.repeat(10 * KB) ], 'photo.png', { type: 'image/png' }));

    uploader.uploadAll();

    expect(form().get('file')).toHaveProperty('type', 'image/png');
  });

  it('sends raw chunks with Content-Range when multipart is disabled', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, disableMultipart: true });

    uploader.uploadAll();
    expect(last().body).toBeInstanceOf(Blob);
    expect(last().requestHeaders[ 'Content-Range' ]).toBe(`bytes 0-${ 4 * KB - 1 }/${ 10 * KB }`);
    last().respond(200);
    expect(last().requestHeaders[ 'Content-Range' ]).toBe(`bytes ${ 4 * KB }-${ 8 * KB - 1 }/${ 10 * KB }`);
  });

  it('keeps a Content-Range header set by the app', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, disableMultipart: true, headers: [ { name: 'Content-Range', value: 'custom' } ] });

    uploader.uploadAll();

    expect(last().requestHeaders[ 'Content-Range' ]).toBe('custom');
  });

  it('uploads an empty file as one chunk', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, disableMultipart: true }, new File([], 'empty.txt'));
    const success = jest.spyOn(uploader, 'onSuccessItem');

    uploader.uploadAll();
    expect(last().requestHeaders[ 'Content-Range' ]).toBe('bytes */0');
    last().respond(200);

    expect(success).toHaveBeenCalledTimes(1);
  });

  it('ignores the fractional part of chunkSize', () => {
    const uploader = createUploader({ chunkSize: 4 * KB + 0.5, disableMultipart: true });

    uploader.uploadAll();

    expect(last().requestHeaders[ 'Content-Range' ]).toBe(`bytes 0-${ 4 * KB - 1 }/${ 10 * KB }`);
  });

  it('keeps the chunk size of a running upload when options change', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, disableMultipart: true });

    uploader.uploadAll();
    last().respond(200);
    uploader.setOptions({ url: '/upload', chunkSize: 3 * KB });
    last().respond(200);

    expect(sent().map(xhr => xhr.requestHeaders[ 'Content-Range' ])).toEqual([
      `bytes 0-${ 4 * KB - 1 }/${ 10 * KB }`,
      `bytes ${ 4 * KB }-${ 8 * KB - 1 }/${ 10 * KB }`,
      `bytes ${ 8 * KB }-${ 10 * KB - 1 }/${ 10 * KB }`
    ]);
  });

  it('sends headers and the auth token with every chunk', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, authToken: 'Bearer t', headers: [ { name: 'X-App', value: '1' } ] });

    uploader.uploadAll();
    last().respond(200);
    last().respond(200);

    expect(sent().map(xhr => [ xhr.requestHeaders[ 'Authorization' ], xhr.requestHeaders[ 'X-App' ] ]))
      .toEqual([ [ 'Bearer t', '1' ], [ 'Bearer t', '1' ], [ 'Bearer t', '1' ] ]);
  });

  it('lets onSuccessChunk retarget the next chunk', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    uploader.onSuccessChunk = (item, _chunk, response) => {
      item.url = `/upload/${ response }`;
      item.method = 'PUT';
    };

    uploader.uploadAll();
    last().respond(200, 'abc');

    expect(last().url).toBe('/upload/abc');
    expect(last().method).toBe('PUT');
  });

  it('reports progress across the whole file', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];

    uploader.uploadAll();
    last().respond(200);
    last().upload.onprogress({ lengthComputable: true, loaded: 1, total: 2 });

    expect(item.progress).toBe(60);
  });

  it('keeps progress at the resume point when the item fails', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];
    let progressOnError: number | undefined;
    uploader.onErrorItem = fileItem => progressOnError = fileItem.progress;

    uploader.uploadAll();
    last().respond(200);
    last().respond(503);

    expect(progressOnError).toBe(40);
    expect(item.progress).toBe(40);
  });

  it('keeps progress at the resume point when the item is cancelled', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];

    uploader.uploadAll();
    last().respond(200);
    last().respond(200);
    item.cancel();

    expect(item.isCancel).toBe(true);
    expect(item.progress).toBe(80);
  });

  it('resets progress of a cancelled upload without chunkSize', () => {
    const uploader = createUploader({});
    const item = uploader.queue[ 0 ];

    uploader.uploadAll();
    last().upload.onprogress({ lengthComputable: true, loaded: 1, total: 2 });
    item.cancel();

    expect(item.progress).toBe(0);
  });

  it('resets item.method with item.url in setOptions', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, method: 'POST' });
    const item = uploader.queue[ 0 ];
    uploader.onSuccessChunk = fileItem => {
      fileItem.url = '/upload/abc';
      fileItem.method = 'PUT';
    };

    uploader.uploadAll();
    last().respond(200);
    item.cancel();
    uploader.setOptions({ url: '/sessions' });

    expect(item.url).toBe('/sessions');
    expect(item.method).toBe('POST');
  });

  it('emits response and builds the form once per chunk', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const buildForm = jest.spyOn(uploader, 'onBuildItemForm');
    const responses: string[] = [];
    uploader.response.subscribe((res: string) => responses.push(res));

    uploader.uploadAll();
    last().respond(200, 'r0');
    last().respond(200, 'r1');
    last().respond(200, 'r2');

    expect(buildForm).toHaveBeenCalledTimes(3);
    expect(responses).toEqual([ 'r0', 'r1', 'r2' ]);
  });

  describe('errors', () => {
    it('report the failed chunk and fail the item without sending more', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const item = uploader.queue[ 0 ];
      const errorChunk = jest.spyOn(uploader, 'onErrorChunk');
      const successChunk = jest.spyOn(uploader, 'onSuccessChunk');
      const error = jest.spyOn(uploader, 'onErrorItem');

      uploader.uploadAll();
      last().respond(200);
      last().respond(503, 'busy');

      expect(sent().length).toBe(2);
      expect(errorChunk).toHaveBeenCalledTimes(1);
      expect(errorChunk.mock.calls[ 0 ][ 1 ].index).toBe(1);
      expect(errorChunk.mock.calls[ 0 ].slice(2, 4)).toEqual([ 'busy', 503 ]);
      expect(successChunk).toHaveBeenCalledTimes(1);
      expect(error).toHaveBeenCalledTimes(1);
      expect(item.isError).toBe(true);
      expect(uploader.isUploading).toBe(false);
    });

    it('report network errors the same way', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const errorChunk = jest.spyOn(uploader, 'onErrorChunk');

      uploader.uploadAll();
      last().onerror?.();

      expect(errorChunk).toHaveBeenCalledTimes(1);
      expect(uploader.queue[ 0 ].isError).toBe(true);
    });
  });

  describe('callbacks that throw', () => {
    it('fail the item so the queue moves on, then rethrow', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      uploader.addToQueue([ new File([ 'y' ], 'next.bin') ]);
      const [ item, next ] = uploader.queue;
      const error = jest.spyOn(uploader, 'onErrorItem');
      uploader.onSuccessChunk = (fileItem, _chunk, response) => fileItem === item && JSON.parse(response);

      uploader.uploadAll();
      expect(() => last().respond(200, 'not json')).toThrow(SyntaxError);

      expect(error).toHaveBeenCalledTimes(1);
      expect(item.isError).toBe(true);
      expect(((last().body as FormData).get('file') as File).name).toBe('next.bin');
      expect(next.isUploading).toBe(true);
    });

    it('fail the item when onBeforeUploadChunk throws on a later chunk', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      uploader.onBeforeUploadChunk = (_item, chunk) => {
        if (chunk.index === 1) {
          throw new Error('hook failed');
        }
      };

      uploader.uploadAll();
      expect(() => last().respond(200)).toThrow('hook failed');

      expect(uploader.queue[ 0 ].isError).toBe(true);
      expect(uploader.isUploading).toBe(false);
    });

    it('report the item once with the server status when onErrorChunk throws', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const error = jest.spyOn(uploader, 'onErrorItem');
      uploader.onErrorChunk = () => {
        throw new Error('hook failed');
      };

      uploader.uploadAll();
      expect(() => last().respond(503, 'busy')).toThrow('hook failed');

      expect(error).toHaveBeenCalledTimes(1);
      expect(error.mock.calls[ 0 ].slice(1, 3)).toEqual([ 'busy', 503 ]);
      expect(uploader.isUploading).toBe(false);
    });

    it('handle a throw before the first request like FileUploader does', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const error = jest.spyOn(uploader, 'onErrorItem');
      uploader.onBeforeUploadChunk = () => {
        throw new Error('hook failed');
      };

      expect(() => uploader.uploadAll()).not.toThrow();

      expect(sent().length).toBe(0);
      expect(error).toHaveBeenCalledTimes(1);
      expect(uploader.isUploading).toBe(false);
    });

    it('do not report an already finished item again', () => {
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
      expect(() => last().respond(200)).toThrow('app failed');

      expect(error).not.toHaveBeenCalled();
      expect(item.isCancel).toBe(true);
    });
  });

  describe('resumeItem', () => {
    it('continues from the failed chunk', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const item = uploader.queue[ 0 ];
      const success = jest.spyOn(uploader, 'onSuccessItem');

      uploader.uploadAll();
      last().respond(200);
      last().respond(500);
      uploader.resumeItem(item);

      expect(form().get('chunkIndex')).toBe('1');
      last().respond(200);
      last().respond(200);

      expect(sent().map(xhr => (xhr.body as FormData).get('chunkIndex'))).toEqual([ '0', '1', '1', '2' ]);
      expect(success).toHaveBeenCalledTimes(1);
      expect(item.isSuccess).toBe(true);
    });

    it('lets the app retry from onErrorItem', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      let retries = 0;
      uploader.onErrorItem = (item, _response, status) => {
        if (status >= 500 && retries++ < 2) {
          uploader.resumeItem(item);
        }
      };

      uploader.uploadAll();
      last().respond(503);
      last().respond(503);
      last().respond(503);

      expect(sent().length).toBe(3);
      expect(sent().every(xhr => (xhr.body as FormData).get('chunkIndex') === '0')).toBe(true);
      expect(uploader.queue[ 0 ].isError).toBe(true);
      expect(uploader.isUploading).toBe(false);
    });

    it('continues after the last successful chunk when cancelled from onSuccessChunk', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const item = uploader.queue[ 0 ];
      uploader.onSuccessChunk = (fileItem, chunk) => {
        if (chunk.index === 0) {
          fileItem.cancel();
        }
      };

      uploader.uploadAll();
      last().respond(200);
      uploader.onSuccessChunk = () => undefined;
      uploader.resumeItem(item);

      expect(form().get('chunkIndex')).toBe('1');
    });

    it('does nothing for an item no longer in the queue', () => {
      const uploader = createUploader({ chunkSize: 4 * KB, removeAfterUpload: true });
      const item = uploader.queue[ 0 ];

      uploader.uploadAll();
      last().respond(500);

      expect(uploader.queue.length).toBe(0);
      expect(() => uploader.resumeItem(item)).not.toThrow();
      expect(sent().length).toBe(1);
    });

    it('resumes an item behind another one in the queue', () => {
      const uploader = new ChunkedFileUploader({ url: '/upload', chunkSize: 4 * KB });
      uploader.addToQueue([ new File([ 'x'.repeat(10 * KB) ], 'a.bin'), new File([ 'y'.repeat(2 * KB) ], 'b.bin') ]);
      const [ a, b ] = uploader.queue;

      a.upload();
      last().respond(200);
      last().respond(500);
      b.upload();
      uploader.resumeItem(a);
      last().respond(200);

      expect(sent().map(xhr => [ ((xhr.body as FormData).get('file') as File).name, (xhr.body as FormData).get('chunkIndex') ]))
        .toEqual([ [ 'a.bin', '0' ], [ 'a.bin', '1' ], [ 'b.bin', '0' ], [ 'a.bin', '1' ] ]);
    });

    it('continues from the cancelled chunk', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const item = uploader.queue[ 0 ];

      uploader.uploadAll();
      last().respond(200);
      item.cancel();
      uploader.resumeItem(item);

      expect(form().get('chunkIndex')).toBe('1');
    });

    it('starts over after a successful upload', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const item = uploader.queue[ 0 ];

      uploader.uploadAll();
      last().respond(200);
      last().respond(200);
      last().respond(200);
      uploader.resumeItem(item);

      expect(form().get('chunkIndex')).toBe('0');
    });

    it('does nothing while the item is uploading', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });

      uploader.uploadAll();
      uploader.resumeItem(uploader.queue[ 0 ]);

      expect(sent().length).toBe(1);
    });

    it('keeps the resume point when onBeforeUploadItem throws', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const item = uploader.queue[ 0 ];

      uploader.uploadAll();
      last().respond(200);
      last().respond(500);
      uploader.onBeforeUploadItem = () => {
        throw new Error('token refresh failed');
      };
      uploader.resumeItem(item);
      uploader.onBeforeUploadItem = () => undefined;
      uploader.resumeItem(item);

      expect(item.isUploading).toBe(true);
      expect(form().get('chunkIndex')).toBe('1');
    });
  });

  describe('resumeAll', () => {
    function chunks(): [ string, string ][] {
      return sent().map(xhr => [ ((xhr.body as FormData).get('file') as File).name, (xhr.body as FormData).get('chunkIndex') as string ]);
    }

    it('resumes failed and cancelled items from their chunks and uploads new ones from the start', () => {
      const uploader = new ChunkedFileUploader({ url: '/upload', chunkSize: 4 * KB });
      uploader.addToQueue([ new File([ 'x'.repeat(10 * KB) ], 'a.bin'), new File([ 'y'.repeat(10 * KB) ], 'b.bin') ]);
      const [ a, b ] = uploader.queue;

      a.upload();
      last().respond(200);
      last().respond(500);
      b.upload();
      last().respond(200);
      last().respond(200);
      b.cancel();
      uploader.addToQueue([ new File([ 'z'.repeat(2 * KB) ], 'c.bin') ]);
      FakeXhr.instances = [];

      uploader.resumeAll();
      last().respond(200);
      last().respond(200);
      last().respond(200);
      last().respond(200);

      expect(chunks()).toEqual([ [ 'a.bin', '1' ], [ 'a.bin', '2' ], [ 'b.bin', '2' ], [ 'c.bin', '0' ] ]);
      expect(uploader.queue.every(item => item.isSuccess)).toBe(true);
    });

    it('lets cancelAll stop items waiting to resume, which then start over on upload', () => {
      const uploader = new ChunkedFileUploader({ url: '/upload', chunkSize: 4 * KB });
      uploader.addToQueue([ new File([ 'x'.repeat(10 * KB) ], 'a.bin'), new File([ 'y'.repeat(10 * KB) ], 'b.bin') ]);
      const [ a, b ] = uploader.queue;

      a.upload();
      last().respond(200);
      a.cancel();
      b.upload();
      uploader.resumeAll();
      uploader.cancelAll();
      FakeXhr.instances = [];

      expect(a.isCancel).toBe(true);
      expect(a.progress).toBe(40);
      a.upload();

      expect(chunks()).toEqual([ [ 'a.bin', '0' ] ]);
    });

    it('skips uploaded items', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });

      uploader.uploadAll();
      last().respond(200);
      last().respond(200);
      last().respond(200);
      uploader.resumeAll();

      expect(sent().length).toBe(3);
    });

    it('leaves an uploading item alone and queues the others behind it', () => {
      const uploader = new ChunkedFileUploader({ url: '/upload', chunkSize: 4 * KB });
      uploader.addToQueue([ new File([ 'x'.repeat(6 * KB) ], 'a.bin'), new File([ 'y'.repeat(2 * KB) ], 'b.bin') ]);

      uploader.queue[ 0 ].upload();
      uploader.resumeAll();
      last().respond(200);
      last().respond(200);
      last().respond(200);

      expect(chunks()).toEqual([ [ 'a.bin', '0' ], [ 'a.bin', '1' ], [ 'b.bin', '0' ] ]);
    });
  });

  describe('cancel', () => {
    function expectCancelled(uploader: ChunkedFileUploader, item: FileItem): void {
      expect(item.isCancel).toBe(true);
      expect(item.isError).toBe(false);
      expect(uploader.isUploading).toBe(false);
    }

    it('aborts the chunk in flight', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const item = uploader.queue[ 0 ];
      const cancel = jest.spyOn(uploader, 'onCancelItem');

      uploader.uploadAll();
      last().respond(200);
      item.cancel();

      expect(last().aborted).toBe(true);
      expect(sent().length).toBe(2);
      expect(cancel).toHaveBeenCalledTimes(1);
      expectCancelled(uploader, item);
    });

    it.each([
      [ 'onBeforeUploadItem', (uploader: ChunkedFileUploader) => uploader.onBeforeUploadItem = (item: FileItem) => item.cancel(), 0 ],
      [ 'onBeforeUploadChunk on the first chunk', (uploader: ChunkedFileUploader) => uploader.onBeforeUploadChunk = (item: FileItem) => item.cancel(), 0 ],
      [ 'onBuildItemForm on a later chunk', (uploader: ChunkedFileUploader) => uploader.onBuildItemForm = (item: FileItem) => {
        if (uploader.getChunk(item)?.index === 1) {
          item.cancel();
        }
      }, 1 ],
      [ 'onSuccessChunk', (uploader: ChunkedFileUploader) => uploader.onSuccessChunk = (item: FileItem) => item.cancel(), 1 ],
    ])('from %s stops before the next request', (_name, setup, expectedRequests) => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const item = uploader.queue[ 0 ];
      const cancel = jest.spyOn(uploader, 'onCancelItem');
      setup(uploader);

      uploader.uploadAll();
      last()?.respond(200);

      expect(sent().length).toBe(expectedRequests);
      expect(cancel).toHaveBeenCalledTimes(1);
      expectCancelled(uploader, item);
    });

    it('from onSuccessChunk on the last chunk has no effect, the file is uploaded with the server status', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const item = uploader.queue[ 0 ];
      const success = jest.spyOn(uploader, 'onSuccessItem');
      uploader.onSuccessChunk = (fileItem, chunk) => {
        if (chunk.index === chunk.total - 1) {
          fileItem.cancel();
        }
      };

      uploader.uploadAll();
      last().respond(201);
      last().respond(201);
      last().respond(201, 'ok');

      expect(item.isSuccess).toBe(true);
      expect(success.mock.calls[ 0 ].slice(1, 3)).toEqual([ 'ok', 201 ]);
      expect(uploader.isUploading).toBe(false);
    });

    it('from onErrorChunk leaves the item failed with the server status', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const item = uploader.queue[ 0 ];
      const error = jest.spyOn(uploader, 'onErrorItem');
      uploader.onErrorChunk = (fileItem) => fileItem.cancel();

      uploader.uploadAll();
      last().respond(503, 'busy');

      expect(item.isError).toBe(true);
      expect(error.mock.calls[ 0 ].slice(1, 3)).toEqual([ 'busy', 503 ]);
      expect(uploader.isUploading).toBe(false);
    });

    it('from a response subscriber on the last chunk counts as a cancel', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });
      const item = uploader.queue[ 0 ];
      uploader.response.subscribe(() => {
        if (uploader.getChunk(item)?.index === 2) {
          item.cancel();
        }
      });

      uploader.uploadAll();
      last().respond(200);
      last().respond(200);
      last().respond(200);

      expectCancelled(uploader, item);
    });

    it('through removeFromQueue stops the upload', () => {
      const uploader = createUploader({ chunkSize: 4 * KB });

      uploader.uploadAll();
      uploader.removeFromQueue(uploader.queue[ 0 ]);

      expect(last().aborted).toBe(true);
      expect(uploader.queue.length).toBe(0);
      expect(uploader.isUploading).toBe(false);
    });
  });

  describe('queue', () => {
    it('continues with the next item and removes uploaded items', () => {
      const uploader = new ChunkedFileUploader({ url: '/upload', chunkSize: 4 * KB, removeAfterUpload: true });
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
      const uploader = createUploader({ chunkSize: 4 * KB, autoUpload: true });

      expect(form().get('chunkIndex')).toBe('0');
      expect(uploader.isUploading).toBe(true);
    });
  });
});
