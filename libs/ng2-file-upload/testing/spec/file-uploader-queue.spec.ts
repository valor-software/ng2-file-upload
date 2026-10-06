import { FileUploader, FileUploaderOptions } from '../../file-upload/file-uploader.class';
import { installFakeXhr, last, sent } from './fake-xhr';

function createUploader(options: Partial<FileUploaderOptions> = {}): FileUploader {
  const uploader = new FileUploader({ url: '/upload', ...options });
  uploader.addToQueue([ new File([ 'a' ], 'a.txt'), new File([ 'b' ], 'b.txt'), new File([ 'c' ], 'c.txt') ]);

  return uploader;
}

describe('FileUploader: queue', () => {
  installFakeXhr();

  describe('cancelAll', () => {
    it('cancels waiting items without sending them', () => {
      const uploader = createUploader();
      const before = jest.spyOn(uploader, 'onBeforeUploadItem');

      uploader.uploadAll();
      uploader.cancelAll();

      expect(sent().length).toBe(1);
      expect(last().aborted).toBe(true);
      expect(before).toHaveBeenCalledTimes(1);
      expect(uploader.queue.every(item => item.isCancel && !item.isReady)).toBe(true);
      expect(uploader.isUploading).toBe(false);
    });

    it('reports every item once and completes the queue after the uploading item', () => {
      const uploader = createUploader();
      const events: string[] = [];
      uploader.onCancelItem = item => events.push(`cancel ${ item.file.name }`);
      uploader.onCompleteItem = item => events.push(`complete ${ item.file.name }`);
      uploader.onCompleteAll = () => events.push('all');

      uploader.uploadAll();
      uploader.cancelAll();

      expect(events).toEqual([
        'cancel b.txt', 'complete b.txt',
        'cancel c.txt', 'complete c.txt',
        'cancel a.txt', 'complete a.txt',
        'all'
      ]);
    });

    it('leaves items that were never queued alone', () => {
      const uploader = createUploader();
      const cancel = jest.spyOn(uploader, 'onCancelItem');

      uploader.cancelAll();

      expect(cancel).not.toHaveBeenCalled();
      expect(uploader.queue.some(item => item.isCancel)).toBe(false);
    });

    it('lets cancelled items be uploaded again', () => {
      const uploader = createUploader();

      uploader.uploadAll();
      uploader.cancelAll();
      uploader.uploadAll();
      last().respond(200);
      last().respond(200);
      last().respond(200);

      expect(sent().length).toBe(4);
      expect(uploader.queue.every(item => item.isSuccess)).toBe(true);
    });

    it('removes cancelled waiting items with removeAfterUpload', () => {
      const uploader = createUploader({ removeAfterUpload: true });

      uploader.uploadAll();
      uploader.cancelAll();

      expect(uploader.queue.length).toBe(0);
    });
  });

  describe('cancel of a waiting item', () => {
    it('keeps it from being sent while the queue continues', () => {
      const uploader = createUploader();
      const [ , b ] = uploader.queue;

      uploader.uploadAll();
      b.cancel();
      last().respond(200);
      last().respond(200);

      expect(sent().map(xhr => ((xhr.body as FormData).get('file') as File).name)).toEqual([ 'a.txt', 'c.txt' ]);
      expect(b.isCancel).toBe(true);
    });

    it('does not end the upload of the item being sent', () => {
      const uploader = createUploader();
      const completeAll = jest.spyOn(uploader, 'onCompleteAll');

      uploader.uploadAll();
      uploader.queue[ 2 ].cancel();

      expect(uploader.isUploading).toBe(true);
      expect(uploader.queue[ 0 ].isUploading).toBe(true);
      expect(completeAll).not.toHaveBeenCalled();
    });
  });
});

describe('FileUploader: setOptions', () => {
  it('does not add the built-in filters again', () => {
    const custom = { name: 'custom', fn: () => true };
    const uploader = new FileUploader({ url: '', queueLimit: 2, maxFileSize: 10, allowedFileType: [ 'image' ], allowedMimeType: [ 'image/png' ], filters: [ custom ] });

    uploader.setOptions({ url: '/a' });
    uploader.setOptions({ url: '/b' });

    expect(uploader.options.filters?.map(filter => filter.name)).toEqual([ 'mimeType', 'fileType', 'fileSize', 'queueLimit', 'custom' ]);
  });

  it('drops a built-in filter when its option is turned off', () => {
    const uploader = new FileUploader({ url: '', maxFileSize: 10 });

    uploader.setOptions({ url: '', maxFileSize: 0 });

    expect(uploader.options.filters?.map(filter => filter.name)).toEqual([ 'queueLimit' ]);
  });
});
