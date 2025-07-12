import { Directive, ElementRef, HostListener, inject, input, output } from '@angular/core';

import { FileUploader, FileUploaderOptions } from './file-uploader.class';

@Directive({ selector: '[ng2FileDrop]', standalone: false })
export class FileDropDirective {
  readonly uploader = input<FileUploader>();
  readonly fileOver = output<any>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onFileDrop = output<File[]>();

  protected readonly element = inject(ElementRef);

  getOptions(): FileUploaderOptions | void {
    return this.uploader()?.options;
  }

  getFilters(): string {
    return '';
  }

  @HostListener('drop', ['$event'])
  onDrop(event: MouseEvent): void {
    const transfer = this._getTransfer(event);
    if (!transfer) {
      return;
    }

    const options = this.getOptions();
    const filters = this.getFilters();
    this._preventAndStop(event);
    if (options) {
      this.uploader()?.addToQueue(transfer.files, options, filters);
    }
    this.fileOver.emit(false);
    this.onFileDrop.emit(transfer.files);
  }

  @HostListener('dragover', ['$event'])
  onDragOver(event: MouseEvent): void {
    const transfer = this._getTransfer(event);
    if (!this._haveFiles(transfer.types)) {
      return;
    }

    transfer.dropEffect = 'copy';
    this._preventAndStop(event);
    this.fileOver.emit(true);
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event: MouseEvent): void {
    if ((this as any).element) {
      if (event.currentTarget === (this as any).element[0]) {
        return;
      }
    }

    this._preventAndStop(event);
    this.fileOver.emit(false);
  }

  protected _getTransfer(event: any): any {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
  }

  protected _preventAndStop(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  protected _haveFiles(types: any): boolean {
    if (!types) {
      return false;
    }

    if (types.indexOf) {
      return types.indexOf('Files') !== -1;
    }

    if (types.contains) {
      return types.contains('Files');
    }
    return false;
  }
}
