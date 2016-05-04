import { Directive, ElementRef } from '@angular/core';

import {FileUploader} from './file-uploader';

// todo: filters

@Directive({
  selector: '[ng2-file-select]',
  properties: ['uploader'],
  host: {
    '(change)': 'onChange()'
  }
})
export class FileSelect {
  public uploader:FileUploader;

  constructor(private element:ElementRef) {
  }

  public getOptions() {
    return this.uploader.options;
  }

  public getFilters() {
  }

  public isEmptyAfterSelection():boolean {
    return !!this.element.nativeElement.attributes.multiple;
  }

  onChange() {
    // let files = this.uploader.isHTML5 ? this.element.nativeElement[0].files : this.element.nativeElement[0];
    let files = this.element.nativeElement.files;
    let options = this.getOptions();
    let filters = this.getFilters();

    // if(!this.uploader.isHTML5) this.destroy();

    this.uploader.addToQueue(files, options, filters);
    if (this.isEmptyAfterSelection()) {
      // todo
      // this.element.nativeElement.properties.value = '';
      /*this.element.nativeElement
       .replaceWith(this.element = this.element.nativeElement.clone(true)); // IE fix*/
    }
  }
}

export const fileUpload:Array<any> = [FileSelect];
