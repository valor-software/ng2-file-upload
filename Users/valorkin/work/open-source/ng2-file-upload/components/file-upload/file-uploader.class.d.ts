import { FileLikeObject } from './file-like-object.class';
import { FileItem } from './file-item.class';
export interface Headers {
    name: string;
    value: string;
}
export declare type ParsedResponseHeaders = {
    [headerFieldName: string]: string;
};
export declare type FilterFunction = {
    name: string;
    fn: (item?: FileLikeObject, options?: FileUploaderOptions) => boolean;
};
export interface FileUploaderOptions {
    allowedMimeType?: Array<string>;
    allowedFileType?: Array<string>;
    autoUpload?: boolean;
    isHTML5?: boolean;
    filters?: Array<FilterFunction>;
    headers?: Array<Headers>;
    method?: string;
    authToken?: string;
    maxFileSize?: number;
    queueLimit?: number;
    removeAfterUpload?: boolean;
    url?: string;
    disableMultipart?: boolean;
    itemAlias?: string;
}
export declare class FileUploader {
    authToken: string;
    isUploading: boolean;
    queue: Array<FileItem>;
    progress: number;
    _nextIndex: number;
    autoUpload: any;
    options: FileUploaderOptions;
    private _failFilterIndex;
    constructor(options: FileUploaderOptions);
    setOptions(options: FileUploaderOptions): void;
    addToQueue(files: File[], options?: FileUploaderOptions, filters?: FilterFunction[] | string): void;
    removeFromQueue(value: FileItem): void;
    clearQueue(): void;
    uploadItem(value: FileItem): void;
    cancelItem(value: FileItem): void;
    uploadAll(): void;
    cancelAll(): void;
    isFile(value: any): boolean;
    isFileLikeObject(value: any): boolean;
    getIndexOfItem(value: any): number;
    getNotUploadedItems(): Array<any>;
    getReadyItems(): Array<any>;
    destroy(): void;
    onAfterAddingAll(fileItems: any): any;
    onBuildItemForm(fileItem: FileItem, form: any): any;
    onAfterAddingFile(fileItem: FileItem): any;
    onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any): any;
    onBeforeUploadItem(fileItem: FileItem): any;
    onProgressItem(fileItem: FileItem, progress: any): any;
    onProgressAll(progress: any): any;
    onSuccessItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any;
    onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any;
    onCancelItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any;
    onCompleteItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): any;
    onCompleteAll(): any;
    _mimeTypeFilter(item: FileLikeObject): boolean;
    _fileSizeFilter(item: FileLikeObject): boolean;
    _fileTypeFilter(item: FileLikeObject): boolean;
    _onErrorItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): void;
    _onCompleteItem(item: FileItem, response: string, status: number, headers: ParsedResponseHeaders): void;
    protected _headersGetter(parsedHeaders: ParsedResponseHeaders): any;
    protected _xhrTransport(item: FileItem): any;
    private _getTotalProgress(value?);
    private _getFilters(filters);
    private _render();
    private _queueLimitFilter();
    private _isValidFile(file, filters, options);
    private _isSuccessCode(status);
    private _transformResponse(response, headers);
    private _parseHeaders(headers);
    private _onWhenAddingFileFailed(item, filter, options);
    private _onAfterAddingFile(item);
    private _onAfterAddingAll(items);
    private _onBeforeUploadItem(item);
    private _onBuildItemForm(item, form);
    private _onProgressItem(item, progress);
    private _onSuccessItem(item, response, status, headers);
    private _onCancelItem(item, response, status, headers);
}
