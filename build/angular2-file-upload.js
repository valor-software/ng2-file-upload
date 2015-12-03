webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(378);


/***/ },

/***/ 50:
/***/ function(module, exports) {

	function isElement(node) {
	    return !!(node && (node.nodeName || node.prop && node.attr && node.find));
	}
	var FileLikeObject = (function () {
	    function FileLikeObject(fileOrInput) {
	        var isInput = isElement(fileOrInput);
	        var fakePathOrObject = isInput ? fileOrInput.value : fileOrInput;
	        var postfix = typeof fakePathOrObject === 'string' ? 'FakePath' : 'Object';
	        var method = '_createFrom' + postfix;
	        this[method](fakePathOrObject);
	    }
	    FileLikeObject.prototype._createFromFakePath = function (path) {
	        this.lastModifiedDate = null;
	        this.size = null;
	        this.type = 'like/' + path.slice(path.lastIndexOf('.') + 1).toLowerCase();
	        this.name = path.slice(path.lastIndexOf('/') + path.lastIndexOf('\\') + 2);
	    };
	    FileLikeObject.prototype._createFromObject = function (object) {
	        this.size = object.size;
	        this.type = object.type;
	        this.name = object.name;
	    };
	    return FileLikeObject;
	})();
	exports.FileLikeObject = FileLikeObject;


/***/ },

/***/ 125:
/***/ function(module, exports, __webpack_require__) {

	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var angular2_1 = __webpack_require__(8);
	var FileDrop = (function () {
	    function FileDrop(element) {
	        this.element = element;
	        this.fileOver = new angular2_1.EventEmitter();
	    }
	    FileDrop.prototype.getOptions = function () {
	        return this.uploader.options;
	    };
	    FileDrop.prototype.getFilters = function () {
	    };
	    FileDrop.prototype.onDrop = function (event) {
	        var transfer = this._getTransfer(event);
	        if (!transfer) {
	            return;
	        }
	        var options = this.getOptions();
	        var filters = this.getFilters();
	        this._preventAndStop(event);
	        this.uploader.addToQueue(transfer.files, options, filters);
	        this.fileOver.next(false);
	    };
	    FileDrop.prototype.onDragOver = function (event) {
	        var transfer = this._getTransfer(event);
	        if (!this._haveFiles(transfer.types)) {
	            return;
	        }
	        transfer.dropEffect = 'copy';
	        this._preventAndStop(event);
	        this.fileOver.next(true);
	    };
	    FileDrop.prototype.onDragLeave = function (event) {
	        if (event.currentTarget === this.element[0]) {
	            return;
	        }
	        this._preventAndStop(event);
	        this.fileOver.next(false);
	    };
	    FileDrop.prototype._getTransfer = function (event) {
	        return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
	    };
	    FileDrop.prototype._preventAndStop = function (event) {
	        event.preventDefault();
	        event.stopPropagation();
	    };
	    FileDrop.prototype._haveFiles = function (types) {
	        if (!types) {
	            return false;
	        }
	        if (types.indexOf) {
	            return types.indexOf('Files') !== -1;
	        }
	        else if (types.contains) {
	            return types.contains('Files');
	        }
	        else {
	            return false;
	        }
	    };
	    FileDrop.prototype._addOverClass = function (item) {
	        item.addOverClass();
	    };
	    FileDrop.prototype._removeOverClass = function (item) {
	        item.removeOverClass();
	    };
	    FileDrop = __decorate([
	        angular2_1.Directive({
	            selector: '[ng2-file-drop]',
	            properties: ['uploader'],
	            events: ['fileOver'],
	            host: {
	                '(drop)': 'onDrop($event)',
	                '(dragover)': 'onDragOver($event)',
	                '(dragleave)': 'onDragLeave($event)'
	            }
	        }), 
	        __metadata('design:paramtypes', [angular2_1.ElementRef])
	    ], FileDrop);
	    return FileDrop;
	})();
	exports.FileDrop = FileDrop;


/***/ },

/***/ 126:
/***/ function(module, exports, __webpack_require__) {

	var file_like_object_1 = __webpack_require__(50);
	var FileItem = (function () {
	    function FileItem(uploader, some, options) {
	        this.uploader = uploader;
	        this.some = some;
	        this.options = options;
	        this.alias = 'file';
	        this.url = '/';
	        this.method = 'POST';
	        this.headers = [];
	        this.withCredentials = true;
	        this.formData = [];
	        this.isReady = false;
	        this.isUploading = false;
	        this.isUploaded = false;
	        this.isSuccess = false;
	        this.isCancel = false;
	        this.isError = false;
	        this.progress = 0;
	        this.index = null;
	        this.file = new file_like_object_1.FileLikeObject(some);
	        this._file = some;
	        this.url = uploader.url;
	    }
	    FileItem.prototype.upload = function () {
	        try {
	            this.uploader.uploadItem(this);
	        }
	        catch (e) {
	            this.uploader._onCompleteItem(this, '', 0, []);
	            this.uploader._onErrorItem(this, '', 0, []);
	        }
	    };
	    FileItem.prototype.cancel = function () {
	        this.uploader.cancelItem(this);
	    };
	    FileItem.prototype.remove = function () {
	        this.uploader.removeFromQueue(this);
	    };
	    FileItem.prototype.onBeforeUpload = function () {
	    };
	    FileItem.prototype.onProgress = function (progress) {
	    };
	    FileItem.prototype.onSuccess = function (response, status, headers) {
	    };
	    FileItem.prototype.onError = function (response, status, headers) {
	    };
	    FileItem.prototype.onCancel = function (response, status, headers) {
	    };
	    FileItem.prototype.onComplete = function (response, status, headers) {
	    };
	    FileItem.prototype._onBeforeUpload = function () {
	        this.isReady = true;
	        this.isUploading = true;
	        this.isUploaded = false;
	        this.isSuccess = false;
	        this.isCancel = false;
	        this.isError = false;
	        this.progress = 0;
	        this.onBeforeUpload();
	    };
	    FileItem.prototype._onProgress = function (progress) {
	        this.progress = progress;
	        this.onProgress(progress);
	    };
	    FileItem.prototype._onSuccess = function (response, status, headers) {
	        this.isReady = false;
	        this.isUploading = false;
	        this.isUploaded = true;
	        this.isSuccess = true;
	        this.isCancel = false;
	        this.isError = false;
	        this.progress = 100;
	        this.index = null;
	        this.onSuccess(response, status, headers);
	    };
	    FileItem.prototype._onError = function (response, status, headers) {
	        this.isReady = false;
	        this.isUploading = false;
	        this.isUploaded = true;
	        this.isSuccess = false;
	        this.isCancel = false;
	        this.isError = true;
	        this.progress = 0;
	        this.index = null;
	        this.onError(response, status, headers);
	    };
	    FileItem.prototype._onCancel = function (response, status, headers) {
	        this.isReady = false;
	        this.isUploading = false;
	        this.isUploaded = false;
	        this.isSuccess = false;
	        this.isCancel = true;
	        this.isError = false;
	        this.progress = 0;
	        this.index = null;
	        this.onCancel(response, status, headers);
	    };
	    FileItem.prototype._onComplete = function (response, status, headers) {
	        this.onComplete(response, status, headers);
	        if (this.uploader.removeAfterUpload) {
	            this.remove();
	        }
	    };
	    FileItem.prototype._prepareToUploading = function () {
	        this.index = this.index || ++this.uploader._nextIndex;
	        this.isReady = true;
	    };
	    return FileItem;
	})();
	exports.FileItem = FileItem;


/***/ },

/***/ 127:
/***/ function(module, exports, __webpack_require__) {

	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var angular2_1 = __webpack_require__(8);
	var FileSelect = (function () {
	    function FileSelect(element) {
	        this.element = element;
	    }
	    FileSelect.prototype.getOptions = function () {
	        return this.uploader.options;
	    };
	    FileSelect.prototype.getFilters = function () {
	    };
	    FileSelect.prototype.isEmptyAfterSelection = function () {
	        return !!this.element.nativeElement.attributes.multiple;
	    };
	    FileSelect.prototype.onChange = function () {
	        var files = this.element.nativeElement.files;
	        var options = this.getOptions();
	        var filters = this.getFilters();
	        this.uploader.addToQueue(files, options, filters);
	        if (this.isEmptyAfterSelection()) {
	        }
	    };
	    FileSelect = __decorate([
	        angular2_1.Directive({
	            selector: '[ng2-file-select]',
	            properties: ['uploader'],
	            host: {
	                '(change)': 'onChange()'
	            }
	        }), 
	        __metadata('design:paramtypes', [angular2_1.ElementRef])
	    ], FileSelect);
	    return FileSelect;
	})();
	exports.FileSelect = FileSelect;
	exports.fileUpload = [FileSelect];


/***/ },

/***/ 128:
/***/ function(module, exports, __webpack_require__) {

	var file_like_object_1 = __webpack_require__(50);
	var file_item_1 = __webpack_require__(126);
	function isFile(value) {
	    return (File && value instanceof File);
	}
	function isFileLikeObject(value) {
	    return value instanceof file_like_object_1.FileLikeObject;
	}
	var FileUploader = (function () {
	    function FileUploader(options) {
	        this.options = options;
	        this.isUploading = false;
	        this.queue = [];
	        this.progress = 0;
	        this.autoUpload = false;
	        this.isHTML5 = true;
	        this.removeAfterUpload = false;
	        this._nextIndex = 0;
	        this.filters = [];
	        this.url = options.url;
	        this.authToken = options.authToken;
	        this.filters.unshift({ name: 'queueLimit', fn: this._queueLimitFilter });
	        this.filters.unshift({ name: 'folder', fn: this._folderFilter });
	    }
	    FileUploader.prototype.addToQueue = function (files, options, filters) {
	        var _this = this;
	        var list = [];
	        for (var _i = 0; _i < files.length; _i++) {
	            var file = files[_i];
	            list.push(file);
	        }
	        var arrayOfFilters = this._getFilters(filters);
	        var count = this.queue.length;
	        var addedFileItems = [];
	        list.map(function (some) {
	            var temp = new file_like_object_1.FileLikeObject(some);
	            if (_this._isValidFile(temp, [], options)) {
	                var fileItem = new file_item_1.FileItem(_this, some, options);
	                addedFileItems.push(fileItem);
	                _this.queue.push(fileItem);
	                _this._onAfterAddingFile(fileItem);
	            }
	            else {
	                var filter = arrayOfFilters[_this._failFilterIndex];
	                _this._onWhenAddingFileFailed(temp, filter, options);
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
	    };
	    FileUploader.prototype.removeFromQueue = function (value) {
	        var index = this.getIndexOfItem(value);
	        var item = this.queue[index];
	        if (item.isUploading) {
	            item.cancel();
	        }
	        this.queue.splice(index, 1);
	        this.progress = this._getTotalProgress();
	    };
	    FileUploader.prototype.clearQueue = function () {
	        while (this.queue.length) {
	            this.queue[0].remove();
	        }
	        this.progress = 0;
	    };
	    FileUploader.prototype.uploadItem = function (value) {
	        var index = this.getIndexOfItem(value);
	        var item = this.queue[index];
	        var transport = this.isHTML5 ? '_xhrTransport' : '_iframeTransport';
	        item._prepareToUploading();
	        if (this.isUploading) {
	            return;
	        }
	        this.isUploading = true;
	        this[transport](item);
	    };
	    FileUploader.prototype.cancelItem = function (value) {
	        var index = this.getIndexOfItem(value);
	        var item = this.queue[index];
	        var prop = this.isHTML5 ? '_xhr' : '_form';
	        if (item && item.isUploading) {
	            item[prop].abort();
	        }
	    };
	    FileUploader.prototype.uploadAll = function () {
	        var items = this.getNotUploadedItems().filter(function (item) { return !item.isUploading; });
	        if (!items.length) {
	            return;
	        }
	        items.map(function (item) { return item._prepareToUploading(); });
	        items[0].upload();
	    };
	    FileUploader.prototype.cancelAll = function () {
	        var items = this.getNotUploadedItems();
	        items.map(function (item) { return item.cancel(); });
	    };
	    FileUploader.prototype.isFile = function (value) {
	        return isFile(value);
	    };
	    FileUploader.prototype.isFileLikeObject = function (value) {
	        return value instanceof file_like_object_1.FileLikeObject;
	    };
	    FileUploader.prototype.getIndexOfItem = function (value) {
	        return typeof value === 'number' ? value : this.queue.indexOf(value);
	    };
	    FileUploader.prototype.getNotUploadedItems = function () {
	        return this.queue.filter(function (item) { return !item.isUploaded; });
	    };
	    FileUploader.prototype.getReadyItems = function () {
	        return this.queue
	            .filter(function (item) { return (item.isReady && !item.isUploading); })
	            .sort(function (item1, item2) { return item1.index - item2.index; });
	    };
	    FileUploader.prototype.destroy = function () {
	    };
	    FileUploader.prototype.onAfterAddingAll = function (fileItems) {
	    };
	    FileUploader.prototype.onAfterAddingFile = function (fileItem) {
	    };
	    FileUploader.prototype.onWhenAddingFileFailed = function (item, filter, options) {
	    };
	    FileUploader.prototype.onBeforeUploadItem = function (fileItem) {
	    };
	    FileUploader.prototype.onProgressItem = function (fileItem, progress) {
	    };
	    FileUploader.prototype.onProgressAll = function (progress) {
	    };
	    FileUploader.prototype.onSuccessItem = function (item, response, status, headers) {
	    };
	    FileUploader.prototype.onErrorItem = function (item, response, status, headers) {
	    };
	    FileUploader.prototype.onCancelItem = function (item, response, status, headers) {
	    };
	    FileUploader.prototype.onCompleteItem = function (item, response, status, headers) {
	    };
	    FileUploader.prototype.onCompleteAll = function () {
	    };
	    FileUploader.prototype._getTotalProgress = function (value) {
	        if (value === void 0) { value = 0; }
	        if (this.removeAfterUpload) {
	            return value;
	        }
	        var notUploaded = this.getNotUploadedItems().length;
	        var uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
	        var ratio = 100 / this.queue.length;
	        var current = value * ratio / 100;
	        return Math.round(uploaded * ratio + current);
	    };
	    FileUploader.prototype._getFilters = function (filters) {
	        if (!filters) {
	            return this.filters;
	        }
	        if (Array.isArray(filters)) {
	            return filters;
	        }
	        var names = filters.match(/[^\s,]+/g);
	        return this.filters
	            .filter(function (filter) { return names.indexOf(filter.name) !== -1; });
	    };
	    FileUploader.prototype._render = function () {
	    };
	    FileUploader.prototype._folderFilter = function (item) {
	        return !!(item.size || item.type);
	    };
	    FileUploader.prototype._queueLimitFilter = function () {
	        return this.queue.length < this.queueLimit;
	    };
	    FileUploader.prototype._isValidFile = function (file, filters, options) {
	        var _this = this;
	        this._failFilterIndex = -1;
	        return !filters.length ? true : filters.every(function (filter) {
	            _this._failFilterIndex++;
	            return filter.fn.call(_this, file, options);
	        });
	    };
	    FileUploader.prototype._isSuccessCode = function (status) {
	        return (status >= 200 && status < 300) || status === 304;
	    };
	    FileUploader.prototype._transformResponse = function (response, headers) {
	        return response;
	    };
	    FileUploader.prototype._parseHeaders = function (headers) {
	        var parsed = {}, key, val, i;
	        if (!headers) {
	            return parsed;
	        }
	        headers.split('\n').map(function (line) {
	            i = line.indexOf(':');
	            key = line.slice(0, i).trim().toLowerCase();
	            val = line.slice(i + 1).trim();
	            if (key) {
	                parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
	            }
	        });
	        return parsed;
	    };
	    FileUploader.prototype._headersGetter = function (parsedHeaders) {
	        return function (name) {
	            if (name) {
	                return parsedHeaders[name.toLowerCase()] || null;
	            }
	            return parsedHeaders;
	        };
	    };
	    FileUploader.prototype._xhrTransport = function (item) {
	        var _this = this;
	        var xhr = item._xhr = new XMLHttpRequest();
	        var form = new FormData();
	        this._onBeforeUploadItem(item);
	        if (typeof item._file.size !== 'number') {
	            throw new TypeError('The file specified is no longer valid');
	        }
	        form.append(item.alias, item._file, item.file.name);
	        xhr.upload.onprogress = function (event) {
	            var progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
	            _this._onProgressItem(item, progress);
	        };
	        xhr.onload = function () {
	            var headers = _this._parseHeaders(xhr.getAllResponseHeaders());
	            var response = _this._transformResponse(xhr.response, headers);
	            var gist = _this._isSuccessCode(xhr.status) ? 'Success' : 'Error';
	            var method = '_on' + gist + 'Item';
	            _this[method](item, response, xhr.status, headers);
	            _this._onCompleteItem(item, response, xhr.status, headers);
	        };
	        xhr.onerror = function () {
	            var headers = _this._parseHeaders(xhr.getAllResponseHeaders());
	            var response = _this._transformResponse(xhr.response, headers);
	            _this._onErrorItem(item, response, xhr.status, headers);
	            _this._onCompleteItem(item, response, xhr.status, headers);
	        };
	        xhr.onabort = function () {
	            var headers = _this._parseHeaders(xhr.getAllResponseHeaders());
	            var response = _this._transformResponse(xhr.response, headers);
	            _this._onCancelItem(item, response, xhr.status, headers);
	            _this._onCompleteItem(item, response, xhr.status, headers);
	        };
	        xhr.open(item.method, item.url, true);
	        xhr.withCredentials = item.withCredentials;
	        if (this.authToken) {
	            xhr.setRequestHeader('Authorization', this.authToken);
	        }
	        xhr.send(form);
	        this._render();
	    };
	    FileUploader.prototype._iframeTransport = function (item) {
	    };
	    FileUploader.prototype._onWhenAddingFileFailed = function (item, filter, options) {
	        this.onWhenAddingFileFailed(item, filter, options);
	    };
	    FileUploader.prototype._onAfterAddingFile = function (item) {
	        this.onAfterAddingFile(item);
	    };
	    FileUploader.prototype._onAfterAddingAll = function (items) {
	        this.onAfterAddingAll(items);
	    };
	    FileUploader.prototype._onBeforeUploadItem = function (item) {
	        item._onBeforeUpload();
	        this.onBeforeUploadItem(item);
	    };
	    FileUploader.prototype._onProgressItem = function (item, progress) {
	        var total = this._getTotalProgress(progress);
	        this.progress = total;
	        item._onProgress(progress);
	        this.onProgressItem(item, progress);
	        this.onProgressAll(total);
	        this._render();
	    };
	    FileUploader.prototype._onSuccessItem = function (item, response, status, headers) {
	        item._onSuccess(response, status, headers);
	        this.onSuccessItem(item, response, status, headers);
	    };
	    FileUploader.prototype._onErrorItem = function (item, response, status, headers) {
	        item._onError(response, status, headers);
	        this.onErrorItem(item, response, status, headers);
	    };
	    FileUploader.prototype._onCancelItem = function (item, response, status, headers) {
	        item._onCancel(response, status, headers);
	        this.onCancelItem(item, response, status, headers);
	    };
	    FileUploader.prototype._onCompleteItem = function (item, response, status, headers) {
	        item._onComplete(response, status, headers);
	        this.onCompleteItem(item, response, status, headers);
	        var nextItem = this.getReadyItems()[0];
	        this.isUploading = false;
	        if (nextItem) {
	            nextItem.upload();
	            return;
	        }
	        this.onCompleteAll();
	        this.progress = this._getTotalProgress();
	        this._render();
	    };
	    return FileUploader;
	})();
	exports.FileUploader = FileUploader;


/***/ },

/***/ 378:
/***/ function(module, exports, __webpack_require__) {

	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(127));
	__export(__webpack_require__(125));
	__export(__webpack_require__(128));


/***/ }

});
//# sourceMappingURL=angular2-file-upload.js.map