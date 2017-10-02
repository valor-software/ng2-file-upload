import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { FileUploadModule } from '../file-upload/file-upload.module';
import { FileSelectDirective } from '../file-upload/file-select.directive';
import { FileUploader } from '../file-upload/file-uploader.class';

@Component({
  selector: 'container',
  template: `<input type="file"
                    ng2FileSelect
                    [uploader]="uploader"
             />`
})
export class ContainerComponent {
  public get url(): string { return 'localhost:3000'; }
  public uploader: FileUploader = new FileUploader({ url: this.url });
}

describe('Directive: FileSelectDirective', () => {
  let fixture: ComponentFixture<ContainerComponent>;
  let hostComponent: ContainerComponent;
  let directiveElement: DebugElement;
  let fileSelectDirective: FileSelectDirective;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ FileUploadModule ],
      declarations: [ ContainerComponent ],
      providers: [ ContainerComponent ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContainerComponent);
    hostComponent = fixture.componentInstance;

    fixture.detectChanges();

    directiveElement = fixture.debugElement.query(By.directive(FileSelectDirective));
    fileSelectDirective = directiveElement.injector.get(FileSelectDirective) as FileSelectDirective;
  });

  it('can be initialized', () => {
    expect(fixture).toBeDefined();
    expect(hostComponent).toBeDefined();
    expect(fileSelectDirective).toBeDefined();
  });

  it('can set file uploader', () => {
    expect(fileSelectDirective.uploader).toBe(hostComponent.uploader);
  });

  it('can get uploader options', () => {
    const options = fileSelectDirective.getOptions();

    // Check url set through binding
    expect(options.url).toBe(hostComponent.url);

    // Check default options
    expect(options.autoUpload).toBeFalsy();
    expect(options.isHTML5).toBeTruthy();
    expect(options.removeAfterUpload).toBeFalsy();
    expect(options.disableMultipart).toBeFalsy();
  });

  it('can get filters', () => {
    const filters = fileSelectDirective.getFilters();

    // TODO: Update test once implemented
    expect(filters).toEqual({});
  });

  it('can check if element is empty', () => {
    const isElementEmpty = fileSelectDirective.isEmptyAfterSelection();

    expect(isElementEmpty).toBeFalsy();
  });

  it('can listed on change event', () => {
    spyOn(fileSelectDirective, 'onChange');

    directiveElement.triggerEventHandler('change', {});

    expect(fileSelectDirective.onChange).toHaveBeenCalled();
  });

  it('handles change event', () => {
    spyOn(fileSelectDirective.uploader, 'addToQueue');

    fileSelectDirective.onChange();

    const expectedArguments = [ directiveElement.nativeElement.files,
      fileSelectDirective.getOptions(),
      fileSelectDirective.getFilters() ];
    expect(fileSelectDirective.uploader.addToQueue).toHaveBeenCalledWith(...expectedArguments);
  });
});
