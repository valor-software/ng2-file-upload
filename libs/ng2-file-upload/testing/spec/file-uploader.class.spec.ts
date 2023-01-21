import { FileLikeObject } from '../../file-upload/file-like-object.class';
import { FileUploader, FilterFunction } from '../../file-upload/file-uploader.class';

describe('FileUploader: onWhenAddingFileFailed', () => {
    const fileName = 'file.jpg';
    const fileSize = 1024;
    const fileMimeType = 'image/jpg';
    let file: File;

    beforeEach(() => {
        file = new File([""], fileName, { type: fileMimeType });
        Object.defineProperty(file, 'size', { value: fileSize });
    });

    it('does not fire when the file size is less than specified by the maxFileSize filter', () => {
        const filterFileSize = fileSize + 1;
        const uploader = new FileUploader({ url: '', maxFileSize: filterFileSize });
        const onWhenAddingFileFailed = jest.spyOn(uploader, 'onWhenAddingFileFailed');

        uploader.addToQueue([file]);

        expect(filterFileSize).toBeGreaterThan(file.size);
        expect(onWhenAddingFileFailed).toBeCalledTimes(0);
    });

    it('fires when the file size is greater than specified by the maxFileSize filter', () => {
        const filterFileSize = fileSize - 1;
        const uploader = new FileUploader({ url: '', maxFileSize: filterFileSize });
        const onWhenAddingFileFailed = jest.spyOn(uploader, 'onWhenAddingFileFailed');

        uploader.addToQueue([file]);

        expect(filterFileSize).toBeLessThan(file.size);
        expect(onWhenAddingFileFailed).toBeCalledTimes(1);
    });

    it('does not fire when the queue size is less than or equal to the specified by queueLimit filter', () => {
        const queueLimit = 2;
        const uploader = new FileUploader({ url: '', queueLimit: queueLimit });
        const onWhenAddingFileFailed = jest.spyOn(uploader, 'onWhenAddingFileFailed');
        const files = [file, file];

        uploader.addToQueue([file, file]);

        expect(files.length).toBeLessThanOrEqual(queueLimit);
        expect(onWhenAddingFileFailed).toBeCalledTimes(0);
    });

    it('fires when the queue size is greater than the specified by queueLimit filter', () => {
        const queueLimit = 1;
        const uploader = new FileUploader({ url: '', queueLimit: queueLimit });
        const onWhenAddingFileFailed = jest.spyOn(uploader, 'onWhenAddingFileFailed');
        const files = [file, file];

        uploader.addToQueue([file, file]);

        expect(files.length).toBeGreaterThan(queueLimit);
        expect(onWhenAddingFileFailed).toBeCalledTimes(1);
    });

    it('does not fire when file type matches expected by allowedFileType filter', () => {
        const uploader = new FileUploader({ url: '', allowedFileType: ["image"] });
        const onWhenAddingFileFailed = jest.spyOn(uploader, 'onWhenAddingFileFailed');

        uploader.addToQueue([file]);

        expect(onWhenAddingFileFailed).toBeCalledTimes(0);
    });

    it('fires when file type does not match expected by allowedFileType filter', () => {
        const uploader = new FileUploader({ url: '', allowedFileType: ["doc"] });
        const onWhenAddingFileFailed = jest.spyOn(uploader, 'onWhenAddingFileFailed');

        uploader.addToQueue([file]);

        expect(onWhenAddingFileFailed).toBeCalledTimes(1);
    });

    it('does not fire when file mime type matches expected by allowedMimeType filter', () => {
        const filterMimeType = fileMimeType;
        const uploader = new FileUploader({ url: '', allowedMimeType: [filterMimeType] });
        const onWhenAddingFileFailed = jest.spyOn(uploader, 'onWhenAddingFileFailed');

        uploader.addToQueue([file]);

        expect(file.type).toBe(filterMimeType);
        expect(onWhenAddingFileFailed).toBeCalledTimes(0);
    });

    it('fires when file mime type does not match expected by allowedMimeType filter', () => {
        const filterMimeType = "application/msword";
        const uploader = new FileUploader({ url: '', allowedMimeType: [filterMimeType] });
        const onWhenAddingFileFailed = jest.spyOn(uploader, 'onWhenAddingFileFailed');

        uploader.addToQueue([file]);

        expect(file.type).not.toBe(filterMimeType);
        expect(onWhenAddingFileFailed).toBeCalledTimes(1);
    });

    it('does not fire when a file matches the specified custom filter', () => {
        const positiveFilter: FilterFunction = { name: 'positive filter', fn: () => true };
        const uploader = new FileUploader({ url: '', filters: [positiveFilter] });
        const onWhenAddingFileFailed = jest.spyOn(uploader, 'onWhenAddingFileFailed');

        uploader.addToQueue([file]);

        expect(positiveFilter.fn(new FileLikeObject(file))).toBe(true);
        expect(onWhenAddingFileFailed).toBeCalledTimes(0);
    });

    it('fires when a file does not match the specified custom filter', () => {
        const negativeFilter: FilterFunction = { name: 'negative filter', fn: () => false };
        const uploader = new FileUploader({ url: '', filters: [negativeFilter] });
        const onWhenAddingFileFailed = jest.spyOn(uploader, 'onWhenAddingFileFailed');

        uploader.addToQueue([file]);

        expect(negativeFilter.fn(new FileLikeObject(file))).toBe(false);
        expect(onWhenAddingFileFailed).toBeCalledTimes(1);
    });

    it('fires only once per file for multiple not matched filters', () => {
        const uploader = new FileUploader(
            {
                url: '',
                maxFileSize: fileSize - 1,
                queueLimit: 1,
                allowedFileType: ["doc"],
                allowedMimeType: ["application/msword"],
                filters: [{ name: 'positive filter', fn: () => false }]
            });

        const onWhenAddingFileFailed = jest.spyOn(uploader, 'onWhenAddingFileFailed');
        const files = [file, file];

        uploader.addToQueue(files);

        expect(onWhenAddingFileFailed).toBeCalledTimes(files.length);
    });
});