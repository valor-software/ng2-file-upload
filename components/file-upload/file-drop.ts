import {
  Component, View, OnInit, OnDestroy, OnChanges,
  Directive, LifecycleEvent,
  EventEmitter, ElementRef, Renderer,
  CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass
} from 'angular2/angular2';

import {FileUploader} from './file-uploader';

@Directive({
  selector: '[ng2-file-drop]',
  properties: ['config: ng2FileDrop', 'uploader'],
  events: ['fileOver'],
  host: {
    '(drop)': 'onDrop($event)',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave($event)'
  }
})
export class FileDrop {
  public uploader:FileUploader;
  public config:any = {};
  private fileOver:EventEmitter = new EventEmitter();

  constructor(private element:ElementRef) {
  }

  getOptions() {
    return this.uploader.options;
  }

  getFilters() {
  }

  onDrop(event) {
    let transfer = this._getTransfer(event);
    if (!transfer) {
      return;
    }

    let options = this.getOptions();
    let filters = this.getFilters();
    this._preventAndStop(event);
    this.uploader.addToQueue(transfer.files, options, filters);
    this.fileOver.next(false);
  }

  onDragOver(event) {
    let transfer = this._getTransfer(event);
    if (!this._haveFiles(transfer.types)) {
      return;
    }

    transfer.dropEffect = 'copy';
    this._preventAndStop(event);
    this.fileOver.next(true);
  }

  onDragLeave(event) {
    if (event.currentTarget === this.element[0]) {
      return;
    }

    this._preventAndStop(event);
    this.fileOver.next(false);
  }

  _getTransfer(event) {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
  }

  _preventAndStop(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  _haveFiles(types) {
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

  _addOverClass(item) {
    item.addOverClass();
  }

  _removeOverClass(item) {
    item.removeOverClass();
  }
}
