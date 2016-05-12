import {Component, ElementRef, Renderer, Input, HostListener, HostBinding, OnInit} from '@angular/core';
import {FileUploader, FileUploaderOptions} from '../../../../ng2-file-upload';

@Component({
  selector: 'demo-file-upload',
  providers: [FileUploader],
  template: require('./demo.html'),
  styles: [':host {border:1px solid black; padding:59px;display: block;}' +
  '.hover {border: 3px solid green; backgroud: black;}']
})
export class DemoFileUploadComponent implements OnInit {

  @Input() public url:string;
  @Input() public queueLimit:number;
  @Input() public maxFileSize:number;
  @Input() public autoUpload:boolean;
  @Input() public allowedMimeType:Array<string>;
  @Input() public allowedFileType:Array<string>;
  @Input() public headers:Array<any>;

  @HostBinding('class.hover') private isHover:boolean = false;

  private inputs:string[] = ['allowedMimeType',
    'allowedFileType',
    'autoUpload',
    'isHTML5',
    'headers',
    'maxFileSize',
    'queueLimit',
    'removeAfterUpload',
    'url'
  ];

  private uploaderOptions:FileUploaderOptions = {};

  private multiple:boolean = true;

  private element:ElementRef;
  private fileUploadService:FileUploader;
  private renderer:Renderer;

  public constructor(element:ElementRef, fileUploadService:FileUploader, renderer:Renderer) {
    this.element = element;
    this.fileUploadService = fileUploadService;
    this.renderer = renderer;
  }

  public ngOnInit():any {
    for (let input of this.inputs) {
      if (this[input]) {
        this.uploaderOptions[input] = this[input];
      }
    }
    this.fileUploadService.setOptions(this.uploaderOptions);

    this.multiple = (!this.queueLimit || this.queueLimit > 1);
  }

  @HostListener('drop', ['$event'])
  public onDrop(event:any):void {
    this._preventAndStop(event);
    this.isHover = false;

    let transfer = this._getTransfer(event);
    if (!transfer) {
      return;
    }
    this.fileUploadService.addToQueue(transfer.files);
  }

  @HostListener('dragover', ['$event'])
  public onDragOver(event:any):void {
    this._preventAndStop(event);

    if (this.isHover) {
      return;
    }

    let transfer = this._getTransfer(event);
    if (!this._haveFiles(transfer.types)) {
      return;
    }
    this.isHover = true;
  }

  @HostListener('dragleave', ['$event'])
  public onDragLeave(event:any):void {
    this._preventAndStop(event);
    if (event.currentTarget === (this as any).element[0]) {
      return;
    }
    this.isHover = false;
  }

  public onChange($event:any):void {
    this.fileUploadService.addToQueue($event.srcElement.files);
  }

  private _getTransfer(event:any):any {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _preventAndStop(event:any):any {
    event.preventDefault();
    event.stopPropagation();
  }

  private _haveFiles(types:any):any {
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
