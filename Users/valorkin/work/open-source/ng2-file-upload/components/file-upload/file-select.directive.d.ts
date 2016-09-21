import { ElementRef } from '@angular/core';
import { FileUploader } from './file-uploader.class';
export declare class FileSelectDirective {
    uploader: FileUploader;
    private element;
    constructor(element: ElementRef);
    getOptions(): any;
    getFilters(): any;
    isEmptyAfterSelection(): boolean;
    onChange(): any;
}
