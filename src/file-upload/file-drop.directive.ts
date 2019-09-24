import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

import { FileUploader, FileUploaderOptions, FilterFunction } from './file-uploader.class';

@Directive({ selector: '[ng2FileDrop]' })
export class FileDropDirective {
  @Input() public uploader: FileUploader;
  // tslint:disable-next-line:no-input-rename
  @Input('ng2FileFilter') public filter: FilterFunction['fn'];
  @Output() public fileOver: EventEmitter<any> = new EventEmitter();
  @Output() public onFileDrop: EventEmitter<FileList> = new EventEmitter<FileList>();

  protected element: ElementRef;

  public constructor(element: ElementRef) {
    this.element = element;
  }

  public getOptions(): FileUploaderOptions {
    return this.uploader.options;
  }

  public getFilters(): any {
    return {};
  }

  @HostListener('drop', ['$event'])
  public onDrop(event: any): void {
    let transfer = this._getTransfer(event);
    if (!transfer) {
      return;
    }

    let options = this.getOptions();
    let filters = typeof this.filter === 'function' ? [{
      name: 'ng2FileDropDirectiveFilter',
      fn: this.filter
    }, ...options.filters] : this.getFilters();
    this._preventAndStop(event);
    this.uploader.addToQueue(transfer.files, options, filters);
    this.fileOver.emit(false);
    this.onFileDrop.emit(transfer.files);
  }

  @HostListener('dragover', ['$event'])
  public onDragOver(event: any): void {
    let transfer = this._getTransfer(event);
    if (!this._haveFiles(transfer.types)) {
      return;
    }

    transfer.dropEffect = 'copy';
    this._preventAndStop(event);
    this.fileOver.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event: any): any {
    if ((this as any).element) {
      if (event.currentTarget === (this as any).element[0]) {
        return;
      }
    }

    this._preventAndStop(event);
    this.fileOver.emit(false);
  }

  protected _getTransfer(event: any): DragEvent['dataTransfer'] {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
  }

  protected _preventAndStop(event: Event): any {
    event.preventDefault();
    event.stopPropagation();
  }

  protected _haveFiles(types: any): any {
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
}
