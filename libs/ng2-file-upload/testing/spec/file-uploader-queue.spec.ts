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

describe('FileUploader: callbacks that throw', () => {
  installFakeXhr();

  const callbacks: [ string, (uploader: FileUploader) => void ][] = [
    [ 'onSuccessItem', () => last().respond(200) ],
    [ 'onErrorItem', () => last().respond(500) ],
    [ 'onCancelItem', uploader => uploader.queue[ 0 ].cancel() ],
    [ 'onCompleteItem', () => last().respond(200) ]
  ];

  callbacks.forEach(([ name, finish ]) => {
    it(`${ name } is rethrown and the queue moves on`, () => {
      const uploader = createUploader();
      let thrown = false;
      (uploader as any)[ name ] = () => {
        if (!thrown) {
          thrown = true;
          throw new Error('app error');
        }
      };

      uploader.uploadAll();
      expect(() => finish(uploader)).toThrow('app error');

      expect(uploader.queue[ 0 ].isUploading).toBe(false);
      expect(uploader.queue[ 1 ].isUploading).toBe(true);
      last().respond(200);
      last().respond(200);
      expect(uploader.isUploading).toBe(false);
      expect(sent().length).toBe(3);
    });
  });

  it('report a throw before the request as an error, then completion, then rethrow it', () => {
    const uploader = createUploader();
    const events: string[] = [];
    uploader.onBeforeUploadItem = item => {
      if (item.file.name === 'a.txt') {
        throw new Error('hook failed');
      }
    };
    uploader.onErrorItem = item => events.push(`error ${ item.file.name }`);
    uploader.onCompleteItem = item => events.push(`complete ${ item.file.name } ${ item.isError }`);
    uploader.onCompleteAll = () => events.push('all');

    expect(() => uploader.queue[ 0 ].upload()).toThrow('hook failed');

    expect(events).toEqual([ 'error a.txt', 'complete a.txt true', 'all' ]);
    expect(uploader.isUploading).toBe(false);
  });

  it('rethrow an error from onBuildItemForm and send nothing for that item', () => {
    const uploader = createUploader();
    uploader.onBuildItemForm = () => {
      throw new Error('form failed');
    };

    expect(() => uploader.queue[ 0 ].upload()).toThrow('form failed');

    expect(sent().length).toBe(0);
    expect(uploader.queue[ 0 ].isError).toBe(true);
    expect(uploader.isUploading).toBe(false);
  });

  it('rethrow a hook error for a later item and continue with the items after it', () => {
    const uploader = createUploader();
    uploader.onBeforeUploadItem = item => {
      if (item.file.name === 'b.txt') {
        throw new Error('hook failed');
      }
    };

    uploader.uploadAll();
    expect(() => last().respond(200)).toThrow('hook failed');
    last().respond(200);

    expect(uploader.queue.map(item => item.isSuccess)).toEqual([ true, false, true ]);
    expect(uploader.queue[ 1 ].isError).toBe(true);
    expect(uploader.isUploading).toBe(false);
  });

  it('rethrow a hook error from addToQueue with autoUpload, keeping the files added', () => {
    const uploader = new FileUploader({ url: '/upload', autoUpload: true });
    uploader.onBeforeUploadItem = () => {
      throw new Error('hook failed');
    };

    expect(() => uploader.addToQueue([ new File([ 'a' ], 'a.txt') ])).toThrow('hook failed');

    expect(uploader.queue.length).toBe(1);
    expect(uploader.queue[ 0 ].isError).toBe(true);
  });

  describe('when two callbacks throw for one item', () => {
    beforeEach(() => jest.useFakeTimers());
    afterEach(() => jest.useRealTimers());

    function failing(message: string): () => never {
      return () => {
        throw new Error(message);
      };
    }

    it('rethrow the first error and report the second later', () => {
      const uploader = createUploader();
      uploader.onSuccessItem = failing('first');
      uploader.onCompleteItem = failing('second');

      uploader.uploadAll();
      expect(() => last().respond(200)).toThrow('first');

      expect(() => jest.runAllTimers()).toThrow('second');
      expect(uploader.queue[ 1 ].isUploading).toBe(true);
    });

    it('rethrow a hook error and report a failing onErrorItem later', () => {
      const uploader = createUploader();
      uploader.onBeforeUploadItem = failing('hook');
      uploader.onErrorItem = failing('error callback');

      expect(() => uploader.queue[ 0 ].upload()).toThrow('hook');

      expect(() => jest.runAllTimers()).toThrow('error callback');
      expect(uploader.isUploading).toBe(false);
    });
  });

  it('give onCompleteAll the final progress', () => {
    const uploader = createUploader();
    let progress: number | undefined;
    uploader.onCompleteAll = () => progress = uploader.progress;

    uploader.uploadAll();
    last().respond(200);
    last().respond(200);
    last().respond(200);

    expect(progress).toBe(100);
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
