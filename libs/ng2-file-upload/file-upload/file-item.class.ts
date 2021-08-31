import { FileLikeObject } from './file-like-object.class';
import { FileUploader, ParsedResponseHeaders, FileUploaderOptions } from './file-uploader.class';

export class FileItem {
  public file: FileLikeObject;
  public _file: File;
  public alias?: string;
  public url? = '/';
  public method?: string;
  public headers: any = [];
  public withCredentials = true;
  public formData: any = [];
  public isReady = false;
  public isUploading = false;
  public isUploaded = false;
  public isSuccess = false;
  public isCancel = false;
  public isError = false;
  public progress = 0;
  public index?: number;
  public _xhr?: XMLHttpRequest;
  public _form: any;

  protected uploader: FileUploader;
  protected some: File;
  protected options: FileUploaderOptions;

  public constructor(uploader: FileUploader, some: File, options: FileUploaderOptions) {
    this.uploader = uploader;
    this.some = some;
    this.options = options;
    this.file = new FileLikeObject(some);
    this._file = some;
    if (uploader.options) {
      this.method = uploader.options.method || 'POST';
      this.alias = uploader.options.itemAlias || 'file';
    }
    this.url = uploader.options.url;
  }

  public upload(): void {
    try {
      this.uploader.uploadItem(this);
    } catch (e) {
      this.uploader._onCompleteItem(this, '', 0, {});
      this.uploader._onErrorItem(this, '', 0, {});
    }
  }

  public cancel(): void {
    this.uploader.cancelItem(this);
  }

  public remove(): void {
    this.uploader.removeFromQueue(this);
  }

  public onBeforeUpload(): void {
    return void 0;
  }

  public onBuildForm(form: any): any {
    return { form };
  }

  public onProgress(progress: number): any {
    return { progress };
  }

  public onSuccess(response: string, status: number, headers: ParsedResponseHeaders): any {
    return { response, status, headers };
  }

  public onError(response: string, status: number, headers: ParsedResponseHeaders): any {
    return { response, status, headers };
  }

  public onCancel(response: string, status: number, headers: ParsedResponseHeaders): any {
    return { response, status, headers };
  }

  public onComplete(response: string, status: number, headers: ParsedResponseHeaders): any {
    return { response, status, headers };
  }

  public _onBeforeUpload(): void {
    this.isReady = true;
    this.isUploading = true;
    this.isUploaded = false;
    this.isSuccess = false;
    this.isCancel = false;
    this.isError = false;
    this.progress = 0;
    this.onBeforeUpload();
  }

  public _onBuildForm(form: any): void {
    this.onBuildForm(form);
  }

  public _onProgress(progress: number): void {
    this.progress = progress;
    this.onProgress(progress);
  }

  public _onSuccess(response: string, status: number, headers: ParsedResponseHeaders): void {
    this.isReady = false;
    this.isUploading = false;
    this.isUploaded = true;
    this.isSuccess = true;
    this.isCancel = false;
    this.isError = false;
    this.progress = 100;
    this.index = undefined;
    this.onSuccess(response, status, headers);
  }

  public _onError(response: string, status: number, headers: ParsedResponseHeaders): void {
    this.isReady = false;
    this.isUploading = false;
    this.isUploaded = true;
    this.isSuccess = false;
    this.isCancel = false;
    this.isError = true;
    this.progress = 0;
    this.index = undefined;
    this.onError(response, status, headers);
  }

  public _onCancel(response: string, status: number, headers: ParsedResponseHeaders): void {
    this.isReady = false;
    this.isUploading = false;
    this.isUploaded = false;
    this.isSuccess = false;
    this.isCancel = true;
    this.isError = false;
    this.progress = 0;
    this.index = undefined;
    this.onCancel(response, status, headers);
  }

  public _onComplete(response: string, status: number, headers: ParsedResponseHeaders): void {
    this.onComplete(response, status, headers);

    if (this.uploader.options.removeAfterUpload) {
      this.remove();
    }
  }

  public _prepareToUploading(): void {
    this.index = this.index || ++this.uploader._nextIndex;
    this.isReady = true;
  }
}
