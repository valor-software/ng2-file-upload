import { Directive, ElementRef, Input, HostListener } from '@angular/core';

import { FileUploader } from './file-uploader.class';
import { FileItem } from './file-item.class';

// todo: filters

@Directive({selector: '[ng2FileSelect]'})
export class FileSelectDirective {
  @Input() public uploader:FileUploader;

  lastFile:FileItem;

  protected element:ElementRef;

  public constructor(element:ElementRef) {
    this.element = element;
  }

  public getOptions():any {
    return this.uploader.options;
  }

  public getFilters():any {
    return void 0;
  }

  public isMultiple():boolean {
    return !!this.element.nativeElement.attributes.multiple;
  }

  @HostListener('change')
  public onChange():any {
    // let files = this.uploader.isHTML5 ? this.element.nativeElement[0].files : this.element.nativeElement[0];
    let files = this.element.nativeElement.files;
    let options = this.getOptions();
    let filters = this.getFilters();

    // if(!this.uploader.isHTML5) this.destroy();
    
    // if not multiple, remove previously added file so we can replace it with the new one
    if(!this.isMultiple() && this.lastFile & !this.lastFile.uploaded) this.uploader.removeFromQueue(this.lastFile);

    this.uploader.addToQueue(files, options, filters);
    
    // save file so we can remove it later
    this.lastFile = this.uploader.queue[this.uploader.queue.length - 1];
    
    if (this.isMultiple()) {
      // todo
      this.element.nativeElement.value = '';
      /*this.element.nativeElement
       .replaceWith(this.element = this.element.nativeElement.clone(true)); // IE fix*/
    }
  }
}
