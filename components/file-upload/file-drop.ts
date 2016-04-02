import { Directive, EventEmitter, ElementRef } from 'angular2/core';

import { FileUploader } from './file-uploader';

@Directive({
  selector: '[ng2-file-drop]',
  properties: ['uploader'],
  events: ['fileOver','onFileDrop'],
  host: {
    '(drop)': 'onDrop($event)',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave($event)'
  }
})
export class FileDrop {
  public uploader:FileUploader;
  private fileOver:EventEmitter<any> = new EventEmitter();
  private onFileDrop:EventEmitter<File> = new EventEmitter();

  constructor(private element:ElementRef) {
  }

  getOptions() {
    return this.uploader.options;
  }

  getFilters() {
  }

  onDrop(event:any) {
    let transfer = this._getTransfer(event);
    if (!transfer) {
      return;
    }

    let options = this.getOptions();
    let filters = this.getFilters();
    this._preventAndStop(event);
    this.uploader.addToQueue(transfer.files, options, filters);
    this.onFileDrop.emit(transfer.files[0]);
    this.fileOver.next(false);
  }

  onDragOver(event:any) {
    let transfer = this._getTransfer(event);
    if (!this._haveFiles(transfer.types)) {
      return;
    }

    transfer.dropEffect = 'copy';
    this._preventAndStop(event);
    this.fileOver.next(true);
  }

  onDragLeave(event:any):any {
    if (event.currentTarget === (<any>this).element[0]) {
      return;
    }

    this._preventAndStop(event);
    this.fileOver.next(false);
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

  _addOverClass(item:any):any {
    item.addOverClass();
  }

  _removeOverClass(item:any):any {
    item.removeOverClass();
  }
}
