import { ElementRef } from 'angular2/core';
import { FileUploader } from './file-uploader';
export declare class FileDrop {
    private element;
    uploader: FileUploader;
    private fileOver;
    constructor(element: ElementRef);
    getOptions(): any;
    getFilters(): void;
    onDrop(event: any): void;
    onDragOver(event: any): void;
    onDragLeave(event: any): any;
    private _getTransfer(event);
    private _preventAndStop(event);
    private _haveFiles(types);
    _addOverClass(item: any): any;
    _removeOverClass(item: any): any;
}
