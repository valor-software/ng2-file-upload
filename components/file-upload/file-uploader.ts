import {
  EventEmitter, ElementRef, Renderer
} from 'angular2/angular2';

import {FileLikeObject} from './file-like-object';
import {FileItem} from './file-item';

function isFile(value:any) {
  return (File && value instanceof File);
}

function isFileLikeObject(value:any) {
  return value instanceof FileLikeObject;
}

export class FileUploader {
  public url:string;
  public isUploading:boolean = false;
  public queue:Array<any> = [];
  public progress:number = 0;
  public autoUpload:boolean = false;
  public isHTML5:boolean = true;
  public removeAfterUpload:boolean = false;
  public queueLimit:number;
  public _nextIndex = 0;
  public filters:Array<any> = [];
  private _failFilterIndex:number;

  constructor(public options:any) {
    // Object.assign(this, options);
    this.url = options.url;
    this.filters.unshift({name: 'queueLimit', fn: this._queueLimitFilter});
    this.filters.unshift({name: 'folder', fn: this._folderFilter});
  }

  public addToQueue(files:any[], options:any, filters:any) {
    let list:any[] = [];
    for (let file of files) {
      list.push(file);
    }

    let arrayOfFilters = this._getFilters(filters);
    let count = this.queue.length;
    let addedFileItems:any[] = [];

    list.map(some => {
      let temp = new FileLikeObject(some);

      if (this._isValidFile(temp, [], options)) {
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

  public removeFromQueue(value:any) {
    let index = this.getIndexOfItem(value);
    let item = this.queue[index];
    if (item.isUploading) {
      item.cancel();
    }

    this.queue.splice(index, 1);
    item._destroy();
    this.progress = this._getTotalProgress();
  }

  public clearQueue() {
    while (this.queue.length) {
      this.queue[0].remove();
    }

    this.progress = 0;
  }

  public uploadItem(value:FileItem) {
    let index = this.getIndexOfItem(value);
    let item = this.queue[index];
    let transport = this.isHTML5 ? '_xhrTransport' : '_iframeTransport';

    item._prepareToUploading();
    if (this.isUploading) {
      return;
    }

    this.isUploading = true;
    (<any>this)[transport](item);
  }

  public cancelItem(value:any) {
    let index = this.getIndexOfItem(value);
    let item = this.queue[index];
    let prop = this.isHTML5 ? '_xhr' : '_form';

    if (item && item.isUploading) {
      item[prop].abort();
    }
  }

  public uploadAll() {
    let items = this.getNotUploadedItems().filter(item => !item.isUploading);
    if (!items.length) {
      return;
    }

    items.map(item => item._prepareToUploading());
    items[0].upload();
  }

  public cancelAll() {
    let items = this.getNotUploadedItems();
    items.map(item => item.cancel());
  }


  public isFile(value:any) {
    return isFile(value);
  }

  public isFileLikeObject(value:any) {
    return value instanceof FileLikeObject;
  }

  public getIndexOfItem(value:any) {
    return typeof value === 'number' ? value : this.queue.indexOf(value);
  }

  public getNotUploadedItems() {
    return this.queue.filter(item => !item.isUploaded);
  }

  public getReadyItems() {
    return this.queue
      .filter(item => (item.isReady && !item.isUploading))
      .sort((item1, item2) => item1.index - item2.index);
  }

  public destroy() {
    /*forEach(this._directives, (key) => {
     forEach(this._directives[key], (object) => {
     object.destroy();
     });
     });*/
  }

  public onAfterAddingAll(fileItems:any) {
  }

  public onAfterAddingFile(fileItem:any) {
  }

  public onWhenAddingFileFailed(item:any, filter:any, options:any) {
  }

  public onBeforeUploadItem(fileItem:any) {
  }

  public onProgressItem(fileItem:any, progress:any) {
  }

  public onProgressAll(progress:any) {
  }

  public onSuccessItem(item:any, response:any, status:any, headers:any) {
  }

  public onErrorItem(item:any, response:any, status:any, headers:any) {
  }

  public onCancelItem(item:any, response:any, status:any, headers:any) {
  }

  public onCompleteItem(item:any, response:any, status:any, headers:any) {
  }

  public onCompleteAll() {
  }

  private _getTotalProgress(value = 0) {
    if (this.removeAfterUpload) {
      return value;
    }

    let notUploaded = this.getNotUploadedItems().length;
    let uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
    let ratio = 100 / this.queue.length;
    let current = value * ratio / 100;

    return Math.round(uploaded * ratio + current);
  }

  private _getFilters(filters:any) {
    if (!filters) {
      return this.filters;
    }

    if (Array.isArray(filters)) {
      return filters;
    }

    let names = filters.match(/[^\s,]+/g);
    return this.filters
      .filter(filter => names.indexOf(filter.name) !== -1);
  }

  private _render() {
    // todo: ?
  }

  private _folderFilter(item:any) {
    return !!(item.size || item.type);
  }

  private _queueLimitFilter() {
    return this.queue.length < this.queueLimit;
  }

  private _isValidFile(file:any, filters:any, options:any) {
    this._failFilterIndex = -1;
    return !filters.length ? true : filters.every((filter:any) => {
      this._failFilterIndex++;
      return filter.fn.call(this, file, options);
    });
  }

  private _isSuccessCode(status:any) {
    return (status >= 200 && status < 300) || status === 304;
  }

  private _transformResponse(response:any, headers:any):any {
    // todo: ?
    /*var headersGetter = this._headersGetter(headers);
     forEach($http.defaults.transformResponse, (transformFn) => {
     response = transformFn(response, headersGetter);
     });*/
    return response;
  }

  private _parseHeaders(headers:any) {
    let parsed:any = {}, key:any, val:any, i:any;

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

  private _headersGetter(parsedHeaders:any) {
    return (name:any) => {
      if (name) {
        return parsedHeaders[name.toLowerCase()] || null;
      }
      return parsedHeaders;
    };
  }

  _xhrTransport(item:any) {
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

    xhr.upload.onprogress = (event) => {
      let progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
      this._onProgressItem(item, progress);
    };

    xhr.onload = () => {
      let headers = this._parseHeaders(xhr.getAllResponseHeaders());
      let response = this._transformResponse(xhr.response, headers);
      let gist = this._isSuccessCode(xhr.status) ? 'Success' : 'Error';
      let method = '_on' + gist + 'Item';
      (<any>this)[method](item, response, xhr.status, headers);
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

    xhr.send(form);
    this._render();
  }

  private _iframeTransport(item:any) {
    // todo: implement it later
  }

  private _onWhenAddingFileFailed(item:any, filter:any, options:any) {
    this.onWhenAddingFileFailed(item, filter, options);
  }

  private _onAfterAddingFile(item:any) {
    this.onAfterAddingFile(item);
  }

  private _onAfterAddingAll(items:any) {
    this.onAfterAddingAll(items);
  }

  private _onBeforeUploadItem(item:any) {
    item._onBeforeUpload();
    this.onBeforeUploadItem(item);
  }

  private _onProgressItem(item:any, progress:any) {
    let total = this._getTotalProgress(progress);
    this.progress = total;
    item._onProgress(progress);
    this.onProgressItem(item, progress);
    this.onProgressAll(total);
    this._render();
  }

  private _onSuccessItem(item:any, response:any, status:any, headers:any) {
    item._onSuccess(response, status, headers);
    this.onSuccessItem(item, response, status, headers);
  }

  public _onErrorItem(item:any, response:any, status:any, headers:any) {
    item._onError(response, status, headers);
    this.onErrorItem(item, response, status, headers);
  }

  private _onCancelItem(item:any, response:any, status:any, headers:any) {
    item._onCancel(response, status, headers);
    this.onCancelItem(item, response, status, headers);
  }

  public _onCompleteItem(item:any, response:any, status:any, headers:any) {
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
}
