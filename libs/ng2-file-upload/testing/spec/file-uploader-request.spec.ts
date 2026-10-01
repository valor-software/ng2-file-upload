import { FileUploader, FileUploaderOptions } from '../../file-upload/file-uploader.class';
import { installFakeXhr, last } from './fake-xhr';

function createUploader(options: Partial<FileUploaderOptions>): FileUploader {
  const uploader = new FileUploader({ url: '/upload', ...options });
  uploader.addToQueue([ new File([ 'hello' ], 'file.txt', { type: 'text/plain' }) ]);

  return uploader;
}

describe('FileUploader: request', () => {
  installFakeXhr();

  it('sends the file first, then additional parameters', () => {
    const uploader = createUploader({ additionalParameter: { name: '{{file_name}}', id: 1 } });

    uploader.uploadAll();
    const form = last().body as FormData;

    expect([ ...form.keys() ]).toEqual([ 'file', 'name', 'id' ]);
    expect(form.get('name')).toBe('file.txt');
    expect(form.get('file')).toHaveProperty('name', 'file.txt');
  });

  it('sends additional parameters first with parametersBeforeFiles', () => {
    const uploader = createUploader({ parametersBeforeFiles: true, additionalParameter: { name: 'x' } });

    uploader.uploadAll();

    expect([ ...(last().body as FormData).keys() ]).toEqual([ 'name', 'file' ]);
  });

  it('keeps fields added in onBuildItemForm before the file', () => {
    const uploader = createUploader({});
    uploader.onBuildItemForm = (_item, form) => form.append('extra', '1');

    uploader.uploadAll();

    expect([ ...(last().body as FormData).keys() ]).toEqual([ 'extra', 'file' ]);
  });

  it('opens the request with the item url, method, headers and auth token', () => {
    const uploader = createUploader({ method: 'PUT', authToken: 'Bearer t', headers: [ { name: 'X-App', value: '1' } ] });
    uploader.queue[ 0 ].headers.push({ name: 'X-Item', value: '2' });

    uploader.uploadAll();

    expect([ last().method, last().url, last().withCredentials ]).toEqual([ 'PUT', '/upload', true ]);
    expect(last().requestHeaders).toEqual({ 'X-App': '1', 'X-Item': '2', Authorization: 'Bearer t' });
  });

  it('creates the request before onBeforeUploadItem', () => {
    const uploader = createUploader({});
    let xhrInHook: unknown;
    uploader.onBeforeUploadItem = (item) => xhrInHook = item._xhr;

    uploader.uploadAll();

    expect(xhrInHook).toBe(last());
  });

  it('emits the response text and reports the item', () => {
    const uploader = createUploader({});
    const responses: string[] = [];
    const calls: string[] = [];
    uploader.response.subscribe((res: string) => responses.push(res));
    uploader.onSuccessItem = (_item, response, status) => calls.push(`success ${ response } ${ status }`);
    uploader.onCompleteItem = () => calls.push('complete');

    uploader.uploadAll();
    last().respond(201, 'done');

    expect(responses).toEqual([ 'done' ]);
    expect(calls).toEqual([ 'success done 201', 'complete' ]);
  });

  it('sends the async formatDataFunction result as JSON without multipart', async () => {
    const uploader = createUploader({
      disableMultipart: true,
      formatDataFunctionIsAsync: true,
      formatDataFunction: () => Promise.resolve({ name: 'x' })
    });

    uploader.uploadAll();
    await Promise.resolve();

    expect(last().body).toBe('{"name":"x"}');
  });
});
