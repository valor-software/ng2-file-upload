import {FileLikeObject} from './file-like-object';
import {FileItem} from './file-item';
import {FileType} from './file-type';
import {Headers, Http} from 'angular2/http';
import {Inject, Output, EventEmitter} from 'angular2/core';


export interface HeadersForUpload {
  name: string;
  value: string;
}

export interface FileUploaderOptionsInterface {
  allowedMimeType?: Array<string>;
  allowedFileType?: Array<string>;
  autoUpload?:boolean;
  isHTML5?:boolean;
  filters?:Array<any>;
  headers?: Array<HeadersForUpload>;
  maxFileSize?: number;
  queueLimit?:number;
  removeAfterUpload?:boolean;
  uploadPerPart?: boolean;
  url?:string;
}

function isFileLikeObject(value: any) {
  return value instanceof FileLikeObject;
}

export class FileUploader {

  public authToken: string;
  public isUploading: boolean = false;
  public queue: Array<any> = [];
  public progress: number = 0;
  public _nextIndex = 0;
  private _failFilterIndex: number;

  public options: FileUploaderOptionsInterface = {
    autoUpload: false,
    isHTML5: true,
    filters: [],
    removeAfterUpload: false,
  };

  @Output() events$: EventEmitter<any> = new EventEmitter();

  constructor(@Inject(Http) private http: Http) {
  }

  public setOptions(options: any) {
    this.options = Object.assign(this.options, options);

    this.authToken = options.authToken;
    this.options.filters.unshift({name: 'queueLimit', fn: this._queueLimitFilter});

    if (this.options.maxFileSize) {
      this.options.filters.unshift({name: 'fileSize', fn: this._fileSizeFilter});
    }

    if (this.options.allowedFileType) {
      this.options.filters.unshift({name: 'fileType', fn: this._fileTypeFilter});
    }

    if (this.options.allowedMimeType) {
      this.options.filters.unshift({name: 'mimeType', fn: this._mimeTypeFilter});
    }

    // this.options.filters.unshift({name: 'folder', fn: this._folderFilter});
  }


  public addToQueue(files: any[], options?: any, filters?: any) {
    this._removeFoldersFromFiles(files)
      .then((list: Array<any>) => {

        let arrayOfFilters = this._getFilters(filters);
        let count = this.queue.length;
        let addedFileItems: any[] = [];

        if (!options) {
          options = this.options;
        }

        list.map(some => {
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

        if (this.options.autoUpload) {
          this.uploadAll();
        }
      });
  }

  public removeFromQueue(value: any) {
    let index = this.getIndexOfItem(value);
    let item = this.queue[index];
    if (item.isUploading) {
      item.cancel();
    }

    this.queue.splice(index, 1);
    this.progress = this._getTotalProgress();
  }

  public clearQueue() {
    while (this.queue.length) {
      this.queue[0].remove();
    }

    this.progress = 0;
  }

  public uploadItem(value: FileItem) {
    let index = this.getIndexOfItem(value);
    let item = this.queue[index];
    let transport = this.options.isHTML5 ? '_xhrTransport' : '_iframeTransport';

    item._prepareToUploading();
    if (this.isUploading) {
      return;
    }

    this.isUploading = true;
    (<any>this)[transport](item);
  }

  public cancelItem(value: any) {
    let index = this.getIndexOfItem(value);
    let item = this.queue[index];
    let prop = this.options.isHTML5 ? '_xhr' : '_form';

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


  public isFileLikeObject(value: any) {
    return value instanceof FileLikeObject;
  }

  public getIndexOfItem(value: any) {
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

  public onAfterAddingAll(fileItems: any) {
  }

  public onAfterAddingFile(fileItem: any) {
  }

  public onWhenAddingFileFailed(item: any, filter: any, options: any) {
  }

  public onBeforeUploadItem(fileItem: any) {
  }

  public onProgressItem(fileItem: any, progress: any) {
  }

  public onProgressAll(progress: any) {
  }

  public onSuccessItem(item: any, response: any, status: any, headers: any) {
  }

  public onErrorItem(item: any, response: any, status: any, headers: any) {
  }

  public onCancelItem(item: any, response: any, status: any, headers: any) {
  }

  public onCompleteItem(item: any, response: any, status: any, headers: any) {
  }

  public onCompleteAll() {
    this.events$.emit({
      'type': 'completeAll'
    });
  }

  private _getTotalProgress(value = 0) {
    if (this.options.removeAfterUpload) {
      return value;
    }

    let notUploaded = this.getNotUploadedItems().length;
    let uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
    let ratio = 100 / this.queue.length;
    let current = value * ratio / 100;

    return Math.round(uploaded * ratio + current);
  }

  private _getFilters(filters: any) {
    if (!filters) {
      return this.options.filters;
    }

    if (Array.isArray(filters)) {
      return filters;
    }

    let names = filters.match(/[^\s,]+/g);
    return this.options.filters
      .filter(filter => names.indexOf(filter.name) !== -1);
  }

  private _render() {
    // todo: ?
  }

  private _folderFilter(item: any) {
    return !!(item.size || item.type);
  }

  private _queueLimitFilter() {
    return !(this.options.queueLimit && this.queue.length > this.options.queueLimit);
  }

  private _mimeTypeFilter(item: any) {
    return !(this.options.allowedMimeType && this.options.allowedMimeType.indexOf(item.type) === -1);
  }

  private _fileSizeFilter(item: any) {
    return !(this.options.maxFileSize && item.size > this.options.maxFileSize);
  }

  private _fileTypeFilter(item: any) {
    return !(this.options.allowedFileType &&
    this.options.allowedFileType.indexOf(FileType.getMimeClass(item)) === -1);
  }

  private _isValidFile(file: any, filters: any, options: any) {
    this._failFilterIndex = -1;
    return !filters.length ? true : filters.every((filter: any) => {
      this._failFilterIndex++;
      return filter.fn.call(this, file, options);
    });
  }

  private _isSuccessCode(status: any) {
    return (status >= 200 && status < 300) || status === 304;
  }

  private _transformResponse(response: any, headers: any): any {
    // todo: ?
    /*var headersGetter = this._headersGetter(headers);
     forEach($http.defaults.transformResponse, (transformFn) => {
     response = transformFn(response, headersGetter);
     });*/
    return response;
  }

  private _parseHeaders(headers: any) {
    let parsed: any = {}, key: any, val: any, i: any;

    if (!headers) {
      return parsed;
    }

    headers.split('\n').map((line: any) => {
      i = line.indexOf(':');
      key = line.slice(0, i).trim().toLowerCase();
      val = line.slice(i + 1).trim();

      if (key) {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    });

    return parsed;
  }

  private _headersGetter(parsedHeaders: any) {
    return (name: any) => {
      if (name) {
        return parsedHeaders[name.toLowerCase()] || null;
      }
      return parsedHeaders;
    };
  }

  _xhrTransport(item: any) {

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

    let basicSize = 1024 * 1024;
    let from = item.sizeTransferred;
    let to = from + basicSize;

    let blob;
    let data;

    if (this.options.uploadPerPart) {

      if (item._file.slice) {
        blob = item._file.slice(from, to);
      } else if (item._file.webkitSlice) {
        blob = item._file.webkitSlice(from, to);
      } else if (item._file.mozSlice) {
        blob = item._file.mozSlice(from, to);
      }

      data = {
        'uploadId': undefined,
        'sizeChunk': blob.size,
        'sizeTotal': item._file.size,
        'sizeTransferred': item.sizeTransferred,
        'name': item.file.name
      };


      if (item.uploadID) {
        data.uploadId = item.uploadID;
      }


    } else {
      form.append(item.alias, item._file, item.file.name);
    }

    let xhr = item._xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (event) => {
      let progress;
      if (this.options.uploadPerPart) {
        let progressTransferred = Math.round(item.sizeTransferred / item._file.size * 100);
        let progressBlob = Math.round(blob.size / item._file.size * 100);
        let progressUploading = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
        progress = Math.round(progressTransferred + progressBlob * progressUploading / 100);
      } else {
        progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
      }
      this._onProgressItem(item, progress);
    };

    xhr.onload = () => {
      let headers = this._parseHeaders(xhr.getAllResponseHeaders());
      let response = this._transformResponse(xhr.response, headers);
      let gist = this._isSuccessCode(xhr.status) ? 'Success' : 'Error';
      let method = '_on' + gist + 'Item';

      if (this.options.uploadPerPart && gist === 'Success') {
        item.sizeTransferred = item.sizeTransferred + blob.size;
        if (item.sizeTransferred === item._file.size) {
          (<any>this)[method](item, response, xhr.status, headers);
          this._onCompleteItem(item, response, xhr.status, headers);
        } else {
          let res = JSON.parse(xhr.response);
          if (res.uploadID) {
            item.uploadID = res.uploadID;
          }
          this._xhrTransport(item);
        }

      } else {
        (<any>this)[method](item, response, xhr.status, headers);
        this._onCompleteItem(item, response, xhr.status, headers);
      }
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
    if (this.options.headers) {
      for (let header of this.options.headers) {
        xhr.setRequestHeader(header.name, header.value);
      }
    }

    if (this.authToken) {
      xhr.setRequestHeader('Authorization', this.authToken);
    }

    if (this.options.uploadPerPart) {

      let reader = new FileReader();
      reader.onloadend = (evt) => {
        if (reader.readyState !== 2) {
          return false;
        }
        data.data = reader.result;
        xhr.send(JSON.stringify(data));
      };
      reader.readAsBinaryString(blob);

    } else {
      xhr.send(form);
    }

    this._render();
  }

  private _iframeTransport(item: any) {
    // todo: implement it later
  }

  private _onWhenAddingFileFailed(item: any, filter: any, options: any) {
    this.onWhenAddingFileFailed(item, filter, options);
  }

  private _onAfterAddingFile(item: any) {
    this.onAfterAddingFile(item);
  }

  private _onAfterAddingAll(items: any) {
    this.onAfterAddingAll(items);
  }

  private _onBeforeUploadItem(item: any) {
    item._onBeforeUpload();
    this.onBeforeUploadItem(item);
  }

  private _onProgressItem(item: any, progress: any) {
    let total = this._getTotalProgress(progress);
    this.progress = total;
    item._onProgress(progress);
    this.onProgressItem(item, progress);
    this.onProgressAll(total);
    this._render();
  }

  private _onSuccessItem(item: any, response: any, status: any, headers: any) {
    item._onSuccess(response, status, headers);
    this.onSuccessItem(item, response, status, headers);
    this.emitEvent('successItem', item, response, status, headers);
  }

  public _onErrorItem(item: any, response: any, status: any, headers: any) {
    item._onError(response, status, headers);
    this.onErrorItem(item, response, status, headers);
    this.emitEvent('errorItem', item, response, status, headers);
  }

  private _onCancelItem(item: any, response: any, status: any, headers: any) {
    item._onCancel(response, status, headers);
    this.onCancelItem(item, response, status, headers);
    this.emitEvent('cancelItem', item, response, status, headers);
  }

  public _onCompleteItem(item: any, response: any, status: any, headers: any) {
    item._onComplete(response, status, headers);
    this.onCompleteItem(item, response, status, headers);
    this.emitEvent('completeItem', item, response, status, headers);

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

  private emitEvent(type, item, response, status, headers) {
    this.events$.emit({
      'type': type,
      'item': item,
      'reponse': response,
      'status': status,
      'headers': headers
    });
  }

  private isFileTest(file) {

    return new Promise(function (resolve, reject) {
      if (file.size !== 0) {
        /*
         *  reader.readAsText or reader.readAsArrayBuffer
         *  loads file into RAM
         *  so we need a chunk for better performance
         */
        let from = 0;
        let to = 100;
        let chunk;
        if (file.slice) {
          chunk = file.slice(from, to);
        } else if (file.webkitSlice) {
          chunk = file.webkitSlice(from, to);
        } else if (file.mozSlice) {
          chunk = file.mozSlice(from, to);
        }
        let reader = new FileReader();
        reader.onload = () => resolve();
        reader.onerror = () => reject();
        reader.readAsArrayBuffer(chunk);
      } else {
        reject();
      }
    });
  }

  private _removeFoldersFromFiles(files: any[]) {
    return new Promise((resolve, reject) => {
      let list: any[] = [];

      let that = this;
      let count = 0;

      for (let file of files) {
        testFile(file);
      }

      function testFile(file) {
        let isFileTest = that.isFileTest(file);
        isFileTest.then(
          (ok) => {
            list.push(file);
            count++;
            if (count === files.length) {
              resolve(list);
            }
          },
          (isFolder) => {
            count++;
            if (count === files.length) {
              resolve(list);
            }
          }
        );
      }

    });
  }

}
