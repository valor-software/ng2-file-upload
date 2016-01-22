import {NgZone} from 'angular2/core';
import {FileLikeObject} from './file-like-object';
import {FileUploader} from './file-uploader';

export class FileItem {
  public file:FileLikeObject;
  public _file:File;
  public alias:string = 'file';
  public url:string = '/';
  public method:string = 'POST';
  public headers:any = [];
  public withCredentials:boolean = true;
  public formData:any = [];
  public isReady:boolean = false;
  public isUploading:boolean = false;
  public isUploaded:boolean = false;
  public isSuccess:boolean = false;
  public isCancel:boolean = false;
  public isError:boolean = false;
  public progress:number = 0;
  public index:number = null;
  private _zone:NgZone;

  constructor(private uploader:FileUploader, private some:any, private options:any) {
    this.file = new FileLikeObject(some);
    this._file = some;
    this.url = uploader.url;
    this._zone = new NgZone({ enableLongStackTrace: false });
  }

  public upload() {
    try {
      this.uploader.uploadItem(this);
    } catch (e) {
      this.uploader._onCompleteItem(this, '', 0, []);
      this.uploader._onErrorItem(this, '', 0, []);
    }
  }

  public cancel() {
    this.uploader.cancelItem(this);
  }

  public remove() {
    this.uploader.removeFromQueue(this);
  }

  public onBeforeUpload() {
  }

  public onProgress(progress:number) {
  }

  public onSuccess(response:any, status:any, headers:any) {
  }

  public onError(response:any, status:any, headers:any) {
  }

  public onCancel(response:any, status:any, headers:any) {
  }

  public onComplete(response:any, status:any, headers:any) {
  }

  private _onBeforeUpload() {
    this.isReady = true;
    this.isUploading = true;
    this.isUploaded = false;
    this.isSuccess = false;
    this.isCancel = false;
    this.isError = false;
    this.progress = 0;
    this.onBeforeUpload();
  }

  private _onProgress(progress:number) {
    this._zone.run(() => {
      this.progress = progress;
    });
    this.onProgress(progress);
  }

  private _onSuccess(response:any, status:any, headers:any) {
    this.isReady = false;
    this.isUploading = false;
    this.isUploaded = true;
    this.isSuccess = true;
    this.isCancel = false;
    this.isError = false;
    this.progress = 100;
    this.index = null;
    this.onSuccess(response, status, headers);
  }

  private _onError(response:any, status:any, headers:any) {
    this.isReady = false;
    this.isUploading = false;
    this.isUploaded = true;
    this.isSuccess = false;
    this.isCancel = false;
    this.isError = true;
    this.progress = 0;
    this.index = null;
    this.onError(response, status, headers);
  }

  private _onCancel(response:any, status:any, headers:any) {
    this.isReady = false;
    this.isUploading = false;
    this.isUploaded = false;
    this.isSuccess = false;
    this.isCancel = true;
    this.isError = false;
    this.progress = 0;
    this.index = null;
    this.onCancel(response, status, headers);
  }

  private _onComplete(response:any, status:any, headers:any) {
    this.onComplete(response, status, headers);

    if (this.uploader.removeAfterUpload) {
      this.remove();
    }
  }

  private _prepareToUploading() {
    this.index = this.index || ++this.uploader._nextIndex;
    this.isReady = true;
  }
}
