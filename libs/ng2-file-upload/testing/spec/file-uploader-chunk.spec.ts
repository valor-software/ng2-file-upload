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
  }

  abort(): void {
    // like a real XHR, aborting a finished request fires no events
    if (this.readyState === 4) {
      return;
    }
    this.aborted = true;
    this.onabort?.();
  }

  getAllResponseHeaders(): string {
    return '';
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

function last(): FakeXhr {
  return FakeXhr.instances[ FakeXhr.instances.length - 1 ];
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

    expect(FakeXhr.instances.length).toBe(1);
    expect((last().body as FormData).get('chunkIndex')).toBeNull();
    expect(success).toHaveBeenCalledTimes(1);
  });

  it('splits the file into chunks and reports success once', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];
    const beforeChunk = jest.spyOn(uploader, 'onBeforeUploadChunk');
    const completeChunk = jest.spyOn(uploader, 'onCompleteChunk');
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

    expect(FakeXhr.instances.length).toBe(3);
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

  it('lets onCompleteChunk change the url and method of the next chunk', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    uploader.onCompleteChunk = (item, chunk, response) => {
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
    const uploader = createUploader({ chunkSize: 4 * KB, chunkRetries: 2 });
    const error = jest.spyOn(uploader, 'onErrorItem');
    const success = jest.spyOn(uploader, 'onSuccessItem');

    uploader.uploadAll();
    last().respond(500);
    last().onerror?.();
    expect((last().body as FormData).get('chunkIndex')).toBe('0');
    last().respond(200);
    last().respond(200);
    last().respond(200);

    expect(FakeXhr.instances.length).toBe(5);
    expect(error).not.toHaveBeenCalled();
    expect(success).toHaveBeenCalledTimes(1);
  });

  it('fails the item once retries are used up', () => {
    const uploader = createUploader({ chunkSize: 4 * KB, chunkRetries: 1 });
    const item = uploader.queue[ 0 ];
    const error = jest.spyOn(uploader, 'onErrorItem');

    uploader.uploadAll();
    last().respond(200);
    last().respond(500);
    last().respond(500);

    expect(FakeXhr.instances.length).toBe(3);
    expect(error).toHaveBeenCalledTimes(1);
    expect(item.isError).toBe(true);
    expect(uploader.isUploading).toBe(false);
  });

  it('cancel aborts the chunk in flight and stops the upload', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];
    const cancel = jest.spyOn(uploader, 'onCancelItem');

    uploader.uploadAll();
    last().respond(200);
    item.cancel();

    expect(last().aborted).toBe(true);
    expect(FakeXhr.instances.length).toBe(2);
    expect(cancel).toHaveBeenCalledTimes(1);
    expect(item.isCancel).toBe(true);
  });

  it('cancel from onCompleteChunk stops before the next chunk', () => {
    const uploader = createUploader({ chunkSize: 4 * KB });
    const item = uploader.queue[ 0 ];
    const cancel = jest.spyOn(uploader, 'onCancelItem');
    uploader.onCompleteChunk = (fileItem) => fileItem.cancel();

    uploader.uploadAll();
    last().respond(200);

    expect(FakeXhr.instances.length).toBe(1);
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
});
