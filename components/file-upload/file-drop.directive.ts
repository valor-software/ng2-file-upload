import { Directive, EventEmitter, ElementRef, HostListener, Input, Output } from '@angular/core';

import { FileUploader } from './file-uploader.class';

@Directive({selector: '[ng2FileDrop]'})
export class FileDropDirective {
  @Input() public uploader:FileUploader;
  @Output() public fileOver:EventEmitter<any> = new EventEmitter();
  @Output() public onFileDrop:EventEmitter<File[]> = new EventEmitter();

  private element:ElementRef;
  public constructor(element:ElementRef) {
    this.element = element;
  }

  public getOptions():any {
    return this.uploader.options;
  }

  public getFilters():any {
    return {};
  }

  @HostListener('drop', ['$event'])
  public onDrop(event:any):void {
    let transfer = this._getTransfer(event);
    if (!transfer) {
      return;
    }

    let options = this.getOptions();
    let filters = this.getFilters();
    this._preventAndStop(event);
    this.uploader.addToQueue(transfer.files, options, filters);
    this.fileOver.emit(false);
    this.onFileDrop.emit(transfer.files);
  }

  @HostListener('dragover', ['$event'])
  public onDragOver(event:any):void {
    let transfer = this._getTransfer(event);
    if (!this._haveFiles(transfer.types)) {
      return;
    }

    transfer.dropEffect = 'copy';
    this._preventAndStop(event);
    this.fileOver.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event:any):any {
    if (event.currentTarget === (this as any).element[0]) {
      return;
    }

    this._preventAndStop(event);
    this.fileOver.emit(false);
  }

  private _getTransfer(event:any):any {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
  }

  private _preventAndStop(event:any):any {
    event.preventDefault();
    event.stopPropagation();
  }

  private _haveFiles(types:any):any {
    if (!types) {
      return false;
    }

    if (types.indexOf) {
      return types.indexOf('Files') !== -1;
    } else if (types.contains) {
      return types.contains('Files');
    } else {
      return false;
    }
  }
/*
  _addOverClass(item:any):any {
    item.addOverClass();
  }

  _removeOverClass(item:any):any {
    item.removeOverClass();
  }*/
}
