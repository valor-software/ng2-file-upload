import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { inject, ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploader } from '../file-upload/file-uploader.class';
import { FileUploadModule } from '../file-upload/file-upload.module';
import { FileDropDirective } from '../file-upload/file-drop.directive';

@Component({
  selector: 'container',
  template: `<div type="file"
                    ng2FileDrop
                    [uploader]="uploader"
             ></div>`
})
export class ContainerComponent {
  public get url(): string { return 'localhost:3000'; }
  public uploader: FileUploader = new FileUploader({ url: this.url });
}

describe('Directive: FileDropDirective', () => {

  let fixture: ComponentFixture<ContainerComponent>;
  let hostComponent: ContainerComponent;
  let directiveElement: DebugElement;
  let fileDropDirective: FileDropDirective;

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

    directiveElement = fixture.debugElement.query(By.directive(FileDropDirective));
    fileDropDirective = directiveElement.injector.get(FileDropDirective) as FileDropDirective;
  });

  it('can be initialized', () => {
    expect(fixture).toBeDefined();
    expect(hostComponent).toBeDefined();
    expect(fileDropDirective).toBeDefined();
  });

  it('can set file uploader', () => {
    expect(fileDropDirective.uploader).toBe(hostComponent.uploader);
  });

  it('can get uploader options', () => {
    const options = fileDropDirective.getOptions();

    // Check url set through binding
    expect(options.url).toBe(hostComponent.url);

    // Check default options
    expect(options.autoUpload).toBeFalsy();
    expect(options.isHTML5).toBeTruthy();
    expect(options.removeAfterUpload).toBeFalsy();
    expect(options.disableMultipart).toBeFalsy();
  });

  it('can get filters', () => {
    const filters = fileDropDirective.getFilters();

    // TODO: Update test once implemented
    expect(filters).toEqual({});
  });

  it('handles drop event', () => {
    spyOn(fileDropDirective, 'onDrop');

    directiveElement.triggerEventHandler('drop', getFakeEventData());

    expect(fileDropDirective.onDrop).toHaveBeenCalled();
  });

  it('adds file to upload', () => {
    spyOn(fileDropDirective.uploader, 'addToQueue');

    let fileOverData;
    fileDropDirective.fileOver.subscribe((data: any) => fileOverData = data);

    let fileDropData;
    fileDropDirective.onFileDrop.subscribe((data: File[]) => fileDropData = data);

    fileDropDirective.onDrop(getFakeEventData());

    const uploadedFiles = getFakeEventData().dataTransfer.files;
    const expectedArguments = [ uploadedFiles, fileDropDirective.getOptions(), fileDropDirective.getFilters() ];

    expect(fileDropDirective.uploader.addToQueue).toHaveBeenCalledWith(...expectedArguments);
    expect(fileOverData).toBeFalsy();
    expect(fileDropData).toEqual(uploadedFiles);
  });

  it('handles dragover event', () => {
    spyOn(fileDropDirective, 'onDragOver');

    directiveElement.triggerEventHandler('dragover', getFakeEventData());

    expect(fileDropDirective.onDragOver).toHaveBeenCalled();
  });

  it('handles file over', () => {
    let fileOverData;
    fileDropDirective.fileOver.subscribe((data: any) => fileOverData = data);

    fileDropDirective.onDragOver(getFakeEventData());

    expect(fileOverData).toBeTruthy();
  });

  it('handles dragleave event', () => {
    spyOn(fileDropDirective, 'onDragLeave');

    directiveElement.triggerEventHandler('dragleave', getFakeEventData());

    expect(fileDropDirective.onDragLeave).toHaveBeenCalled();
  });

  it('handles file over leave', () => {
    let fileOverData;
    fileDropDirective.fileOver.subscribe((data: any) => fileOverData = data);

    fileDropDirective.onDragLeave(getFakeEventData());

    expect(fileOverData).toBeFalsy();
  });
});

function getFakeEventData(): any {
  return {
    dataTransfer: {
      files: [ 'foo.bar' ],
      types: [ 'Files' ]
    },
    preventDefault: () => undefined,
    stopPropagation: () => undefined
  }
}
