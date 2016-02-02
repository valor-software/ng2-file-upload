import { ElementRef } from 'angular2/core';
import { FileUploader } from './file-uploader';
export declare class FileSelect {
    private element;
    uploader: FileUploader;
    constructor(element: ElementRef);
    getOptions(): any;
    getFilters(): void;
    isEmptyAfterSelection(): boolean;
    onChange(): void;
}
export declare const fileUpload: Array<any>;
