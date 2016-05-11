import {Component} from '@angular/core';
import {it, inject, beforeEachProviders} from '@angular/core/testing';
import {ComponentFixture} from '@angular/compiler/testing';
import {FileUploader} from './file-uploader.class';
import {FileSelectDirective} from './file-select.directive';
@Component({
  selector: 'container',
  template: `<input type="file" ng2FileSelect [uploader]="uploader" />`,
  directives: [FileSelectDirective]
})
export class ContainerComponent {
  public uploader:FileUploader = new FileUploader({url: 'localhost:3000'});
}
describe('Directive: FileSelectDirective', () => {
  beforeEachProviders(() => [
    ContainerComponent
  ]);
  it('should be fine', inject([ContainerComponent], (fixture:ComponentFixture<ContainerComponent>) => {
    expect(fixture).not.toBeNull();
  }));
});
