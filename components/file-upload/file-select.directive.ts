import { Directive, ElementRef, Input, HostListener } from '@angular/core';

import {FileUploader} from './file-uploader.class';

// todo: filters

@Directive({selector: '[ng2FileSelect]'})
export class FileSelectDirective {
  @Input() public uploader:FileUploader;

  private element:ElementRef;
  public constructor(element:ElementRef) {
    this.element = element;
  }

  public getOptions():any {
    return this.uploader.options;
  }

  public getFilters():any {
    return void 0;
  }

  public isEmptyAfterSelection():boolean {
    return !!this.element.nativeElement.attributes.multiple;
  }

  @HostListener('change')
  public onChange():any {
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
