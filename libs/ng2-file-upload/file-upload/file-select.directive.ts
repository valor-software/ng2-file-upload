import { Directive, ElementRef, HostListener, inject, input, output } from '@angular/core';

import { FileUploader, FileUploaderOptions } from './file-uploader.class';

@Directive({ selector: '[ng2FileSelect]', standalone: false })
export class FileSelectDirective {
  readonly uploader = input<FileUploader>();
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  readonly onFileSelected = output<File[]>();

  protected element = inject(ElementRef);

  getOptions(): FileUploaderOptions | undefined {
    return this.uploader()?.options;
  }

  getFilters(): string {
    return '';
  }

  isEmptyAfterSelection(): boolean {
    return !!this.element.nativeElement.attributes.multiple;
  }

  @HostListener('change')
  onChange(): void {
    const files = this.element.nativeElement.files;
    const options = this.getOptions();
    const filters = this.getFilters();
    this.uploader()?.addToQueue(files, options, filters);

    this.onFileSelected.emit(files);
    if (this.isEmptyAfterSelection()) {
      this.element.nativeElement.value = '';
    }
  }
}
