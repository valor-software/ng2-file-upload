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

  constructor(private uploader:FileUploader, private some:any, private options:any) {
    this.file = new FileLikeObject(some);
    this._file = some;
    this.url = uploader.url;
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

  public onProgress(progress) {
  }

  public onSuccess(response, status, headers) {
  }

  public onError(response, status, headers) {
  }

  public onCancel(response, status, headers) {
  }

  public onComplete(response, status, headers) {
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

  private _onProgress(progress) {
    this.progress = progress;
    this.onProgress(progress);
  }

  private _onSuccess(response, status, headers) {
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

  private _onError(response, status, headers) {
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

  private _onCancel(response, status, headers) {
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

  private _onComplete(response, status, headers) {
    this.onComplete(response, status, headers);

    if (this.uploader.removeAfterUpload) {
      this.remove();
    }
  }

  private _destroy() {
  }

  private _prepareToUploading() {
    this.index = this.index || ++this.uploader._nextIndex;
    this.isReady = true;
  }

  _replaceNode(input) {
  }
}
