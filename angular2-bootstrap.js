webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(140);


/***/ },

/***/ 28:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var file_like_object_class_1 = __webpack_require__(45);
	var file_item_class_1 = __webpack_require__(138);
	var file_type_class_1 = __webpack_require__(139);
	function isFile(value) {
	    return (File && value instanceof File);
	}
	var FileUploader = (function () {
	    function FileUploader(options) {
	        this.isUploading = false;
	        this.queue = [];
	        this.progress = 0;
	        this._nextIndex = 0;
	        this.options = {
	            autoUpload: false,
	            isHTML5: true,
	            filters: [],
	            removeAfterUpload: false
	        };
	        this.setOptions(options);
	    }
	    FileUploader.prototype.setOptions = function (options) {
	        this.options = Object.assign(this.options, options);
	        this.authToken = options.authToken;
	        this.autoUpload = options.autoUpload;
	        this.options.filters.unshift({ name: 'queueLimit', fn: this._queueLimitFilter });
	        if (this.options.maxFileSize) {
	            this.options.filters.unshift({ name: 'fileSize', fn: this._fileSizeFilter });
	        }
	        if (this.options.allowedFileType) {
	            this.options.filters.unshift({ name: 'fileType', fn: this._fileTypeFilter });
	        }
	        if (this.options.allowedMimeType) {
	            this.options.filters.unshift({ name: 'mimeType', fn: this._mimeTypeFilter });
	        }
	    };
	    FileUploader.prototype.addToQueue = function (files, options, filters) {
	        var _this = this;
	        var list = [];
	        for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
	            var file = files_1[_i];
	            list.push(file);
	        }
	        var arrayOfFilters = this._getFilters(filters);
	        var count = this.queue.length;
	        var addedFileItems = [];
	        list.map(function (some) {
	            if (!options) {
	                options = _this.options;
	            }
	            var temp = new file_like_object_class_1.FileLikeObject(some);
	            if (_this._isValidFile(temp, arrayOfFilters, options)) {
	                var fileItem = new file_item_class_1.FileItem(_this, some, options);
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
	        if (this.options.autoUpload) {
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
	        var transport = this.options.isHTML5 ? '_xhrTransport' : '_iframeTransport';
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
	        var prop = this.options.isHTML5 ? '_xhr' : '_form';
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
	        return value instanceof file_like_object_class_1.FileLikeObject;
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
	        return void 0;
	    };
	    FileUploader.prototype.onAfterAddingAll = function (fileItems) {
	        return { fileItems: fileItems };
	    };
	    FileUploader.prototype.onBuildItemForm = function (fileItem, form) {
	        return { fileItem: fileItem, form: form };
	    };
	    FileUploader.prototype.onAfterAddingFile = function (fileItem) {
	        return { fileItem: fileItem };
	    };
	    FileUploader.prototype.onWhenAddingFileFailed = function (item, filter, options) {
	        return { item: item, filter: filter, options: options };
	    };
	    FileUploader.prototype.onBeforeUploadItem = function (fileItem) {
	        return { fileItem: fileItem };
	    };
	    FileUploader.prototype.onProgressItem = function (fileItem, progress) {
	        return { fileItem: fileItem, progress: progress };
	    };
	    FileUploader.prototype.onProgressAll = function (progress) {
	        return { progress: progress };
	    };
	    FileUploader.prototype.onSuccessItem = function (item, response, status, headers) {
	        return { item: item, response: response, status: status, headers: headers };
	    };
	    FileUploader.prototype.onErrorItem = function (item, response, status, headers) {
	        return { item: item, response: response, status: status, headers: headers };
	    };
	    FileUploader.prototype.onCancelItem = function (item, response, status, headers) {
	        return { item: item, response: response, status: status, headers: headers };
	    };
	    FileUploader.prototype.onCompleteItem = function (item, response, status, headers) {
	        return { item: item, response: response, status: status, headers: headers };
	    };
	    FileUploader.prototype.onCompleteAll = function () {
	        return void 0;
	    };
	    FileUploader.prototype._mimeTypeFilter = function (item) {
	        return !(this.options.allowedMimeType && this.options.allowedMimeType.indexOf(item.type) === -1);
	    };
	    FileUploader.prototype._fileSizeFilter = function (item) {
	        return !(this.options.maxFileSize && item.size > this.options.maxFileSize);
	    };
	    FileUploader.prototype._fileTypeFilter = function (item) {
	        return !(this.options.allowedFileType &&
	            this.options.allowedFileType.indexOf(file_type_class_1.FileType.getMimeClass(item)) === -1);
	    };
	    FileUploader.prototype._onErrorItem = function (item, response, status, headers) {
	        item._onError(response, status, headers);
	        this.onErrorItem(item, response, status, headers);
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
	    FileUploader.prototype._headersGetter = function (parsedHeaders) {
	        return function (name) {
	            if (name) {
	                return parsedHeaders[name.toLowerCase()] || void 0;
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
	        this._onBuildItemForm(item, form);
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
	        if (this.options.headers) {
	            for (var _i = 0, _a = this.options.headers; _i < _a.length; _i++) {
	                var header = _a[_i];
	                xhr.setRequestHeader(header.name, header.value);
	            }
	        }
	        if (this.authToken) {
	            xhr.setRequestHeader('Authorization', this.authToken);
	        }
	        xhr.send(form);
	        this._render();
	    };
	    FileUploader.prototype._getTotalProgress = function (value) {
	        if (value === void 0) { value = 0; }
	        if (this.options.removeAfterUpload) {
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
	            return this.options.filters;
	        }
	        if (Array.isArray(filters)) {
	            return filters;
	        }
	        if (typeof filters === 'string') {
	            var names_1 = filters.match(/[^\s,]+/g);
	            return this.options.filters
	                .filter(function (filter) { return names_1.indexOf(filter.name) !== -1; });
	        }
	        return this.options.filters;
	    };
	    FileUploader.prototype._render = function () {
	        return void 0;
	    };
	    FileUploader.prototype._queueLimitFilter = function () {
	        return this.options.queueLimit === undefined || this.queue.length < this.options.queueLimit;
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
	        var parsed = {};
	        var key;
	        var val;
	        var i;
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
	    FileUploader.prototype._onBuildItemForm = function (item, form) {
	        item._onBuildForm(form);
	        this.onBuildItemForm(item, form);
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
	    FileUploader.prototype._onCancelItem = function (item, response, status, headers) {
	        item._onCancel(response, status, headers);
	        this.onCancelItem(item, response, status, headers);
	    };
	    return FileUploader;
	}());
	exports.FileUploader = FileUploader;


/***/ },

/***/ 44:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(1);
	var file_uploader_class_1 = __webpack_require__(28);
	var FileDropDirective = (function () {
	    function FileDropDirective(element) {
	        this.fileOver = new core_1.EventEmitter();
	        this.onFileDrop = new core_1.EventEmitter();
	        this.element = element;
	    }
	    FileDropDirective.prototype.getOptions = function () {
	        return this.uploader.options;
	    };
	    FileDropDirective.prototype.getFilters = function () {
	        return {};
	    };
	    FileDropDirective.prototype.onDrop = function (event) {
	        var transfer = this._getTransfer(event);
	        if (!transfer) {
	            return;
	        }
	        var options = this.getOptions();
	        var filters = this.getFilters();
	        this._preventAndStop(event);
	        this.uploader.addToQueue(transfer.files, options, filters);
	        this.fileOver.emit(false);
	        this.onFileDrop.emit(transfer.files);
	    };
	    FileDropDirective.prototype.onDragOver = function (event) {
	        var transfer = this._getTransfer(event);
	        if (!this._haveFiles(transfer.types)) {
	            return;
	        }
	        transfer.dropEffect = 'copy';
	        this._preventAndStop(event);
	        this.fileOver.emit(true);
	    };
	    FileDropDirective.prototype.onDragLeave = function (event) {
	        if (event.currentTarget === this.element[0]) {
	            return;
	        }
	        this._preventAndStop(event);
	        this.fileOver.emit(false);
	    };
	    FileDropDirective.prototype._getTransfer = function (event) {
	        return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer;
	    };
	    FileDropDirective.prototype._preventAndStop = function (event) {
	        event.preventDefault();
	        event.stopPropagation();
	    };
	    FileDropDirective.prototype._haveFiles = function (types) {
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
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', file_uploader_class_1.FileUploader)
	    ], FileDropDirective.prototype, "uploader", void 0);
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', core_1.EventEmitter)
	    ], FileDropDirective.prototype, "fileOver", void 0);
	    __decorate([
	        core_1.Output(), 
	        __metadata('design:type', core_1.EventEmitter)
	    ], FileDropDirective.prototype, "onFileDrop", void 0);
	    __decorate([
	        core_1.HostListener('drop', ['$event']), 
	        __metadata('design:type', Function), 
	        __metadata('design:paramtypes', [Object]), 
	        __metadata('design:returntype', void 0)
	    ], FileDropDirective.prototype, "onDrop", null);
	    __decorate([
	        core_1.HostListener('dragover', ['$event']), 
	        __metadata('design:type', Function), 
	        __metadata('design:paramtypes', [Object]), 
	        __metadata('design:returntype', void 0)
	    ], FileDropDirective.prototype, "onDragOver", null);
	    __decorate([
	        core_1.HostListener('dragleave', ['$event']), 
	        __metadata('design:type', Function), 
	        __metadata('design:paramtypes', [Object]), 
	        __metadata('design:returntype', Object)
	    ], FileDropDirective.prototype, "onDragLeave", null);
	    FileDropDirective = __decorate([
	        core_1.Directive({ selector: '[ng2FileDrop]' }), 
	        __metadata('design:paramtypes', [core_1.ElementRef])
	    ], FileDropDirective);
	    return FileDropDirective;
	}());
	exports.FileDropDirective = FileDropDirective;


/***/ },

/***/ 45:
/***/ function(module, exports) {

	"use strict";
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
	        this.lastModifiedDate = void 0;
	        this.size = void 0;
	        this.type = 'like/' + path.slice(path.lastIndexOf('.') + 1).toLowerCase();
	        this.name = path.slice(path.lastIndexOf('/') + path.lastIndexOf('\\') + 2);
	    };
	    FileLikeObject.prototype._createFromObject = function (object) {
	        this.size = object.size;
	        this.type = object.type;
	        this.name = object.name;
	    };
	    return FileLikeObject;
	}());
	exports.FileLikeObject = FileLikeObject;


/***/ },

/***/ 46:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var core_1 = __webpack_require__(1);
	var file_uploader_class_1 = __webpack_require__(28);
	var FileSelectDirective = (function () {
	    function FileSelectDirective(element) {
	        this.element = element;
	    }
	    FileSelectDirective.prototype.getOptions = function () {
	        return this.uploader.options;
	    };
	    FileSelectDirective.prototype.getFilters = function () {
	        return void 0;
	    };
	    FileSelectDirective.prototype.isEmptyAfterSelection = function () {
	        return !!this.element.nativeElement.attributes.multiple;
	    };
	    FileSelectDirective.prototype.onChange = function () {
	        var files = this.element.nativeElement.files;
	        var options = this.getOptions();
	        var filters = this.getFilters();
	        this.uploader.addToQueue(files, options, filters);
	        if (this.isEmptyAfterSelection()) {
	        }
	    };
	    __decorate([
	        core_1.Input(), 
	        __metadata('design:type', file_uploader_class_1.FileUploader)
	    ], FileSelectDirective.prototype, "uploader", void 0);
	    __decorate([
	        core_1.HostListener('change'), 
	        __metadata('design:type', Function), 
	        __metadata('design:paramtypes', []), 
	        __metadata('design:returntype', Object)
	    ], FileSelectDirective.prototype, "onChange", null);
	    FileSelectDirective = __decorate([
	        core_1.Directive({ selector: '[ng2FileSelect]' }), 
	        __metadata('design:paramtypes', [core_1.ElementRef])
	    ], FileSelectDirective);
	    return FileSelectDirective;
	}());
	exports.FileSelectDirective = FileSelectDirective;


/***/ },

/***/ 138:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	var core_1 = __webpack_require__(1);
	var file_like_object_class_1 = __webpack_require__(45);
	var FileItem = (function () {
	    function FileItem(uploader, some, options) {
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
	        this.index = void 0;
	        this.uploader = uploader;
	        this.some = some;
	        this.options = options;
	        this.file = new file_like_object_class_1.FileLikeObject(some);
	        this._file = some;
	        this.url = uploader.options.url;
	        this._zone = new core_1.NgZone({ enableLongStackTrace: false });
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
	        return void 0;
	    };
	    FileItem.prototype.onBuildForm = function (form) {
	        return { form: form };
	    };
	    FileItem.prototype.onProgress = function (progress) {
	        return { progress: progress };
	    };
	    FileItem.prototype.onSuccess = function (response, status, headers) {
	        return { response: response, status: status, headers: headers };
	    };
	    FileItem.prototype.onError = function (response, status, headers) {
	        return { response: response, status: status, headers: headers };
	    };
	    FileItem.prototype.onCancel = function (response, status, headers) {
	        return { response: response, status: status, headers: headers };
	    };
	    FileItem.prototype.onComplete = function (response, status, headers) {
	        return { response: response, status: status, headers: headers };
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
	    FileItem.prototype._onBuildForm = function (form) {
	        this.onBuildForm(form);
	    };
	    FileItem.prototype._onProgress = function (progress) {
	        var _this = this;
	        this._zone.run(function () {
	            _this.progress = progress;
	        });
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
	        this.index = void 0;
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
	        this.index = void 0;
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
	        this.index = void 0;
	        this.onCancel(response, status, headers);
	    };
	    FileItem.prototype._onComplete = function (response, status, headers) {
	        this.onComplete(response, status, headers);
	        if (this.uploader.options.removeAfterUpload) {
	            this.remove();
	        }
	    };
	    FileItem.prototype._prepareToUploading = function () {
	        this.index = this.index || ++this.uploader._nextIndex;
	        this.isReady = true;
	    };
	    return FileItem;
	}());
	exports.FileItem = FileItem;


/***/ },

/***/ 139:
/***/ function(module, exports) {

	"use strict";
	var FileType = (function () {
	    function FileType() {
	    }
	    FileType.getMimeClass = function (file) {
	        var mimeClass = 'application';
	        if (this.mime_psd.indexOf(file.type) !== -1) {
	            mimeClass = 'image';
	        }
	        else if (file.type.match('image.*')) {
	            mimeClass = 'image';
	        }
	        else if (file.type.match('video.*')) {
	            mimeClass = 'video';
	        }
	        else if (file.type.match('audio.*')) {
	            mimeClass = 'audio';
	        }
	        else if (file.type === 'application/pdf') {
	            mimeClass = 'pdf';
	        }
	        else if (this.mime_compress.indexOf(file.type) !== -1) {
	            mimeClass = 'compress';
	        }
	        else if (this.mime_doc.indexOf(file.type) !== -1) {
	            mimeClass = 'doc';
	        }
	        else if (this.mime_xsl.indexOf(file.type) !== -1) {
	            mimeClass = 'xls';
	        }
	        else if (this.mime_ppt.indexOf(file.type) !== -1) {
	            mimeClass = 'ppt';
	        }
	        if (mimeClass === 'application') {
	            mimeClass = this.fileTypeDetection(file.name);
	        }
	        return mimeClass;
	    };
	    FileType.fileTypeDetection = function (inputFilename) {
	        var types = {
	            'jpg': 'image',
	            'jpeg': 'image',
	            'tif': 'image',
	            'psd': 'image',
	            'bmp': 'image',
	            'png': 'image',
	            'nef': 'image',
	            'tiff': 'image',
	            'cr2': 'image',
	            'dwg': 'image',
	            'cdr': 'image',
	            'ai': 'image',
	            'indd': 'image',
	            'pin': 'image',
	            'cdp': 'image',
	            'skp': 'image',
	            'stp': 'image',
	            '3dm': 'image',
	            'mp3': 'audio',
	            'wav': 'audio',
	            'wma': 'audio',
	            'mod': 'audio',
	            'm4a': 'audio',
	            'compress': 'compress',
	            'rar': 'compress',
	            '7z': 'compress',
	            'lz': 'compress',
	            'z01': 'compress',
	            'pdf': 'pdf',
	            'xls': 'xls',
	            'xlsx': 'xls',
	            'ods': 'xls',
	            'mp4': 'video',
	            'avi': 'video',
	            'wmv': 'video',
	            'mpg': 'video',
	            'mts': 'video',
	            'flv': 'video',
	            '3gp': 'video',
	            'vob': 'video',
	            'm4v': 'video',
	            'mpeg': 'video',
	            'm2ts': 'video',
	            'mov': 'video',
	            'doc': 'doc',
	            'docx': 'doc',
	            'eps': 'doc',
	            'txt': 'doc',
	            'odt': 'doc',
	            'rtf': 'doc',
	            'ppt': 'ppt',
	            'pptx': 'ppt',
	            'pps': 'ppt',
	            'ppsx': 'ppt',
	            'odp': 'ppt'
	        };
	        var chunks = inputFilename.split('.');
	        if (chunks.length < 2) {
	            return 'application';
	        }
	        var extension = chunks[chunks.length - 1].toLowerCase();
	        if (types[extension] === undefined) {
	            return 'application';
	        }
	        else {
	            return types[extension];
	        }
	    };
	    FileType.mime_doc = [
	        'application/msword',
	        'application/msword',
	        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	        'application/vnd.openxmlformats-officedocument.wordprocessingml.template',
	        'application/vnd.ms-word.document.macroEnabled.12',
	        'application/vnd.ms-word.template.macroEnabled.12'
	    ];
	    FileType.mime_xsl = [
	        'application/vnd.ms-excel',
	        'application/vnd.ms-excel',
	        'application/vnd.ms-excel',
	        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	        'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
	        'application/vnd.ms-excel.sheet.macroEnabled.12',
	        'application/vnd.ms-excel.template.macroEnabled.12',
	        'application/vnd.ms-excel.addin.macroEnabled.12',
	        'application/vnd.ms-excel.sheet.binary.macroEnabled.12'
	    ];
	    FileType.mime_ppt = [
	        'application/vnd.ms-powerpoint',
	        'application/vnd.ms-powerpoint',
	        'application/vnd.ms-powerpoint',
	        'application/vnd.ms-powerpoint',
	        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	        'application/vnd.openxmlformats-officedocument.presentationml.template',
	        'application/vnd.openxmlformats-officedocument.presentationml.slideshow',
	        'application/vnd.ms-powerpoint.addin.macroEnabled.12',
	        'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
	        'application/vnd.ms-powerpoint.presentation.macroEnabled.12',
	        'application/vnd.ms-powerpoint.slideshow.macroEnabled.12'
	    ];
	    FileType.mime_psd = [
	        'image/photoshop',
	        'image/x-photoshop',
	        'image/psd',
	        'application/photoshop',
	        'application/psd',
	        'zz-application/zz-winassoc-psd'
	    ];
	    FileType.mime_compress = [
	        'application/x-gtar',
	        'application/x-gcompress',
	        'application/compress',
	        'application/x-tar',
	        'application/x-rar-compressed',
	        'application/octet-stream'
	    ];
	    return FileType;
	}());
	exports.FileType = FileType;


/***/ },

/***/ 140:
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(46));
	__export(__webpack_require__(44));
	__export(__webpack_require__(28));
	var file_select_directive_2 = __webpack_require__(46);
	var file_drop_directive_2 = __webpack_require__(44);
	exports.FILE_UPLOAD_DIRECTIVES = [file_select_directive_2.FileSelectDirective, file_drop_directive_2.FileDropDirective];
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = {
	    directives: [
	        exports.FILE_UPLOAD_DIRECTIVES
	    ]
	};


/***/ }

});
//# sourceMappingURL=angular2-bootstrap.js.map