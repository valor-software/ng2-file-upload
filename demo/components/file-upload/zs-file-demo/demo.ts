import {Component, EventEmitter, ElementRef, Renderer, Input} from 'angular2/core';
import {FileUploader, FileUploaderOptionsInterface} from '../../../../ng2-file-upload';

@Component({
  selector: 'demo-file-upload',
  providers: [FileUploader],
  directives: [],
  pipes: [],
  host: {
    '(drop)': 'onDrop($event)',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave($event)',
    '[class.hover]': 'isHover'
  },
  template: require('./demo.html'),
  styles: [':host {border:1px solid black; padding:59px;display: block;}' +
  '.hover {border: 3px solid green; backgroud: black;}']
})
export class DemoFileUpload {

  @Input() url: string;
  @Input() queueLimit: number;
  @Input() maxFileSize: number;
  @Input() autoUpload: boolean;
  @Input() allowedMimeType: Array<string>;
  @Input() allowedFileType: Array<string>;
  @Input() headers: Array<any>;

  private inputs = ['allowedMimeType',
    'allowedFileType',
    'autoUpload',
    'isHTML5',
    'headers',
    'maxFileSize',
    'queueLimit',
    'removeAfterUpload',
    'url',
  ];

  private uploaderOptions: FileUploaderOptionsInterface = {};

  private isHover: boolean = false;
  private multiple: boolean = true;

  constructor(private element: ElementRef,
              private fileUploadService: FileUploader,
              private renderer: Renderer) {
  }

  ngOnInit() {
    for (let input of this.inputs) {
      if (this[input]) {
        this.uploaderOptions[input] = this[input];
      }
    }
    this.fileUploadService.setOptions(this.uploaderOptions);

    this.multiple = (!this.queueLimit || this.queueLimit > 1);
  }


  onDrop(event: any) {
    this._preventAndStop(event);
    this.isHover = false;

    let transfer = this._getTransfer(event);
    if (!transfer) {
      return;
    }
    this.fileUploadService.addToQueue(transfer.files);
  }

  onDragOver(event: any) {
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

  onDragLeave(event: any): any {
    this._preventAndStop(event);
    if (event.currentTarget === (<any>this).element[0]) {
      return;
    }
    this.isHover = false;
  }

  onChange($event) {
    this.fileUploadService.addToQueue($event.srcElement.files);
  }


  private _getTransfer(event: any): any {
    return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
  }

  private _preventAndStop(event: any): any {
    event.preventDefault();
    event.stopPropagation();
  }

  private _haveFiles(types: any): any {
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
