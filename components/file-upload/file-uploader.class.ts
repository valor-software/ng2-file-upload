import {FileLikeObject} from './file-like-object.class';
import {FileItem} from './file-item.class';
function isFile(value:any):boolean {
  return (File && value instanceof File);
}
// function isFileLikeObject(value:any) {
//   return value instanceof FileLikeObject;
// }
export class FileUploader {
  public url:string;
  public authToken:string;
  public isUploading:boolean = false;
  public queue:Array<any> = [];
  public progress:number = 0;
  public autoUpload:boolean = false;
  public isHTML5:boolean = true;
  public removeAfterUpload:boolean = false;
  public queueLimit:number;
  public _nextIndex:number = 0;
  public filters:Array<any> = [];
  public options:any;
  private _failFilterIndex:number;

  public constructor(options:any) {
    // Object.assign(this, options);
    this.url = options.url;
    this.authToken = options.authToken;
    this.autoUpload = options.autoUpload;
    this.filters.unshift({name: 'queueLimit', fn: this._queueLimitFilter});
    this.filters.unshift({name: 'folder', fn: this._folderFilter});
  }

  public addToQueue(files:any[], options:any, filters:any):void {
    let list:any[] = [];
    for (let file of files) {
      list.push(file);
    }
    let arrayOfFilters = this._getFilters(filters);
    let count = this.queue.length;
    let addedFileItems:any[] = [];
    list.map((some:any) => {
      let temp = new FileLikeObject(some);
      if (this._isValidFile(temp, arrayOfFilters, options)) {
        let fileItem = new FileItem(this, some, options);
        addedFileItems.push(fileItem);
        this.queue.push(fileItem);
        this._onAfterAddingFile(fileItem);
      } else {
        let filter = arrayOfFilters[this._failFilterIndex];
        this._onWhenAddingFileFailed(temp, filter, options);
      }
    });
    if (this.queue.length !== count) {
      this._onAfterAddingAll(addedFileItems);
      this.progress = this._getTotalProgress();
    }
    this._render();
    if (this.autoUpload) {
      this.uploadAll();
    }
  }

  public removeFromQueue(value:any):void {
    let index = this.getIndexOfItem(value);
    let item = this.queue[index];
    if (item.isUploading) {
      item.cancel();
    }
    this.queue.splice(index, 1);
    this.progress = this._getTotalProgress();
  }

  public clearQueue():void {
    while (this.queue.length) {
      this.queue[0].remove();
    }
    this.progress = 0;
  }

  public uploadItem(value:FileItem):void {
    let index = this.getIndexOfItem(value);
    let item = this.queue[index];
    let transport = this.isHTML5 ? '_xhrTransport' : '_iframeTransport';
    item._prepareToUploading();
    if (this.isUploading) {
      return;
    }
    this.isUploading = true;
    (this as any)[transport](item);
  }

  public cancelItem(value:any):void {
    let index = this.getIndexOfItem(value);
    let item = this.queue[index];
    let prop = this.isHTML5 ? '_xhr' : '_form';
    if (item && item.isUploading) {
      item[prop].abort();
    }
  }

  public uploadAll():void {
    let items = this.getNotUploadedItems().filter((item:any) => !item.isUploading);
    if (!items.length) {
      return;
    }
    items.map((item:any) => item._prepareToUploading());
    items[0].upload();
  }

  public cancelAll():void {
    let items = this.getNotUploadedItems();
    items.map((item:any) => item.cancel());
  }

  public isFile(value:any):boolean {
    return isFile(value);
  }

  public isFileLikeObject(value:any):boolean {
    return value instanceof FileLikeObject;
  }

  public getIndexOfItem(value:any):number {
    return typeof value === 'number' ? value : this.queue.indexOf(value);
  }

  public getNotUploadedItems():Array<any> {
    return this.queue.filter((item:any) => !item.isUploaded);
  }

  public getReadyItems():Array<any> {
    return this.queue
      .filter((item:any) => (item.isReady && !item.isUploading))
      .sort((item1:any, item2:any) => item1.index - item2.index);
  }

  public destroy():void {
    return void 0;
    /*forEach(this._directives, (key) => {
     forEach(this._directives[key], (object) => {
     object.destroy();
     });
     });*/
  }

  public onAfterAddingAll(fileItems:any):any {
    return {fileItems};
  }

  public onAfterAddingFile(fileItem:any):any {
    return {fileItem};
  }

  public onWhenAddingFileFailed(item:any, filter:any, options:any):any {
    return {item, filter, options};
  }

  public onBeforeUploadItem(fileItem:any):any {
    return {fileItem};
  }

  public onProgressItem(fileItem:any, progress:any):any {
    return {fileItem, progress};
  }

  public onProgressAll(progress:any):any {
    return {progress};
  }

  public onSuccessItem(item:any, response:any, status:any, headers:any):any {
    return {item, response, status, headers};
  }

  public onErrorItem(item:any, response:any, status:any, headers:any):any {
    return {item, response, status, headers};
  }

  public onCancelItem(item:any, response:any, status:any, headers:any):any {
    return {item, response, status, headers};
  }

  public onCompleteItem(item:any, response:any, status:any, headers:any):any {
    return {item, response, status, headers};
  }

  public onCompleteAll():any {
    return void 0;
  }

  public _onErrorItem(item:any, response:any, status:any, headers:any):void {
    item._onError(response, status, headers);
    this.onErrorItem(item, response, status, headers);
  }

  public _onCompleteItem(item:any, response:any, status:any, headers:any):void {
    item._onComplete(response, status, headers);
    this.onCompleteItem(item, response, status, headers);
    let nextItem = this.getReadyItems()[0];
    this.isUploading = false;
    if (nextItem) {
      nextItem.upload();
      return;
    }
    this.onCompleteAll();
    this.progress = this._getTotalProgress();
    this._render();
  }

  protected _headersGetter(parsedHeaders:any):any {
    return (name:any) => {
      if (name) {
        return parsedHeaders[name.toLowerCase()] || void 0;
      }
      return parsedHeaders;
    };
  }

  protected _xhrTransport(item:any):any {
    let xhr = item._xhr = new XMLHttpRequest();
    let form = new FormData();
    this._onBeforeUploadItem(item);
    // todo
    /*item.formData.map(obj => {
     obj.map((value, key) => {
     form.append(key, value);
     });
     });*/
    if (typeof item._file.size !== 'number') {
      throw new TypeError('The file specified is no longer valid');
    }
    form.append(item.alias, item._file, item.file.name);
    xhr.upload.onprogress = (event:any) => {
      let progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
      this._onProgressItem(item, progress);
    };
    xhr.onload = () => {
      let headers = this._parseHeaders(xhr.getAllResponseHeaders());
      let response = this._transformResponse(xhr.response, headers);
      let gist = this._isSuccessCode(xhr.status) ? 'Success' : 'Error';
      let method = '_on' + gist + 'Item';
      (this as any)[method](item, response, xhr.status, headers);
      this._onCompleteItem(item, response, xhr.status, headers);
    };
    xhr.onerror = () => {
      let headers = this._parseHeaders(xhr.getAllResponseHeaders());
      let response = this._transformResponse(xhr.response, headers);
      this._onErrorItem(item, response, xhr.status, headers);
      this._onCompleteItem(item, response, xhr.status, headers);
    };
    xhr.onabort = () => {
      let headers = this._parseHeaders(xhr.getAllResponseHeaders());
      let response = this._transformResponse(xhr.response, headers);
      this._onCancelItem(item, response, xhr.status, headers);
      this._onCompleteItem(item, response, xhr.status, headers);
    };
    xhr.open(item.method, item.url, true);
    xhr.withCredentials = item.withCredentials;
    // todo
    /*item.headers.map((value, name) => {
     xhr.setRequestHeader(name, value);
     });*/
    if (this.authToken) {
      xhr.setRequestHeader('Authorization', this.authToken);
    }
    xhr.send(form);
    this._render();
  }

  private _getTotalProgress(value:number = 0):number {
    if (this.removeAfterUpload) {
      return value;
    }
    let notUploaded = this.getNotUploadedItems().length;
    let uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
    let ratio = 100 / this.queue.length;
    let current = value * ratio / 100;
    return Math.round(uploaded * ratio + current);
  }

  private _getFilters(filters:any):any {
    if (!filters) {
      return this.filters;
    }
    if (Array.isArray(filters)) {
      return filters;
    }
    let names = filters.match(/[^\s,]+/g);
    return this.filters
      .filter((filter:any) => names.indexOf(filter.name) !== -1);
  }

  private _render():any {
    return void 0;
    // todo: ?
  }

  private _folderFilter(item:any):boolean {
    return !!(item.size || item.type);
  }

  private _queueLimitFilter():boolean {
    return this.queueLimit === undefined || this.queue.length < this.queueLimit;
  }

  private _isValidFile(file:any, filters:any, options:any):boolean {
    this._failFilterIndex = -1;
    return !filters.length ? true : filters.every((filter:any) => {
      this._failFilterIndex++;
      return filter.fn.call(this, file, options);
    });
  }

  private _isSuccessCode(status:any):boolean {
    return (status >= 200 && status < 300) || status === 304;
  }

  /* tslint:disable */
  private _transformResponse(response:any, headers:any):any {
    // todo: ?
    /*var headersGetter = this._headersGetter(headers);
     forEach($http.defaults.transformResponse, (transformFn) => {
     response = transformFn(response, headersGetter);
     });*/
    return response;
  }
  /* tslint:enable */
  private _parseHeaders(headers:any):any {
    let parsed:any = {};
    let key:any;
    let val:any;
    let i:any;
    if (!headers) {
      return parsed;
    }
    headers.split('\n').map((line:any) => {
      i = line.indexOf(':');
      key = line.slice(0, i).trim().toLowerCase();
      val = line.slice(i + 1).trim();
      if (key) {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    });
    return parsed;
  }

  /*private _iframeTransport(item:any) {
    // todo: implement it later
  }*/

  private _onWhenAddingFileFailed(item:any, filter:any, options:any):void {
    this.onWhenAddingFileFailed(item, filter, options);
  }

  private _onAfterAddingFile(item:any):void {
    this.onAfterAddingFile(item);
  }

  private _onAfterAddingAll(items:any):void {
    this.onAfterAddingAll(items);
  }

  private _onBeforeUploadItem(item:any):void {
    item._onBeforeUpload();
    this.onBeforeUploadItem(item);
  }

  private _onProgressItem(item:any, progress:any):void {
    let total = this._getTotalProgress(progress);
    this.progress = total;
    item._onProgress(progress);
    this.onProgressItem(item, progress);
    this.onProgressAll(total);
    this._render();
  }
  /* tslint:disable */
  private _onSuccessItem(item:any, response:any, status:any, headers:any):void {
    item._onSuccess(response, status, headers);
    this.onSuccessItem(item, response, status, headers);
  }
  /* tslint:enable */
  private _onCancelItem(item:any, response:any, status:any, headers:any):void {
    item._onCancel(response, status, headers);
    this.onCancelItem(item, response, status, headers);
  }
}
