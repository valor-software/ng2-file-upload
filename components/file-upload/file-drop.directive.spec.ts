import {Component} from '@angular/core';
import {inject,ComponentFixture, TestBed} from '@angular/core/testing';

import {FileUploader} from './file-uploader.class';
import {FileUploadModule} from './file-upload.module';

@Component({
  selector: 'container',
  template: `<input type="file" ng2FileSelect [uploader]="uploader" />`
})
export class ContainerComponent {
  public uploader:FileUploader = new FileUploader({url: 'localhost:3000'});
}

describe('Directive: FileSelectDirective', () => {
  beforeEach(() => [
    TestBed.configureTestingModule({
      imports: [FileUploadModule],
      declarations: [ContainerComponent],
      providers: [ContainerComponent]
    })
  ]);

  it('should be fine', inject([ContainerComponent], (fixture:ComponentFixture<ContainerComponent>) => {
    expect(fixture).not.toBeNull();
  }));
});
