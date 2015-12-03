webpackJsonp([1],{

/***/ 0:
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
	var file_upload_section_1 = __webpack_require__(376);
	var gettingStarted = __webpack_require__(370);
	var Demo = (function () {
	    function Demo() {
	    }
	    Demo = __decorate([
	        angular2_1.Component({
	            selector: 'app'
	        }),
	        angular2_1.View({
	            template: "\n  <main class=\"bd-pageheader\">\n    <div class=\"container\">\n      <h1>ng2-file-upload</h1>\n      <p>The Angular2 File Upload directives</p>\n      <a class=\"btn btn-primary\" href=\"https://github.com/valor-software/ng2-file-upload\">View on GitHub</a>\n      <div class=\"row\">\n        <div class=\"col-lg-1\"><iframe src=\"https://ghbtns.com/github-btn.html?user=valor-software&repo=ng2-file-upload&type=star&count=true\" frameborder=\"0\" scrolling=\"0\" width=\"170px\" height=\"20px\"></iframe></div>\n        <div class=\"col-lg-1\"><iframe src=\"https://ghbtns.com/github-btn.html?user=valor-software&repo=ng2-file-upload&type=fork&count=true\" frameborder=\"0\" scrolling=\"0\" width=\"170px\" height=\"20px\"></iframe></div>\n      </div>\n    </div>\n  </main>\n\n  <div class=\"container\">\n    <section id=\"getting-started\">" + gettingStarted + "</section>\n\n    <file-upload-section class=\"col-md-12\"></file-upload-section>\n  </div>\n\n  <footer class=\"footer\">\n    <div class=\"container\">\n      <p class=\"text-muted text-center\"><a href=\"https://github.com/valor-software/ng2-file-upload\">ng2-file-upload</a> is maintained by <a href=\"https://github.com/valor-software\">valor-software</a>.</p>\n    </div>\n  </footer>\n  ",
	            directives: [
	                angular2_1.NgClass,
	                file_upload_section_1.FileUploadSection
	            ]
	        }), 
	        __metadata('design:paramtypes', [])
	    ], Demo);
	    return Demo;
	})();
	exports.Demo = Demo;
	angular2_1.bootstrap(Demo);


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

/***/ 76:
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
	var dropdown_service_1 = __webpack_require__(211);
	var Dropdown = (function () {
	    function Dropdown(el) {
	        this.el = el;
	        this.onToggle = new angular2_1.EventEmitter();
	    }
	    Dropdown.prototype.onInit = function () {
	        this.autoClose = this.autoClose || dropdown_service_1.ALWAYS;
	        this.keyboardNav = typeof this.keyboardNav !== 'undefined';
	        this.dropdownAppendToBody = typeof this.dropdownAppendToBody !== 'undefined';
	        if (this.isOpen) {
	        }
	    };
	    Dropdown.prototype.onDestroy = function () {
	        if (this.dropdownAppendToBody && this.menuEl) {
	            this.menuEl.nativeElement.remove();
	        }
	    };
	    Object.defineProperty(Dropdown.prototype, "dropDownMenu", {
	        set: function (dropdownMenu) {
	            this.menuEl = dropdownMenu.el;
	            if (dropdownMenu.templateUrl) {
	                this.dropdownMenuTemplateUrl = dropdownMenu.templateUrl;
	            }
	            if (this.dropdownAppendToBody) {
	                window.document.body.appendChild(this.menuEl.nativeElement);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Dropdown.prototype, "dropDownToggle", {
	        set: function (dropdownToggle) {
	            this.toggleEl = dropdownToggle.el;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Dropdown.prototype.toggle = function (open) {
	        return this.isOpen = arguments.length ? !!open : !this.isOpen;
	    };
	    Object.defineProperty(Dropdown.prototype, "isOpen", {
	        get: function () {
	            return this._isOpen;
	        },
	        set: function (value) {
	            this._isOpen = !!value;
	            if (this.dropdownAppendToBody && this.menuEl) {
	            }
	            if (this.isOpen) {
	                if (this.dropdownMenuTemplateUrl) {
	                }
	                this.focusToggleElement();
	                dropdown_service_1.dropdownService.open(this);
	            }
	            else {
	                if (this.dropdownMenuTemplateUrl) {
	                }
	                dropdown_service_1.dropdownService.close(this);
	                this.selectedOption = null;
	            }
	            this.onToggle.next(this.isOpen);
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Dropdown.prototype.focusDropdownEntry = function (keyCode) {
	        var hostEl = this.menuEl ?
	            this.menuEl.nativeElement :
	            this.el.nativeElement.getElementsByTagName('ul')[0];
	        if (!hostEl) {
	            return;
	        }
	        var elems = hostEl.getElementsByTagName('a');
	        if (!elems || !elems.length) {
	            return;
	        }
	        switch (keyCode) {
	            case (40):
	                if (typeof this.selectedOption !== 'number') {
	                    this.selectedOption = 0;
	                    break;
	                }
	                if (this.selectedOption === elems.length - 1) {
	                    break;
	                }
	                this.selectedOption++;
	                break;
	            case (38):
	                if (typeof this.selectedOption !== 'number') {
	                    return;
	                }
	                if (this.selectedOption === 0) {
	                    break;
	                }
	                this.selectedOption--;
	                break;
	        }
	        elems[this.selectedOption].focus();
	    };
	    Dropdown.prototype.focusToggleElement = function () {
	        if (this.toggleEl) {
	            this.toggleEl.nativeElement.focus();
	        }
	    };
	    Dropdown = __decorate([
	        angular2_1.Directive({
	            selector: '[dropdown]',
	            properties: ['isOpen', 'autoClose', 'keyboardNav', 'dropdownAppendToBody'],
	            events: ['onToggle'],
	            host: {
	                '[class.dropdown]': 'true',
	                '[class.open]': 'isOpen'
	            }
	        }), 
	        __metadata('design:paramtypes', [angular2_1.ElementRef])
	    ], Dropdown);
	    return Dropdown;
	})();
	exports.Dropdown = Dropdown;


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

/***/ 129:
/***/ function(module, exports) {

	(function (Ng2BootstrapTheme) {
	    Ng2BootstrapTheme[Ng2BootstrapTheme["BS3"] = 1] = "BS3";
	    Ng2BootstrapTheme[Ng2BootstrapTheme["BS4"] = 2] = "BS4";
	})(exports.Ng2BootstrapTheme || (exports.Ng2BootstrapTheme = {}));
	var Ng2BootstrapTheme = exports.Ng2BootstrapTheme;
	var Ng2BootstrapConfig = (function () {
	    function Ng2BootstrapConfig() {
	    }
	    Object.defineProperty(Ng2BootstrapConfig, "theme", {
	        get: function () {
	            var w = window;
	            if (w && w.__theme === 'bs4') {
	                return Ng2BootstrapTheme.BS4;
	            }
	            return (this._theme || Ng2BootstrapTheme.BS3);
	        },
	        set: function (v) {
	            this._theme = v;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Ng2BootstrapConfig;
	})();
	exports.Ng2BootstrapConfig = Ng2BootstrapConfig;


/***/ },

/***/ 130:
/***/ function(module, exports) {

	var PositionService = (function () {
	    function PositionService() {
	    }
	    Object.defineProperty(PositionService.prototype, "window", {
	        get: function () {
	            return window;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(PositionService.prototype, "document", {
	        get: function () {
	            return window.document;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    PositionService.prototype.getStyle = function (nativeEl, cssProp) {
	        if (nativeEl.currentStyle) {
	            return nativeEl.currentStyle[cssProp];
	        }
	        if (this.window.getComputedStyle) {
	            return this.window.getComputedStyle(nativeEl)[cssProp];
	        }
	        return nativeEl.style[cssProp];
	    };
	    PositionService.prototype.isStaticPositioned = function (nativeEl) {
	        return (this.getStyle(nativeEl, 'position') || 'static') === 'static';
	    };
	    PositionService.prototype.parentOffsetEl = function (nativeEl) {
	        var offsetParent = nativeEl.offsetParent || this.document;
	        while (offsetParent && offsetParent !== this.document &&
	            this.isStaticPositioned(offsetParent)) {
	            offsetParent = offsetParent.offsetParent;
	        }
	        return offsetParent || this.document;
	    };
	    ;
	    PositionService.prototype.position = function (nativeEl) {
	        var elBCR = this.offset(nativeEl);
	        var offsetParentBCR = { top: 0, left: 0 };
	        var offsetParentEl = this.parentOffsetEl(nativeEl);
	        if (offsetParentEl !== this.document) {
	            offsetParentBCR = this.offset(offsetParentEl);
	            offsetParentBCR.top += offsetParentEl.clientTop - offsetParentEl.scrollTop;
	            offsetParentBCR.left += offsetParentEl.clientLeft - offsetParentEl.scrollLeft;
	        }
	        var boundingClientRect = nativeEl.getBoundingClientRect();
	        return {
	            width: boundingClientRect.width || nativeEl.offsetWidth,
	            height: boundingClientRect.height || nativeEl.offsetHeight,
	            top: elBCR.top - offsetParentBCR.top,
	            left: elBCR.left - offsetParentBCR.left
	        };
	    };
	    PositionService.prototype.offset = function (nativeEl) {
	        var boundingClientRect = nativeEl.getBoundingClientRect();
	        return {
	            width: boundingClientRect.width || nativeEl.offsetWidth,
	            height: boundingClientRect.height || nativeEl.offsetHeight,
	            top: boundingClientRect.top + (this.window.pageYOffset || this.document.documentElement.scrollTop),
	            left: boundingClientRect.left + (this.window.pageXOffset || this.document.documentElement.scrollLeft)
	        };
	    };
	    PositionService.prototype.positionElements = function (hostEl, targetEl, positionStr, appendToBody) {
	        var positionStrParts = positionStr.split('-');
	        var pos0 = positionStrParts[0];
	        var pos1 = positionStrParts[1] || 'center';
	        var hostElPos = appendToBody ?
	            this.offset(hostEl) :
	            this.position(hostEl);
	        var targetElWidth = targetEl.offsetWidth;
	        var targetElHeight = targetEl.offsetHeight;
	        var shiftWidth = {
	            center: function () {
	                return hostElPos.left + hostElPos.width / 2 - targetElWidth / 2;
	            },
	            left: function () {
	                return hostElPos.left;
	            },
	            right: function () {
	                return hostElPos.left + hostElPos.width;
	            }
	        };
	        var shiftHeight = {
	            center: function () {
	                return hostElPos.top + hostElPos.height / 2 - targetElHeight / 2;
	            },
	            top: function () {
	                return hostElPos.top;
	            },
	            bottom: function () {
	                return hostElPos.top + hostElPos.height;
	            }
	        };
	        var targetElPos;
	        switch (pos0) {
	            case 'right':
	                targetElPos = {
	                    top: shiftHeight[pos1](),
	                    left: shiftWidth[pos0]()
	                };
	                break;
	            case 'left':
	                targetElPos = {
	                    top: shiftHeight[pos1](),
	                    left: hostElPos.left - targetElWidth
	                };
	                break;
	            case 'bottom':
	                targetElPos = {
	                    top: shiftHeight[pos0](),
	                    left: shiftWidth[pos1]()
	                };
	                break;
	            default:
	                targetElPos = {
	                    top: hostElPos.top - targetElHeight,
	                    left: shiftWidth[pos1]()
	                };
	                break;
	        }
	        return targetElPos;
	    };
	    return PositionService;
	})();
	exports.PositionService = PositionService;
	exports.positionService = new PositionService();


/***/ },

/***/ 208:
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
	var Collapse = (function () {
	    function Collapse(el) {
	        this.el = el;
	        this.test = 'wtf';
	        this.isExpanded = true;
	        this.isCollapsed = false;
	        this.isCollapse = true;
	        this.isCollapsing = false;
	    }
	    Object.defineProperty(Collapse.prototype, "collapse", {
	        get: function () {
	            return this.isExpanded;
	        },
	        set: function (value) {
	            this.isExpanded = value;
	            this.toggle();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Collapse.prototype.toggle = function () {
	        if (this.isExpanded) {
	            this.hide();
	        }
	        else {
	            this.show();
	        }
	    };
	    Collapse.prototype.hide = function () {
	        var _this = this;
	        this.isCollapse = false;
	        this.isCollapsing = true;
	        this.isExpanded = false;
	        this.isCollapsed = true;
	        setTimeout(function () {
	            _this.height = '0';
	            _this.isCollapse = true;
	            _this.isCollapsing = false;
	        }, 4);
	    };
	    Collapse.prototype.show = function () {
	        var _this = this;
	        this.isCollapse = false;
	        this.isCollapsing = true;
	        this.isExpanded = true;
	        this.isCollapsed = false;
	        setTimeout(function () {
	            _this.height = 'auto';
	            _this.isCollapse = true;
	            _this.isCollapsing = false;
	        }, 4);
	    };
	    Collapse = __decorate([
	        angular2_1.Directive({
	            selector: '[collapse]',
	            properties: ['collapse'],
	            host: {
	                '[class.in]': 'isExpanded',
	                '[class.collapse]': 'isCollapse',
	                '[class.collapsing]': 'isCollapsing',
	                '[attr.aria-expanded]': 'isExpanded',
	                '[attr.aria-hidden]': 'isCollapsed',
	                '[style.height]': 'height'
	            }
	        }), 
	        __metadata('design:paramtypes', [angular2_1.ElementRef])
	    ], Collapse);
	    return Collapse;
	})();
	exports.Collapse = Collapse;


/***/ },

/***/ 209:
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
	var __param = (this && this.__param) || function (paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	};
	var angular2_1 = __webpack_require__(8);
	var NgTransclude = (function () {
	    function NgTransclude(viewRef) {
	        this.viewRef = viewRef;
	    }
	    Object.defineProperty(NgTransclude.prototype, "ngTransclude", {
	        get: function () {
	            return this._ngTransclude;
	        },
	        set: function (templateRef) {
	            this._ngTransclude = templateRef;
	            if (templateRef) {
	                this.viewRef.createEmbeddedView(templateRef);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    NgTransclude = __decorate([
	        angular2_1.Directive({
	            selector: '[ng-transclude]',
	            properties: ['ngTransclude']
	        }),
	        __param(0, angular2_1.Inject(angular2_1.ViewContainerRef)), 
	        __metadata('design:paramtypes', [angular2_1.ViewContainerRef])
	    ], NgTransclude);
	    return NgTransclude;
	})();
	exports.NgTransclude = NgTransclude;


/***/ },

/***/ 210:
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
	var __param = (this && this.__param) || function (paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	};
	var angular2_1 = __webpack_require__(8);
	var dropdown_1 = __webpack_require__(76);
	var DropdownMenu = (function () {
	    function DropdownMenu(dropdown, el) {
	        this.dropdown = dropdown;
	        this.el = el;
	    }
	    DropdownMenu.prototype.onInit = function () {
	        this.dropdown.dropDownMenu = this;
	    };
	    DropdownMenu = __decorate([
	        angular2_1.Directive({
	            selector: '[dropdown-menu], .dropdown-menu',
	            properties: ['templateUrl']
	        }),
	        __param(0, angular2_1.Host()), 
	        __metadata('design:paramtypes', [dropdown_1.Dropdown, angular2_1.ElementRef])
	    ], DropdownMenu);
	    return DropdownMenu;
	})();
	exports.DropdownMenu = DropdownMenu;


/***/ },

/***/ 211:
/***/ function(module, exports) {

	exports.ALWAYS = 'always';
	exports.DISABLED = 'disabled';
	exports.OUTSIDECLICK = 'outsideClick';
	var DropdownService = (function () {
	    function DropdownService() {
	        this.closeDropdownBind = this.closeDropdown.bind(this);
	        this.keybindFilterBind = this.keybindFilter.bind(this);
	    }
	    DropdownService.prototype.open = function (dropdownScope) {
	        if (!this.openScope) {
	            window.document.addEventListener('click', this.closeDropdownBind);
	            window.document.addEventListener('keydown', this.keybindFilterBind);
	        }
	        if (this.openScope && this.openScope !== this.dropdownScope) {
	            this.openScope.isOpen = false;
	        }
	        this.openScope = dropdownScope;
	    };
	    DropdownService.prototype.close = function (dropdownScope) {
	        if (this.openScope !== dropdownScope) {
	            return;
	        }
	        this.openScope = null;
	        window.document.removeEventListener('click', this.closeDropdownBind);
	        window.document.removeEventListener('keydown', this.keybindFilterBind);
	    };
	    DropdownService.prototype.closeDropdown = function (event) {
	        if (!this.openScope) {
	            return;
	        }
	        if (event && this.openScope.autoClose === exports.DISABLED) {
	            return;
	        }
	        if (event && this.openScope.toggleEl &&
	            this.openScope.toggleEl.nativeElement === event.target) {
	            return;
	        }
	        if (event && this.openScope.autoClose === exports.OUTSIDECLICK &&
	            this.openScope.menuEl &&
	            this.openScope.menuEl.nativeElement === event.target) {
	            return;
	        }
	        this.openScope.isOpen = false;
	    };
	    DropdownService.prototype.keybindFilter = function (event) {
	        if (event.which === 27) {
	            this.openScope.focusToggleElement();
	            this.closeDropdown(null);
	            return;
	        }
	        if (this.openScope.keyboardNav && this.openScope.isOpen &&
	            (event.which === 38 || event.which === 40)) {
	            event.preventDefault();
	            event.stopPropagation();
	            this.openScope.focusDropdownEntry(event.which);
	        }
	    };
	    return DropdownService;
	})();
	exports.DropdownService = DropdownService;
	exports.dropdownService = new DropdownService();


/***/ },

/***/ 212:
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
	var __param = (this && this.__param) || function (paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	};
	var angular2_1 = __webpack_require__(8);
	var dropdown_1 = __webpack_require__(76);
	var DropdownToggle = (function () {
	    function DropdownToggle(dropdown, el) {
	        this.dropdown = dropdown;
	        this.el = el;
	        this.disabled = false;
	    }
	    DropdownToggle.prototype.onInit = function () {
	        this.dropdown.dropDownToggle = this;
	    };
	    Object.defineProperty(DropdownToggle.prototype, "isOpen", {
	        get: function () {
	            return this.dropdown.isOpen;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    DropdownToggle.prototype.toggleDropdown = function (event) {
	        event.preventDefault();
	        event.stopPropagation();
	        if (!this.disabled) {
	            this.dropdown.toggle();
	        }
	    };
	    DropdownToggle = __decorate([
	        angular2_1.Directive({
	            selector: '[dropdown-toggle]',
	            properties: ['disabled'],
	            host: {
	                '(click)': 'toggleDropdown($event)',
	                '[class.dropdown-toggle]': 'true',
	                '[class.disabled]': 'disabled',
	                '[attr.aria-haspopup]': 'true',
	                '[attr.aria-expanded]': 'isOpen'
	            }
	        }),
	        __param(0, angular2_1.Host()), 
	        __metadata('design:paramtypes', [dropdown_1.Dropdown, angular2_1.ElementRef])
	    ], DropdownToggle);
	    return DropdownToggle;
	})();
	exports.DropdownToggle = DropdownToggle;


/***/ },

/***/ 369:
/***/ function(module, exports) {

	module.exports = "<h3 id=\"usage\">Usage</h3>\n<pre class=\"language-typescript\"><code class=\"language-typescript\"><span class=\"token keyword\" >import</span> <span class=\"token punctuation\" >{</span>FileSelect<span class=\"token punctuation\" >,</span> FileDrop<span class=\"token punctuation\" >,</span> FileUploader<span class=\"token punctuation\" >}</span> from <span class=\"token string\" >'ng2-file-upload'</span><span class=\"token punctuation\" >;</span>\n</code></pre>\n<h3 id=\"annotations\">Annotations</h3>\n<pre class=\"language-typescript\"><code class=\"language-typescript\"><span class=\"token comment\" spellcheck=\"true\">// class FileSelect</span>\n@<span class=\"token function\" >Directive</span><span class=\"token punctuation\" >(</span><span class=\"token punctuation\" >{</span>\n  selector<span class=\"token punctuation\" >:</span> <span class=\"token string\" >'[ng2-file-select]'</span><span class=\"token punctuation\" >,</span>\n  properties<span class=\"token punctuation\" >:</span> <span class=\"token punctuation\" >[</span><span class=\"token string\" >'uploader'</span><span class=\"token punctuation\" >]</span><span class=\"token punctuation\" >,</span>\n  host<span class=\"token punctuation\" >:</span> <span class=\"token punctuation\" >{</span>\n    <span class=\"token string\" >'(change)'</span><span class=\"token punctuation\" >:</span> <span class=\"token string\" >'onChange()'</span>\n  <span class=\"token punctuation\" >}</span>\n<span class=\"token punctuation\" >}</span><span class=\"token punctuation\" >)</span>\n</code></pre>\n<pre class=\"language-typescript\"><code class=\"language-typescript\"><span class=\"token comment\" spellcheck=\"true\">// class FileDrop</span>\n@<span class=\"token function\" >Directive</span><span class=\"token punctuation\" >(</span><span class=\"token punctuation\" >{</span>\n  selector<span class=\"token punctuation\" >:</span> <span class=\"token string\" >'[ng2-file-drop]'</span><span class=\"token punctuation\" >,</span>\n  properties<span class=\"token punctuation\" >:</span> <span class=\"token punctuation\" >[</span><span class=\"token string\" >'uploader'</span><span class=\"token punctuation\" >]</span><span class=\"token punctuation\" >,</span>\n  events<span class=\"token punctuation\" >:</span> <span class=\"token punctuation\" >[</span><span class=\"token string\" >'fileOver'</span><span class=\"token punctuation\" >]</span><span class=\"token punctuation\" >,</span>\n  host<span class=\"token punctuation\" >:</span> <span class=\"token punctuation\" >{</span>\n    <span class=\"token string\" >'(drop)'</span><span class=\"token punctuation\" >:</span> <span class=\"token string\" >'onDrop($event)'</span><span class=\"token punctuation\" >,</span>\n    <span class=\"token string\" >'(dragover)'</span><span class=\"token punctuation\" >:</span> <span class=\"token string\" >'onDragOver($event)'</span><span class=\"token punctuation\" >,</span>\n    <span class=\"token string\" >'(dragleave)'</span><span class=\"token punctuation\" >:</span> <span class=\"token string\" >'onDragLeave($event)'</span>\n  <span class=\"token punctuation\" >}</span>\n<span class=\"token punctuation\" >}</span><span class=\"token punctuation\" >)</span>\n</code></pre>\n<h2 id=\"fileselect-api\">FileSelect API</h2>\n<h3 id=\"properties\">Properties</h3>\n<ul>\n<li><p><code>uploader</code> - (<code>FileUploader</code>) - uploader object. See using in <a href=\"https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.ts\">demo</a></p>\n<p>Parameters that supported by this object:</p>\n</li>\n<li><p><code>url</code> - URL of File Uploader&#39;s route</p>\n</li>\n<li><code>authToken</code> - auth token that will be applied as &#39;Authorization&#39; header during file send.</li>\n</ul>\n<h2 id=\"filedrop-api\">FileDrop API</h2>\n<h3 id=\"properties\">Properties</h3>\n<ul>\n<li><code>uploader</code> - (<code>FileUploader</code>) - uploader object. See using in <a href=\"https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.ts\">demo</a></li>\n</ul>\n<h3 id=\"events\">Events</h3>\n<ul>\n<li><code>file-over</code> - it fires during &#39;over&#39; and &#39;out&#39; events for Drop Area; returns <code>boolean</code>: <code>true</code> if file is over Drop Area, <code>false</code> in case of out.\nSee using in <a href=\"https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.ts\">ts demo</a> and\n<a href=\"https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.html\">html demo</a></li>\n</ul>\n";

/***/ },

/***/ 370:
/***/ function(module, exports) {

	module.exports = "<h1 id=\"getting-started\">Getting started</h1>\n<h2 id=\"first-of-all-welcome-\">First of all, Welcome!</h2>\n<h3 id=\"install\">Install</h3>\n<p>Install the components</p>\n<pre><code>npm install ng2-file-upload --save\n</code></pre>";

/***/ },

/***/ 371:
/***/ function(module, exports) {

	module.exports = "<span class=\"token keyword\" >var</span> express <span class=\"token operator\" >=</span> <span class=\"token function\" >require</span><span class=\"token punctuation\" >(</span><span class=\"token string\" >'express'</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n<span class=\"token keyword\" >var</span> multer <span class=\"token operator\" >=</span> <span class=\"token function\" >require</span><span class=\"token punctuation\" >(</span><span class=\"token string\" >'multer'</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n<span class=\"token keyword\" >var</span> fs <span class=\"token operator\" >=</span> <span class=\"token function\" >require</span><span class=\"token punctuation\" >(</span><span class=\"token string\" >'fs'</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n<span class=\"token keyword\" >var</span> app <span class=\"token operator\" >=</span> <span class=\"token function\" >express</span><span class=\"token punctuation\" >(</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n\n<span class=\"token keyword\" >var</span> DIR <span class=\"token operator\" >=</span> <span class=\"token string\" >'./uploads/'</span><span class=\"token punctuation\" >;</span>\n\n<span class=\"token keyword\" >var</span> upload <span class=\"token operator\" >=</span> <span class=\"token function\" >multer</span><span class=\"token punctuation\" >(</span><span class=\"token punctuation\" >{</span>dest<span class=\"token punctuation\" >:</span> DIR<span class=\"token punctuation\" >}</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n\napp<span class=\"token punctuation\" >.</span><span class=\"token function\" >use</span><span class=\"token punctuation\" >(</span><span class=\"token keyword\" >function</span> <span class=\"token punctuation\" >(</span>req<span class=\"token punctuation\" >,</span> res<span class=\"token punctuation\" >,</span> next<span class=\"token punctuation\" >)</span> <span class=\"token punctuation\" >{</span>\n  res<span class=\"token punctuation\" >.</span><span class=\"token function\" >setHeader</span><span class=\"token punctuation\" >(</span><span class=\"token string\" >'Access-Control-Allow-Origin'</span><span class=\"token punctuation\" >,</span> <span class=\"token string\" >'http://valor-software.github.io'</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n  res<span class=\"token punctuation\" >.</span><span class=\"token function\" >setHeader</span><span class=\"token punctuation\" >(</span><span class=\"token string\" >'Access-Control-Allow-Methods'</span><span class=\"token punctuation\" >,</span> <span class=\"token string\" >'POST'</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n  res<span class=\"token punctuation\" >.</span><span class=\"token function\" >setHeader</span><span class=\"token punctuation\" >(</span><span class=\"token string\" >'Access-Control-Allow-Headers'</span><span class=\"token punctuation\" >,</span> <span class=\"token string\" >'X-Requested-With,content-type'</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n  res<span class=\"token punctuation\" >.</span><span class=\"token function\" >setHeader</span><span class=\"token punctuation\" >(</span><span class=\"token string\" >'Access-Control-Allow-Credentials'</span><span class=\"token punctuation\" >,</span> <span class=\"token keyword\" >true</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n  <span class=\"token function\" >next</span><span class=\"token punctuation\" >(</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n<span class=\"token punctuation\" >}</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n\napp<span class=\"token punctuation\" >.</span><span class=\"token function\" >use</span><span class=\"token punctuation\" >(</span><span class=\"token function\" >multer</span><span class=\"token punctuation\" >(</span><span class=\"token punctuation\" >{</span>\n  dest<span class=\"token punctuation\" >:</span> DIR<span class=\"token punctuation\" >,</span>\n  rename<span class=\"token punctuation\" >:</span> <span class=\"token keyword\" >function</span> <span class=\"token punctuation\" >(</span>fieldname<span class=\"token punctuation\" >,</span> filename<span class=\"token punctuation\" >)</span> <span class=\"token punctuation\" >{</span>\n    <span class=\"token keyword\" >return</span> filename <span class=\"token operator\" >+</span> Date<span class=\"token punctuation\" >.</span><span class=\"token function\" >now</span><span class=\"token punctuation\" >(</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n  <span class=\"token punctuation\" >}</span><span class=\"token punctuation\" >,</span>\n  onFileUploadStart<span class=\"token punctuation\" >:</span> <span class=\"token keyword\" >function</span> <span class=\"token punctuation\" >(</span>file<span class=\"token punctuation\" >)</span> <span class=\"token punctuation\" >{</span>\n    console<span class=\"token punctuation\" >.</span><span class=\"token function\" >log</span><span class=\"token punctuation\" >(</span>file<span class=\"token punctuation\" >.</span>originalname <span class=\"token operator\" >+</span> <span class=\"token string\" >' is starting ...'</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n  <span class=\"token punctuation\" >}</span><span class=\"token punctuation\" >,</span>\n  onFileUploadComplete<span class=\"token punctuation\" >:</span> <span class=\"token keyword\" >function</span> <span class=\"token punctuation\" >(</span>file<span class=\"token punctuation\" >)</span> <span class=\"token punctuation\" >{</span>\n    console<span class=\"token punctuation\" >.</span><span class=\"token function\" >log</span><span class=\"token punctuation\" >(</span>file<span class=\"token punctuation\" >.</span>fieldname <span class=\"token operator\" >+</span> <span class=\"token string\" >' uploaded to  '</span> <span class=\"token operator\" >+</span> file<span class=\"token punctuation\" >.</span>path<span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n  <span class=\"token punctuation\" >}</span>\n<span class=\"token punctuation\" >}</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n\napp<span class=\"token punctuation\" >.</span><span class=\"token keyword\" >get</span><span class=\"token punctuation\" >(</span><span class=\"token string\" >'/api'</span><span class=\"token punctuation\" >,</span> <span class=\"token keyword\" >function</span> <span class=\"token punctuation\" >(</span>req<span class=\"token punctuation\" >,</span> res<span class=\"token punctuation\" >)</span> <span class=\"token punctuation\" >{</span>\n  res<span class=\"token punctuation\" >.</span><span class=\"token function\" >end</span><span class=\"token punctuation\" >(</span><span class=\"token string\" >'file catcher example'</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n<span class=\"token punctuation\" >}</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n\napp<span class=\"token punctuation\" >.</span><span class=\"token function\" >post</span><span class=\"token punctuation\" >(</span><span class=\"token string\" >'/api'</span><span class=\"token punctuation\" >,</span> <span class=\"token keyword\" >function</span> <span class=\"token punctuation\" >(</span>req<span class=\"token punctuation\" >,</span> res<span class=\"token punctuation\" >)</span> <span class=\"token punctuation\" >{</span>\n  <span class=\"token function\" >upload</span><span class=\"token punctuation\" >(</span>req<span class=\"token punctuation\" >,</span> res<span class=\"token punctuation\" >,</span> <span class=\"token keyword\" >function</span> <span class=\"token punctuation\" >(</span>err<span class=\"token punctuation\" >)</span> <span class=\"token punctuation\" >{</span>\n    <span class=\"token keyword\" >if</span> <span class=\"token punctuation\" >(</span>err<span class=\"token punctuation\" >)</span> <span class=\"token punctuation\" >{</span>\n      <span class=\"token keyword\" >return</span> res<span class=\"token punctuation\" >.</span><span class=\"token function\" >end</span><span class=\"token punctuation\" >(</span>err<span class=\"token punctuation\" >.</span><span class=\"token function\" >toString</span><span class=\"token punctuation\" >(</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n    <span class=\"token punctuation\" >}</span>\n\n    res<span class=\"token punctuation\" >.</span><span class=\"token function\" >end</span><span class=\"token punctuation\" >(</span><span class=\"token string\" >'File is uploaded'</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n  <span class=\"token punctuation\" >}</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n<span class=\"token punctuation\" >}</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n\n<span class=\"token keyword\" >var</span> PORT <span class=\"token operator\" >=</span> process<span class=\"token punctuation\" >.</span>env<span class=\"token punctuation\" >.</span>PORT <span class=\"token operator\" >||</span> <span class=\"token number\" >3000</span><span class=\"token punctuation\" >;</span>\n\napp<span class=\"token punctuation\" >.</span><span class=\"token function\" >listen</span><span class=\"token punctuation\" >(</span>PORT<span class=\"token punctuation\" >,</span> <span class=\"token keyword\" >function</span> <span class=\"token punctuation\" >(</span><span class=\"token punctuation\" >)</span> <span class=\"token punctuation\" >{</span>\n  console<span class=\"token punctuation\" >.</span><span class=\"token function\" >log</span><span class=\"token punctuation\" >(</span><span class=\"token string\" >'Working on port '</span> <span class=\"token operator\" >+</span> PORT<span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n<span class=\"token punctuation\" >}</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n"

/***/ },

/***/ 372:
/***/ function(module, exports) {

	module.exports = "<span class=\"token style language-css\" ><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>style</span><span class=\"token punctuation\" >></span></span>\n    <span class=\"token selector\" >.my-drop-zone</span> <span class=\"token punctuation\" >{</span> <span class=\"token property\" >border</span><span class=\"token punctuation\" >:</span> dotted 3px lightgray<span class=\"token punctuation\" >;</span> <span class=\"token punctuation\" >}</span>\n    <span class=\"token selector\" >.nv-file-over</span> <span class=\"token punctuation\" >{</span> <span class=\"token property\" >border</span><span class=\"token punctuation\" >:</span> dotted 3px red<span class=\"token punctuation\" >;</span> <span class=\"token punctuation\" >}</span> <span class=\"token comment\" spellcheck=\"true\">/* Default class applied to drop zones on over */</span>\n    <span class=\"token selector\" >.another-file-over-class</span> <span class=\"token punctuation\" >{</span> <span class=\"token property\" >border</span><span class=\"token punctuation\" >:</span> dotted 3px green<span class=\"token punctuation\" >;</span> <span class=\"token punctuation\" >}</span>\n\n    <span class=\"token selector\" >html, body</span> <span class=\"token punctuation\" >{</span> <span class=\"token property\" >height</span><span class=\"token punctuation\" >:</span> 100%<span class=\"token punctuation\" >;</span> <span class=\"token punctuation\" >}</span>\n<span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>style</span><span class=\"token punctuation\" >></span></span></span>\n\n<span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>div</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>container<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n\n    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>div</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>navbar navbar-default<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n        <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>div</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>navbar-header<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n            <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>a</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>navbar-brand<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >href</span><span class=\"token punctuation\" >></span></span>Angular2 File Upload<span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>a</span><span class=\"token punctuation\" >></span></span>\n        <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>div</span><span class=\"token punctuation\" >></span></span>\n    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>div</span><span class=\"token punctuation\" >></span></span>\n\n    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>div</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>row<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n\n        <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>div</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>col-md-3<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n\n            <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>h3</span><span class=\"token punctuation\" >></span></span>Select files<span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>h3</span><span class=\"token punctuation\" >></span></span>\n\n            <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>div</span> <span class=\"token attr-name\" >ng2-file-drop</span>\n                 <span class=\"token attr-name\" >[ng-class]</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>{<span class=\"token punctuation\" >'</span>nv-file-over<span class=\"token punctuation\" >'</span>: hasBaseDropZoneOver}<span class=\"token punctuation\" >\"</span></span>\n                 <span class=\"token attr-name\" >(file-over)</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>fileOverBase($event)<span class=\"token punctuation\" >\"</span></span>\n                 <span class=\"token attr-name\" >[uploader]</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>uploader<span class=\"token punctuation\" >\"</span></span>\n                 <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>well my-drop-zone<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n                Base drop zone\n            <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>div</span><span class=\"token punctuation\" >></span></span>\n\n            <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>div</span> <span class=\"token attr-name\" >ng2-file-drop</span>\n                 <span class=\"token attr-name\" >[ng-class]</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>{<span class=\"token punctuation\" >'</span>another-file-over-class<span class=\"token punctuation\" >'</span>: hasAnotherDropZoneOver}<span class=\"token punctuation\" >\"</span></span>\n                 <span class=\"token attr-name\" >(file-over)</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>fileOverAnother($event)<span class=\"token punctuation\" >\"</span></span>\n                 <span class=\"token attr-name\" >[uploader]</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>uploader<span class=\"token punctuation\" >\"</span></span>\n                 <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>well my-drop-zone<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n                Another drop zone\n            <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>div</span><span class=\"token punctuation\" >></span></span>\n\n            Multiple\n            <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>input</span> <span class=\"token attr-name\" >type</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>file<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >ng2-file-select</span> <span class=\"token attr-name\" >[uploader]</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>uploader<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >multiple</span>  <span class=\"token punctuation\" >/></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>br</span><span class=\"token punctuation\" >/></span></span>\n\n            Single\n            <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>input</span> <span class=\"token attr-name\" >type</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>file<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >ng2-file-select</span> <span class=\"token attr-name\" >[uploader]</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>uploader<span class=\"token punctuation\" >\"</span></span> <span class=\"token punctuation\" >/></span></span>\n        <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>div</span><span class=\"token punctuation\" >></span></span>\n\n        <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>div</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>col-md-9<span class=\"token punctuation\" >\"</span></span><span class=\"token style-attr language-css\" ><span class=\"token attr-name\" > <span class=\"token attr-name\" >style</span></span><span class=\"token punctuation\" >=\"</span><span class=\"token attr-value\" ><span class=\"token property\" >margin-bottom</span><span class=\"token punctuation\" >:</span> 40px</span><span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n\n            <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>h3</span><span class=\"token punctuation\" >></span></span>Upload queue<span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>h3</span><span class=\"token punctuation\" >></span></span>\n            <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>p</span><span class=\"token punctuation\" >></span></span>Queue length: {{ uploader.queue.length }}<span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>p</span><span class=\"token punctuation\" >></span></span>\n\n            <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>table</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>table<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n                <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>thead</span><span class=\"token punctuation\" >></span></span>\n                <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>tr</span><span class=\"token punctuation\" >></span></span>\n                    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>th</span> <span class=\"token attr-name\" >width</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>50%<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>Name<span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>th</span><span class=\"token punctuation\" >></span></span>\n                    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>th</span><span class=\"token punctuation\" >></span></span>Size<span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>th</span><span class=\"token punctuation\" >></span></span>\n                    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>th</span><span class=\"token punctuation\" >></span></span>Progress<span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>th</span><span class=\"token punctuation\" >></span></span>\n                    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>th</span><span class=\"token punctuation\" >></span></span>Status<span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>th</span><span class=\"token punctuation\" >></span></span>\n                    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>th</span><span class=\"token punctuation\" >></span></span>Actions<span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>th</span><span class=\"token punctuation\" >></span></span>\n                <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>tr</span><span class=\"token punctuation\" >></span></span>\n                <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>thead</span><span class=\"token punctuation\" >></span></span>\n                <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>tbody</span><span class=\"token punctuation\" >></span></span>\n                <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>tr</span> <span class=\"token attr-name\" >*ng-for</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>#item of uploader.queue<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n                    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>td</span><span class=\"token punctuation\" >></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>strong</span><span class=\"token punctuation\" >></span></span>{{ item.file.name }}<span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>strong</span><span class=\"token punctuation\" >></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>td</span><span class=\"token punctuation\" >></span></span>\n                    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>td</span> <span class=\"token attr-name\" >*ng-if</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>uploader.isHTML5<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >nowrap</span><span class=\"token punctuation\" >></span></span>{{ item.file.size/1024/1024 | number:'.2' }} MB<span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>td</span><span class=\"token punctuation\" >></span></span>\n                    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>td</span> <span class=\"token attr-name\" >*ng-if</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>uploader.isHTML5<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n                        <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>div</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>progress<span class=\"token punctuation\" >\"</span></span><span class=\"token style-attr language-css\" ><span class=\"token attr-name\" > <span class=\"token attr-name\" >style</span></span><span class=\"token punctuation\" >=\"</span><span class=\"token attr-value\" ><span class=\"token property\" >margin-bottom</span><span class=\"token punctuation\" >:</span> 0<span class=\"token punctuation\" >;</span></span><span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n                            <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>div</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>progress-bar<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >role</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>progressbar<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >[ng-style]</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>{ <span class=\"token punctuation\" >'</span>width<span class=\"token punctuation\" >'</span>: item.progress + <span class=\"token punctuation\" >'</span>%<span class=\"token punctuation\" >'</span> }<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>div</span><span class=\"token punctuation\" >></span></span>\n                        <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>div</span><span class=\"token punctuation\" >></span></span>\n                    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>td</span><span class=\"token punctuation\" >></span></span>\n                    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>td</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>text-center<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n                        <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>span</span> <span class=\"token attr-name\" >*ng-if</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>item.isSuccess<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>i</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>glyphicon glyphicon-ok<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>i</span><span class=\"token punctuation\" >></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>span</span><span class=\"token punctuation\" >></span></span>\n                        <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>span</span> <span class=\"token attr-name\" >*ng-if</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>item.isCancel<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>i</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>glyphicon glyphicon-ban-circle<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>i</span><span class=\"token punctuation\" >></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>span</span><span class=\"token punctuation\" >></span></span>\n                        <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>span</span> <span class=\"token attr-name\" >*ng-if</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>item.isError<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>i</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>glyphicon glyphicon-remove<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>i</span><span class=\"token punctuation\" >></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>span</span><span class=\"token punctuation\" >></span></span>\n                    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>td</span><span class=\"token punctuation\" >></span></span>\n                    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>td</span> <span class=\"token attr-name\" >nowrap</span><span class=\"token punctuation\" >></span></span>\n                        <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>button</span> <span class=\"token attr-name\" >type</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>button<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>btn btn-success btn-xs<span class=\"token punctuation\" >\"</span></span>\n                                <span class=\"token attr-name\" >(click)</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>item.upload()<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >[disabled]</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>item.isReady || item.isUploading || item.isSuccess<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n                            <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>span</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>glyphicon glyphicon-upload<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>span</span><span class=\"token punctuation\" >></span></span> Upload\n                        <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>button</span><span class=\"token punctuation\" >></span></span>\n                        <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>button</span> <span class=\"token attr-name\" >type</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>button<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>btn btn-warning btn-xs<span class=\"token punctuation\" >\"</span></span>\n                                <span class=\"token attr-name\" >(click)</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>item.cancel()<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >[disabled]</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>!item.isUploading<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n                            <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>span</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>glyphicon glyphicon-ban-circle<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>span</span><span class=\"token punctuation\" >></span></span> Cancel\n                        <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>button</span><span class=\"token punctuation\" >></span></span>\n                        <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>button</span> <span class=\"token attr-name\" >type</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>button<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>btn btn-danger btn-xs<span class=\"token punctuation\" >\"</span></span>\n                                <span class=\"token attr-name\" >(click)</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>item.remove()<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n                            <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>span</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>glyphicon glyphicon-trash<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>span</span><span class=\"token punctuation\" >></span></span> Remove\n                        <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>button</span><span class=\"token punctuation\" >></span></span>\n                    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>td</span><span class=\"token punctuation\" >></span></span>\n                <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>tr</span><span class=\"token punctuation\" >></span></span>\n                <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>tbody</span><span class=\"token punctuation\" >></span></span>\n            <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>table</span><span class=\"token punctuation\" >></span></span>\n\n            <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>div</span><span class=\"token punctuation\" >></span></span>\n                <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>div</span><span class=\"token punctuation\" >></span></span>\n                    Queue progress:\n                    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>div</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>progress<span class=\"token punctuation\" >\"</span></span><span class=\"token style-attr language-css\" ><span class=\"token attr-name\" > <span class=\"token attr-name\" >style</span></span><span class=\"token punctuation\" >=\"</span><span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n                        <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>div</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>progress-bar<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >role</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>progressbar<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >[ng-style]</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>{ <span class=\"token punctuation\" >'</span>width<span class=\"token punctuation\" >'</span>: uploader.progress + <span class=\"token punctuation\" >'</span>%<span class=\"token punctuation\" >'</span> }<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>div</span><span class=\"token punctuation\" >></span></span>\n                    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>div</span><span class=\"token punctuation\" >></span></span>\n                <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>div</span><span class=\"token punctuation\" >></span></span>\n                <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>button</span> <span class=\"token attr-name\" >type</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>button<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>btn btn-success btn-s<span class=\"token punctuation\" >\"</span></span>\n                        <span class=\"token attr-name\" >(click)</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>uploader.uploadAll()<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >[disabled]</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>!uploader.getNotUploadedItems().length<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n                    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>span</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>glyphicon glyphicon-upload<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>span</span><span class=\"token punctuation\" >></span></span> Upload all\n                <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>button</span><span class=\"token punctuation\" >></span></span>\n                <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>button</span> <span class=\"token attr-name\" >type</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>button<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>btn btn-warning btn-s<span class=\"token punctuation\" >\"</span></span>\n                        <span class=\"token attr-name\" >(click)</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>uploader.cancelAll()<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >[disabled]</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>!uploader.isUploading<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n                    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>span</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>glyphicon glyphicon-ban-circle<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>span</span><span class=\"token punctuation\" >></span></span> Cancel all\n                <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>button</span><span class=\"token punctuation\" >></span></span>\n                <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>button</span> <span class=\"token attr-name\" >type</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>button<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>btn btn-danger btn-s<span class=\"token punctuation\" >\"</span></span>\n                        <span class=\"token attr-name\" >(click)</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>uploader.clearQueue()<span class=\"token punctuation\" >\"</span></span> <span class=\"token attr-name\" >[disabled]</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>!uploader.queue.length<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span>\n                    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;</span>span</span> <span class=\"token attr-name\" >class</span><span class=\"token attr-value\" ><span class=\"token punctuation\" >=</span><span class=\"token punctuation\" >\"</span>glyphicon glyphicon-trash<span class=\"token punctuation\" >\"</span></span><span class=\"token punctuation\" >></span></span><span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>span</span><span class=\"token punctuation\" >></span></span> Remove all\n                <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>button</span><span class=\"token punctuation\" >></span></span>\n            <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>div</span><span class=\"token punctuation\" >></span></span>\n\n        <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>div</span><span class=\"token punctuation\" >></span></span>\n\n    <span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>div</span><span class=\"token punctuation\" >></span></span>\n\n<span class=\"token tag\" ><span class=\"token tag\" ><span class=\"token punctuation\" >&lt;/</span>div</span><span class=\"token punctuation\" >></span></span>"

/***/ },

/***/ 373:
/***/ function(module, exports) {

	module.exports = "<span class=\"token comment\" spellcheck=\"true\">/// &lt;reference path=\"../../../tsd.d.ts\" /></span>\n\n<span class=\"token keyword\" >import</span> <span class=\"token punctuation\" >{</span>\n  Component<span class=\"token punctuation\" >,</span> View<span class=\"token punctuation\" >,</span> EventEmitter<span class=\"token punctuation\" >,</span>\n  CORE_DIRECTIVES<span class=\"token punctuation\" >,</span> FORM_DIRECTIVES<span class=\"token punctuation\" >,</span> NgClass<span class=\"token punctuation\" >,</span> NgStyle\n<span class=\"token punctuation\" >}</span> from <span class=\"token string\" >'angular2/angular2'</span><span class=\"token punctuation\" >;</span>\n\n<span class=\"token keyword\" >import</span> <span class=\"token punctuation\" >{</span>FileSelect<span class=\"token punctuation\" >}</span> from <span class=\"token string\" >'../../../components/file-upload/file-select'</span><span class=\"token punctuation\" >;</span>\n<span class=\"token keyword\" >import</span> <span class=\"token punctuation\" >{</span>FileDrop<span class=\"token punctuation\" >}</span> from <span class=\"token string\" >'../../../components/file-upload/file-drop'</span><span class=\"token punctuation\" >;</span>\n<span class=\"token keyword\" >import</span> <span class=\"token punctuation\" >{</span>FileUploader<span class=\"token punctuation\" >}</span> from <span class=\"token string\" >'../../../components/file-upload/file-uploader'</span><span class=\"token punctuation\" >;</span>\n\n<span class=\"token comment\" spellcheck=\"true\">// webpack html imports</span>\n<span class=\"token keyword\" >let</span> template <span class=\"token operator\" >=</span> <span class=\"token function\" >require</span><span class=\"token punctuation\" >(</span><span class=\"token string\" >'./simple-demo.html'</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n\n<span class=\"token comment\" spellcheck=\"true\">// const URL = '/api/';</span>\n<span class=\"token keyword\" >const</span> URL <span class=\"token operator\" >=</span> <span class=\"token string\" >'https://evening-anchorage-3159.herokuapp.com/api/'</span><span class=\"token punctuation\" >;</span>\n\n@<span class=\"token function\" >Component</span><span class=\"token punctuation\" >(</span><span class=\"token punctuation\" >{</span>\n  selector<span class=\"token punctuation\" >:</span> <span class=\"token string\" >'simple-demo'</span>\n<span class=\"token punctuation\" >}</span><span class=\"token punctuation\" >)</span>\n@<span class=\"token function\" >View</span><span class=\"token punctuation\" >(</span><span class=\"token punctuation\" >{</span>\n  template<span class=\"token punctuation\" >:</span> template<span class=\"token punctuation\" >,</span>\n  directives<span class=\"token punctuation\" >:</span> <span class=\"token punctuation\" >[</span>FileSelect<span class=\"token punctuation\" >,</span> FileDrop<span class=\"token punctuation\" >,</span> NgClass<span class=\"token punctuation\" >,</span> NgStyle<span class=\"token punctuation\" >,</span> CORE_DIRECTIVES<span class=\"token punctuation\" >,</span> FORM_DIRECTIVES<span class=\"token punctuation\" >]</span>\n<span class=\"token punctuation\" >}</span><span class=\"token punctuation\" >)</span>\n<span class=\"token keyword\" >export</span> <span class=\"token keyword\" >class</span> <span class=\"token class-name\" >SimpleDemo</span> <span class=\"token punctuation\" >{</span>\n  <span class=\"token keyword\" >private</span> uploader<span class=\"token punctuation\" >:</span>FileUploader <span class=\"token operator\" >=</span> <span class=\"token keyword\" >new</span> <span class=\"token class-name\" >FileUploader</span><span class=\"token punctuation\" >(</span><span class=\"token punctuation\" >{</span>url<span class=\"token punctuation\" >:</span> URL<span class=\"token punctuation\" >}</span><span class=\"token punctuation\" >)</span><span class=\"token punctuation\" >;</span>\n  <span class=\"token keyword\" >private</span> hasBaseDropZoneOver<span class=\"token punctuation\" >:</span><span class=\"token keyword\" >boolean</span> <span class=\"token operator\" >=</span> <span class=\"token keyword\" >false</span><span class=\"token punctuation\" >;</span>\n  <span class=\"token keyword\" >private</span> hasAnotherDropZoneOver<span class=\"token punctuation\" >:</span><span class=\"token keyword\" >boolean</span> <span class=\"token operator\" >=</span> <span class=\"token keyword\" >false</span><span class=\"token punctuation\" >;</span>\n\n  <span class=\"token keyword\" >private</span> <span class=\"token function\" >fileOverBase</span><span class=\"token punctuation\" >(</span>e<span class=\"token punctuation\" >:</span><span class=\"token keyword\" >any</span><span class=\"token punctuation\" >)</span> <span class=\"token punctuation\" >{</span>\n    <span class=\"token keyword\" >this</span><span class=\"token punctuation\" >.</span>hasBaseDropZoneOver <span class=\"token operator\" >=</span> e<span class=\"token punctuation\" >;</span>\n  <span class=\"token punctuation\" >}</span>\n\n  <span class=\"token keyword\" >private</span> <span class=\"token function\" >fileOverAnother</span><span class=\"token punctuation\" >(</span>e<span class=\"token punctuation\" >:</span><span class=\"token keyword\" >any</span><span class=\"token punctuation\" >)</span> <span class=\"token punctuation\" >{</span>\n    <span class=\"token keyword\" >this</span><span class=\"token punctuation\" >.</span>hasAnotherDropZoneOver <span class=\"token operator\" >=</span> e<span class=\"token punctuation\" >;</span>\n  <span class=\"token punctuation\" >}</span>\n<span class=\"token punctuation\" >}</span>\n"

/***/ },

/***/ 374:
/***/ function(module, exports) {

	module.exports = "<style>\n    .my-drop-zone { border: dotted 3px lightgray; }\n    .nv-file-over { border: dotted 3px red; } /* Default class applied to drop zones on over */\n    .another-file-over-class { border: dotted 3px green; }\n\n    html, body { height: 100%; }\n</style>\n\n<div class=\"container\">\n\n    <div class=\"navbar navbar-default\">\n        <div class=\"navbar-header\">\n            <a class=\"navbar-brand\" href>Angular2 File Upload</a>\n        </div>\n    </div>\n\n    <div class=\"row\">\n\n        <div class=\"col-md-3\">\n\n            <h3>Select files</h3>\n\n            <div ng2-file-drop\n                 [ng-class]=\"{'nv-file-over': hasBaseDropZoneOver}\"\n                 (file-over)=\"fileOverBase($event)\"\n                 [uploader]=\"uploader\"\n                 class=\"well my-drop-zone\">\n                Base drop zone\n            </div>\n\n            <div ng2-file-drop\n                 [ng-class]=\"{'another-file-over-class': hasAnotherDropZoneOver}\"\n                 (file-over)=\"fileOverAnother($event)\"\n                 [uploader]=\"uploader\"\n                 class=\"well my-drop-zone\">\n                Another drop zone\n            </div>\n\n            Multiple\n            <input type=\"file\" ng2-file-select [uploader]=\"uploader\" multiple  /><br/>\n\n            Single\n            <input type=\"file\" ng2-file-select [uploader]=\"uploader\" />\n        </div>\n\n        <div class=\"col-md-9\" style=\"margin-bottom: 40px\">\n\n            <h3>Upload queue</h3>\n            <p>Queue length: {{ uploader.queue.length }}</p>\n\n            <table class=\"table\">\n                <thead>\n                <tr>\n                    <th width=\"50%\">Name</th>\n                    <th>Size</th>\n                    <th>Progress</th>\n                    <th>Status</th>\n                    <th>Actions</th>\n                </tr>\n                </thead>\n                <tbody>\n                <tr *ng-for=\"#item of uploader.queue\">\n                    <td><strong>{{ item.file.name }}</strong></td>\n                    <td *ng-if=\"uploader.isHTML5\" nowrap>{{ item.file.size/1024/1024 | number:'.2' }} MB</td>\n                    <td *ng-if=\"uploader.isHTML5\">\n                        <div class=\"progress\" style=\"margin-bottom: 0;\">\n                            <div class=\"progress-bar\" role=\"progressbar\" [ng-style]=\"{ 'width': item.progress + '%' }\"></div>\n                        </div>\n                    </td>\n                    <td class=\"text-center\">\n                        <span *ng-if=\"item.isSuccess\"><i class=\"glyphicon glyphicon-ok\"></i></span>\n                        <span *ng-if=\"item.isCancel\"><i class=\"glyphicon glyphicon-ban-circle\"></i></span>\n                        <span *ng-if=\"item.isError\"><i class=\"glyphicon glyphicon-remove\"></i></span>\n                    </td>\n                    <td nowrap>\n                        <button type=\"button\" class=\"btn btn-success btn-xs\"\n                                (click)=\"item.upload()\" [disabled]=\"item.isReady || item.isUploading || item.isSuccess\">\n                            <span class=\"glyphicon glyphicon-upload\"></span> Upload\n                        </button>\n                        <button type=\"button\" class=\"btn btn-warning btn-xs\"\n                                (click)=\"item.cancel()\" [disabled]=\"!item.isUploading\">\n                            <span class=\"glyphicon glyphicon-ban-circle\"></span> Cancel\n                        </button>\n                        <button type=\"button\" class=\"btn btn-danger btn-xs\"\n                                (click)=\"item.remove()\">\n                            <span class=\"glyphicon glyphicon-trash\"></span> Remove\n                        </button>\n                    </td>\n                </tr>\n                </tbody>\n            </table>\n\n            <div>\n                <div>\n                    Queue progress:\n                    <div class=\"progress\" style=\"\">\n                        <div class=\"progress-bar\" role=\"progressbar\" [ng-style]=\"{ 'width': uploader.progress + '%' }\"></div>\n                    </div>\n                </div>\n                <button type=\"button\" class=\"btn btn-success btn-s\"\n                        (click)=\"uploader.uploadAll()\" [disabled]=\"!uploader.getNotUploadedItems().length\">\n                    <span class=\"glyphicon glyphicon-upload\"></span> Upload all\n                </button>\n                <button type=\"button\" class=\"btn btn-warning btn-s\"\n                        (click)=\"uploader.cancelAll()\" [disabled]=\"!uploader.isUploading\">\n                    <span class=\"glyphicon glyphicon-ban-circle\"></span> Cancel all\n                </button>\n                <button type=\"button\" class=\"btn btn-danger btn-s\"\n                        (click)=\"uploader.clearQueue()\" [disabled]=\"!uploader.queue.length\">\n                    <span class=\"glyphicon glyphicon-trash\"></span> Remove all\n                </button>\n            </div>\n\n        </div>\n\n    </div>\n\n</div>"

/***/ },

/***/ 376:
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
	var ng2_bootstrap_1 = __webpack_require__(392);
	var simple_demo_1 = __webpack_require__(377);
	var name = 'File Upload';
	var doc = __webpack_require__(369);
	var tabDesc = [
	    {
	        heading: 'Simple',
	        ts: __webpack_require__(373),
	        html: __webpack_require__(372),
	        js: __webpack_require__(371)
	    }
	];
	var tabsContent = "";
	tabDesc.forEach(function (desc) {
	    tabsContent += "\n          <tab heading=\"" + desc.heading + "\" (select)=\"select($event)\">\n          <div class=\"card card-block panel panel-default panel-body\">\n\n            <" + desc.heading.toLowerCase() + "-demo *ng-if=\"currentHeading === '" + desc.heading + "'\"></" + desc.heading.toLowerCase() + "-demo>\n\n            <br>\n\n            <div class=\"row\" style=\"margin: 0px;\">\n              <tabset>\n                <tab heading=\"Markup\">\n                  <div class=\"card card-block panel panel-default panel-body\">\n                    <pre class=\"language-html\"><code class=\"language-html\" ng-non-bindable>" + desc.html + "</code></pre>\n                  </div>\n                </tab>\n                <tab heading=\"TypeScript\">\n                  <div class=\"card card-block panel panel-default panel-body\">\n                    <pre class=\"language-typescript\"><code class=\"language-typescript\" ng-non-bindable>" + desc.ts + "</code></pre>\n                  </div>\n                </tab>\n                <tab heading=\"Backend Demo\">\n                  <div class=\"card card-block panel panel-default panel-body\">\n                    <pre class=\"language-javascript\"><code class=\"language-javascript\" ng-non-bindable>" + desc.js + "</code></pre>\n                  </div>\n                </tab>\n              </tabset>\n            </div>\n          </div>\n        </tab>\n  ";
	});
	var FileUploadSection = (function () {
	    function FileUploadSection() {
	        this.currentHeading = 'Simple';
	    }
	    FileUploadSection.prototype.select = function (e) {
	        if (e.heading) {
	            this.currentHeading = e.heading;
	        }
	    };
	    FileUploadSection = __decorate([
	        angular2_1.Component({
	            selector: 'file-upload-section'
	        }),
	        angular2_1.View({
	            template: "\n  <section id=\"" + name.toLowerCase() + "\">\n    <div class=\"row\">\n      <tabset>\n\n        " + tabsContent + "\n\n      </tabset>\n    </div>\n\n    <div class=\"row\">\n      <h2>API</h2>\n      <div class=\"card card-block panel panel-default panel-body\">" + doc + "</div>\n    </div>\n  </section>\n  ",
	            directives: [simple_demo_1.SimpleDemo, ng2_bootstrap_1.tabs, angular2_1.CORE_DIRECTIVES]
	        }), 
	        __metadata('design:paramtypes', [])
	    ], FileUploadSection);
	    return FileUploadSection;
	})();
	exports.FileUploadSection = FileUploadSection;


/***/ },

/***/ 377:
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
	var file_select_1 = __webpack_require__(127);
	var file_drop_1 = __webpack_require__(125);
	var file_uploader_1 = __webpack_require__(128);
	var template = __webpack_require__(374);
	var URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
	var SimpleDemo = (function () {
	    function SimpleDemo() {
	        this.uploader = new file_uploader_1.FileUploader({ url: URL });
	        this.hasBaseDropZoneOver = false;
	        this.hasAnotherDropZoneOver = false;
	    }
	    SimpleDemo.prototype.fileOverBase = function (e) {
	        this.hasBaseDropZoneOver = e;
	    };
	    SimpleDemo.prototype.fileOverAnother = function (e) {
	        this.hasAnotherDropZoneOver = e;
	    };
	    SimpleDemo = __decorate([
	        angular2_1.Component({
	            selector: 'simple-demo'
	        }),
	        angular2_1.View({
	            template: template,
	            directives: [file_select_1.FileSelect, file_drop_1.FileDrop, angular2_1.NgClass, angular2_1.NgStyle, angular2_1.CORE_DIRECTIVES, angular2_1.FORM_DIRECTIVES]
	        }), 
	        __metadata('design:paramtypes', [])
	    ], SimpleDemo);
	    return SimpleDemo;
	})();
	exports.SimpleDemo = SimpleDemo;


/***/ },

/***/ 379:
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
	var __param = (this && this.__param) || function (paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	};
	var angular2_1 = __webpack_require__(8);
	var Accordion = (function () {
	    function Accordion() {
	        this.groups = [];
	    }
	    Accordion.prototype.closeOtherGroups = function (openGroup) {
	        if (!this.closeOthers) {
	            return;
	        }
	        this.groups.forEach(function (group) {
	            if (group !== openGroup) {
	                group.isOpen = false;
	            }
	        });
	    };
	    Accordion.prototype.addGroup = function (group) {
	        this.groups.push(group);
	    };
	    Accordion.prototype.removeGroup = function (group) {
	        var index = this.groups.indexOf(group);
	        if (index !== -1) {
	            this.groups.slice(index, 1);
	        }
	    };
	    Accordion = __decorate([
	        angular2_1.Component({
	            selector: 'accordion, [accordion]',
	            properties: ['templateUrl', 'closeOthers'],
	            host: {
	                '[class.panel-group]': 'true'
	            }
	        }),
	        angular2_1.View({
	            template: "<ng-content></ng-content>"
	        }), 
	        __metadata('design:paramtypes', [])
	    ], Accordion);
	    return Accordion;
	})();
	exports.Accordion = Accordion;
	var AccordionTransclude = (function () {
	    function AccordionTransclude(viewRef) {
	        this.viewRef = viewRef;
	    }
	    AccordionTransclude.prototype.onInit = function () {
	        if (this.accordionTransclude) {
	            this.viewRef.createEmbeddedView(this.accordionTransclude);
	        }
	    };
	    AccordionTransclude = __decorate([
	        angular2_1.Directive({
	            selector: 'accordion-transclude, [accordion-transclude]',
	            properties: ['accordionTransclude']
	        }),
	        __param(0, angular2_1.Inject(angular2_1.ViewContainerRef)), 
	        __metadata('design:paramtypes', [angular2_1.ViewContainerRef])
	    ], AccordionTransclude);
	    return AccordionTransclude;
	})();
	exports.AccordionTransclude = AccordionTransclude;
	var collapse_1 = __webpack_require__(208);
	var AccordionGroup = (function () {
	    function AccordionGroup(accordion) {
	        this.accordion = accordion;
	    }
	    AccordionGroup.prototype.onInit = function () {
	        this.panelClass = this.panelClass || 'panel-default';
	        this.accordion.addGroup(this);
	    };
	    AccordionGroup.prototype.onDestroy = function () {
	        this.accordion.removeGroup(this);
	    };
	    AccordionGroup.prototype.toggleOpen = function (event) {
	        event.preventDefault();
	        if (!this.isDisabled) {
	            this.isOpen = !this.isOpen;
	        }
	    };
	    Object.defineProperty(AccordionGroup.prototype, "isOpen", {
	        get: function () {
	            return this._isOpen;
	        },
	        set: function (value) {
	            this._isOpen = value;
	            if (value) {
	                this.accordion.closeOtherGroups(this);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    AccordionGroup = __decorate([
	        angular2_1.Component({
	            selector: 'accordion-group, [accordion-group]',
	            properties: ['templateUrl', 'heading', 'isOpen', 'isDisabled', 'panelClass'],
	            host: {
	                '[class.panel-open]': 'isOpen'
	            }
	        }),
	        angular2_1.View({
	            template: "\n  <div class=\"panel\" [ng-class]=\"panelClass\">\n    <div class=\"panel-heading\" (click)=\"toggleOpen($event)\">\n      <h4 class=\"panel-title\">\n        <a href tabindex=\"0\" class=\"accordion-toggle\">\n          <span [ng-class]=\"{'text-muted': isDisabled}\"\n            [accordion-transclude]=\"headingTemplate\">{{heading}}</span>\n        </a>\n      </h4>\n    </div>\n    <div class=\"panel-collapse collapse\" [collapse]=\"!isOpen\">\n      <div class=\"panel-body\">\n        <ng-content></ng-content>\n      </div>\n    </div>\n  </div>\n  ",
	            directives: [collapse_1.Collapse, AccordionTransclude, angular2_1.NgClass]
	        }), 
	        __metadata('design:paramtypes', [Accordion])
	    ], AccordionGroup);
	    return AccordionGroup;
	})();
	exports.AccordionGroup = AccordionGroup;
	var AccordionHeading = (function () {
	    function AccordionHeading(group, templateRef) {
	        this.group = group;
	        this.templateRef = templateRef;
	        group.headingTemplate = templateRef;
	    }
	    AccordionHeading = __decorate([
	        angular2_1.Directive({
	            selector: 'accordion-heading, [accordion-heading]'
	        }), 
	        __metadata('design:paramtypes', [AccordionGroup, angular2_1.TemplateRef])
	    ], AccordionHeading);
	    return AccordionHeading;
	})();
	exports.AccordionHeading = AccordionHeading;
	exports.accordion = [Accordion, AccordionGroup, AccordionHeading];


/***/ },

/***/ 380:
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
	var Alert = (function () {
	    function Alert(el) {
	        this.el = el;
	        this.close = new angular2_1.EventEmitter();
	        this.classes = [];
	        this.closeable = this.closeable || el.nativeElement.getAttribute('(close)');
	    }
	    Object.defineProperty(Alert.prototype, "dismissible", {
	        get: function () {
	            return this.closeable;
	        },
	        set: function (v) {
	            this.closeable = v;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Alert.prototype.onInit = function () {
	        this.type = this.type || 'warning';
	        this.classes[0] = 'alert-' + (this.type || 'warning');
	        if (this.closeable) {
	            this.classes[1] = 'alert-dismissible';
	        }
	        else {
	            this.classes.length = 1;
	        }
	        if (this.dismissOnTimeout) {
	            var close_1 = this.onClose.bind(this);
	            setTimeout(close_1, this.dismissOnTimeout);
	        }
	    };
	    Alert.prototype.onClose = function () {
	        this.close.next(this);
	        this.closed = true;
	    };
	    Alert = __decorate([
	        angular2_1.Component({
	            selector: 'alert',
	            inputs: ['type', 'dismissible', 'dismissOnTimeout'],
	            outputs: ['close']
	        }),
	        angular2_1.View({
	            template: "\n  <div class=\"alert\" role=\"alert\" [ng-class]=\"classes\" *ng-if=\"!closed\">\n    <button *ng-if=\"closeable\" type=\"button\" class=\"close\" (click)=\"onClose($event)\">\n      <span aria-hidden=\"true\">&times;</span>\n      <span class=\"sr-only\">Close</span>\n    </button>\n    <ng-content></ng-content>\n  </div>\n  ",
	            directives: [angular2_1.NgIf, angular2_1.NgClass]
	        }), 
	        __metadata('design:paramtypes', [angular2_1.ElementRef])
	    ], Alert);
	    return Alert;
	})();
	exports.Alert = Alert;


/***/ },

/***/ 381:
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
	var __param = (this && this.__param) || function (paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	};
	var angular2_1 = __webpack_require__(8);
	var ButtonCheckbox = (function () {
	    function ButtonCheckbox(cd) {
	        this.cd = cd;
	        this.state = false;
	        this.onChange = function (_) { };
	        this.onTouched = function () { };
	        cd.valueAccessor = this;
	    }
	    ButtonCheckbox.prototype.onInit = function () {
	        this.toggle(this.trueValue === this.value);
	    };
	    Object.defineProperty(ButtonCheckbox.prototype, "trueValue", {
	        get: function () {
	            return typeof this.btnCheckboxTrue !== 'undefined' ? this.btnCheckboxTrue : true;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ButtonCheckbox.prototype, "falseValue", {
	        get: function () {
	            return typeof this.btnCheckboxFalse !== 'undefined' ? this.btnCheckboxFalse : false;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ButtonCheckbox.prototype.toggle = function (state) {
	        this.state = state;
	        this.value = this.state ? this.trueValue : this.falseValue;
	    };
	    ButtonCheckbox.prototype.onClick = function () {
	        this.toggle(!this.state);
	        this.cd.viewToModelUpdate(this.value);
	    };
	    ButtonCheckbox.prototype.writeValue = function (value) {
	        this.state = this.trueValue === value;
	        this.value = value;
	    };
	    ButtonCheckbox.prototype.registerOnChange = function (fn) {
	        this.onChange = fn;
	    };
	    ButtonCheckbox.prototype.registerOnTouched = function (fn) {
	        this.onTouched = fn;
	    };
	    ButtonCheckbox = __decorate([
	        angular2_1.Directive({
	            selector: '[btn-checkbox][ng-model]',
	            properties: ['btnCheckboxTrue', 'btnCheckboxFalse'],
	            host: {
	                '(click)': 'onClick()',
	                '[class.active]': 'state'
	            }
	        }),
	        __param(0, angular2_1.Self()), 
	        __metadata('design:paramtypes', [angular2_1.NgModel])
	    ], ButtonCheckbox);
	    return ButtonCheckbox;
	})();
	exports.ButtonCheckbox = ButtonCheckbox;


/***/ },

/***/ 382:
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
	var __param = (this && this.__param) || function (paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	};
	var angular2_1 = __webpack_require__(8);
	var ButtonRadio = (function () {
	    function ButtonRadio(cd, el) {
	        this.cd = cd;
	        this.el = el;
	        this.onChange = function (_) { };
	        this.onTouched = function () { };
	        cd.valueAccessor = this;
	    }
	    ButtonRadio.prototype.onInit = function () {
	        this.uncheckable = typeof this.uncheckable !== 'undefined';
	    };
	    Object.defineProperty(ButtonRadio.prototype, "isActive", {
	        get: function () {
	            return this.btnRadio === this.value;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(ButtonRadio.prototype, "value", {
	        get: function () {
	            return this.cd.viewModel;
	        },
	        set: function (value) {
	            this.cd.viewModel = value;
	            if (this.isActive) {
	                this.el.nativeElement.classList.add('active');
	            }
	            else {
	                this.el.nativeElement.classList.remove('active');
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    ButtonRadio.prototype.onClick = function () {
	        if (this.uncheckable && this.btnRadio === this.value) {
	            return this.cd.viewToModelUpdate(null);
	        }
	        this.cd.viewToModelUpdate(this.btnRadio);
	    };
	    ButtonRadio.prototype.writeValue = function (value) {
	        this.value = value;
	    };
	    ButtonRadio.prototype.registerOnChange = function (fn) {
	        this.onChange = fn;
	    };
	    ButtonRadio.prototype.registerOnTouched = function (fn) {
	        this.onTouched = fn;
	    };
	    ButtonRadio = __decorate([
	        angular2_1.Directive({
	            selector: '[btn-radio][ng-model]',
	            properties: ['btnRadio', 'uncheckable'],
	            host: {
	                '(click)': 'onClick()',
	                '[class.active]': 'isActive'
	            }
	        }),
	        __param(0, angular2_1.Self()), 
	        __metadata('design:paramtypes', [angular2_1.NgModel, angular2_1.ElementRef])
	    ], ButtonRadio);
	    return ButtonRadio;
	})();
	exports.ButtonRadio = ButtonRadio;


/***/ },

/***/ 383:
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
	var ng2_bootstrap_config_1 = __webpack_require__(129);
	(function (Direction) {
	    Direction[Direction["UNKNOWN"] = 0] = "UNKNOWN";
	    Direction[Direction["NEXT"] = 1] = "NEXT";
	    Direction[Direction["PREV"] = 2] = "PREV";
	})(exports.Direction || (exports.Direction = {}));
	var Direction = exports.Direction;
	var NAVIGATION = (_a = {},
	    _a[ng2_bootstrap_config_1.Ng2BootstrapTheme.BS4] = "\n<a class=\"left carousel-control\" (click)=\"prev()\" [hidden]=\"!slides.length\">\n  <span class=\"icon-prev\" aria-hidden=\"true\"></span>\n  <span class=\"sr-only\">Previous</span>\n</a>\n<a class=\"right carousel-control\" (click)=\"next()\" [hidden]=\"!slides.length\">\n  <span class=\"icon-next\" aria-hidden=\"true\"></span>\n  <span class=\"sr-only\">Next</span>\n</a>\n  ",
	    _a[ng2_bootstrap_config_1.Ng2BootstrapTheme.BS3] = "\n<a class=\"left carousel-control\" (click)=\"prev()\" [hidden]=\"!slides.length\">\n  <span class=\"glyphicon glyphicon-chevron-left\"></span>\n</a>\n<a class=\"right carousel-control\" (click)=\"next()\" [hidden]=\"!slides.length\">\n  <span class=\"glyphicon glyphicon-chevron-right\"></span>\n</a>\n  ",
	    _a
	);
	var Carousel = (function () {
	    function Carousel() {
	        this.slides = [];
	        this.destroyed = false;
	    }
	    Carousel.prototype.onDestroy = function () {
	        this.destroyed = true;
	    };
	    Object.defineProperty(Carousel.prototype, "interval", {
	        get: function () {
	            return this._interval;
	        },
	        set: function (value) {
	            this._interval = value;
	            this.restartTimer();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Carousel.prototype.select = function (nextSlide, direction) {
	        if (direction === void 0) { direction = Direction.UNKNOWN; }
	        var nextIndex = nextSlide.index;
	        if (direction === Direction.UNKNOWN) {
	            direction = nextIndex > this.getCurrentIndex() ? Direction.NEXT : Direction.PREV;
	        }
	        if (nextSlide && nextSlide !== this.currentSlide) {
	            this.goNext(nextSlide, direction);
	        }
	    };
	    Carousel.prototype.goNext = function (slide, direction) {
	        if (this.destroyed) {
	            return;
	        }
	        slide.direction = direction;
	        slide.active = true;
	        if (this.currentSlide) {
	            this.currentSlide.direction = direction;
	            this.currentSlide.active = false;
	        }
	        this.currentSlide = slide;
	        this.restartTimer();
	    };
	    Carousel.prototype.getSlideByIndex = function (index) {
	        var len = this.slides.length;
	        for (var i = 0; i < len; ++i) {
	            if (this.slides[i].index === index) {
	                return this.slides[i];
	            }
	        }
	    };
	    Carousel.prototype.getCurrentIndex = function () {
	        return !this.currentSlide ? 0 : this.currentSlide.index;
	    };
	    Carousel.prototype.next = function () {
	        var newIndex = (this.getCurrentIndex() + 1) % this.slides.length;
	        if (newIndex === 0 && this.noWrap) {
	            this.pause();
	            return;
	        }
	        return this.select(this.getSlideByIndex(newIndex), Direction.NEXT);
	    };
	    Carousel.prototype.prev = function () {
	        var newIndex = this.getCurrentIndex() - 1 < 0 ? this.slides.length - 1 : this.getCurrentIndex() - 1;
	        if (this.noWrap && newIndex === this.slides.length - 1) {
	            this.pause();
	            return;
	        }
	        return this.select(this.getSlideByIndex(newIndex), Direction.PREV);
	    };
	    Carousel.prototype.restartTimer = function () {
	        var _this = this;
	        this.resetTimer();
	        var interval = +this.interval;
	        if (!isNaN(interval) && interval > 0) {
	            this.currentInterval = setInterval(function () {
	                var nInterval = +_this.interval;
	                if (_this.isPlaying && !isNaN(_this.interval) && nInterval > 0 && _this.slides.length) {
	                    _this.next();
	                }
	                else {
	                    _this.pause();
	                }
	            }, interval);
	        }
	    };
	    Carousel.prototype.resetTimer = function () {
	        if (this.currentInterval) {
	            clearInterval(this.currentInterval);
	            this.currentInterval = null;
	        }
	    };
	    Carousel.prototype.play = function () {
	        if (!this.isPlaying) {
	            this.isPlaying = true;
	            this.restartTimer();
	        }
	    };
	    Carousel.prototype.pause = function () {
	        if (!this.noPause) {
	            this.isPlaying = false;
	            this.resetTimer();
	        }
	    };
	    Carousel.prototype.addSlide = function (slide) {
	        slide.index = this.slides.length;
	        this.slides.push(slide);
	        if (this.slides.length === 1 || slide.active) {
	            this.select(this.slides[this.slides.length - 1]);
	            if (this.slides.length === 1) {
	                this.play();
	            }
	        }
	        else {
	            slide.active = false;
	        }
	    };
	    Carousel.prototype.removeSlide = function (slide) {
	        this.slides.splice(slide.index, 1);
	        if (this.slides.length === 0) {
	            this.currentSlide = null;
	            return;
	        }
	        for (var i = 0; i < this.slides.length; i++) {
	            this.slides[i].index = i;
	        }
	    };
	    Carousel = __decorate([
	        angular2_1.Component({
	            selector: 'carousel, [carousel]',
	            properties: ['interval', 'noTransition', 'noPause', 'noWrap']
	        }),
	        angular2_1.View({
	            template: "\n<div (mouseenter)=\"pause()\" (mouseleave)=\"play()\" class=\"carousel slide\">\n  <ol class=\"carousel-indicators\" [hidden]=\"slides.length <= 1\">\n     <li *ng-for=\"#slidez of slides\" [ng-class]=\"{active: slidez.active === true}\" (click)=\"select(slidez)\"></li>\n  </ol>\n  <div class=\"carousel-inner\"><ng-content></ng-content></div>\n  " + NAVIGATION[ng2_bootstrap_config_1.Ng2BootstrapConfig.theme] + "\n</div>\n  ",
	            directives: [angular2_1.CORE_DIRECTIVES, angular2_1.NgClass]
	        }), 
	        __metadata('design:paramtypes', [])
	    ], Carousel);
	    return Carousel;
	})();
	exports.Carousel = Carousel;
	var Slide = (function () {
	    function Slide(carousel) {
	        this.carousel = carousel;
	    }
	    Slide.prototype.onInit = function () {
	        this.carousel.addSlide(this);
	    };
	    Slide.prototype.onDestroy = function () {
	        this.carousel.removeSlide(this);
	    };
	    Slide = __decorate([
	        angular2_1.Component({
	            selector: 'slide, [slide]',
	            properties: ['direction', 'active', 'index'],
	            host: {
	                '[class.active]': 'active',
	                '[class.item]': 'true',
	                '[class.carousel-item]': 'true'
	            }
	        }),
	        angular2_1.View({
	            template: "\n  <div [ng-class]=\"{active: active}\" class=\"item text-center\">\n    <ng-content></ng-content>\n  </div>\n  ",
	            directives: [angular2_1.NgClass]
	        }), 
	        __metadata('design:paramtypes', [Carousel])
	    ], Slide);
	    return Slide;
	})();
	exports.Slide = Slide;
	exports.carousel = [Carousel, Slide];
	var _a;


/***/ },

/***/ 384:
/***/ function(module, exports, __webpack_require__) {

	var dropdown_1 = __webpack_require__(76);
	var dropdown_menu_1 = __webpack_require__(210);
	var dropdown_toggle_1 = __webpack_require__(212);
	exports.dropdown = [dropdown_1.Dropdown, dropdown_menu_1.DropdownMenu, dropdown_toggle_1.DropdownToggle];


/***/ },

/***/ 385:
/***/ function(module, exports, __webpack_require__) {

	var __extends = (this && this.__extends) || function (d, b) {
	    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
	    function __() { this.constructor = d; }
	    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	};
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var __param = (this && this.__param) || function (paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	};
	var angular2_1 = __webpack_require__(8);
	var paginationConfig = {
	    maxSize: void 0,
	    itemsPerPage: 10,
	    boundaryLinks: false,
	    directionLinks: true,
	    firstText: 'First',
	    previousText: 'Previous',
	    nextText: 'Next',
	    lastText: 'Last',
	    rotate: true
	};
	var Pagination = (function () {
	    function Pagination(cd, renderer, elementRef) {
	        this.cd = cd;
	        this.renderer = renderer;
	        this.elementRef = elementRef;
	        this.numPages = new angular2_1.EventEmitter();
	        this.pageChanged = new angular2_1.EventEmitter();
	        this.inited = false;
	        this.onChange = function (_) { };
	        this.onTouched = function () { };
	        cd.valueAccessor = this;
	        this.config = this.config || paginationConfig;
	    }
	    Object.defineProperty(Pagination.prototype, "itemsPerPage", {
	        get: function () {
	            return this._itemsPerPage;
	        },
	        set: function (v) {
	            this._itemsPerPage = v;
	            this.totalPages = this.calculateTotalPages();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Pagination.prototype, "totalItems", {
	        get: function () {
	            return this._totalItems;
	        },
	        set: function (v) {
	            this._totalItems = v;
	            this.totalPages = this.calculateTotalPages();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Pagination.prototype, "totalPages", {
	        get: function () {
	            return this._totalPages;
	        },
	        set: function (v) {
	            this._totalPages = v;
	            this.numPages.next(v);
	            if (this.inited) {
	                this.selectPage(this.page);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Pagination.prototype, "page", {
	        get: function () {
	            return this._page;
	        },
	        set: function (value) {
	            this._page = (value > this.totalPages) ? this.totalPages : (value || 1);
	            this.pageChanged.next({
	                page: this._page,
	                itemsPerPage: this.itemsPerPage
	            });
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Pagination.prototype.onInit = function () {
	        this.classMap = this.elementRef.nativeElement.getAttribute('class') || '';
	        this.maxSize = typeof this.maxSize !== 'undefined' ? this.maxSize : paginationConfig.maxSize;
	        this.rotate = typeof this.rotate !== 'undefined' ? this.rotate : paginationConfig.rotate;
	        this.boundaryLinks = typeof this.boundaryLinks !== 'undefined' ? this.boundaryLinks : paginationConfig.boundaryLinks;
	        this.directionLinks = typeof this.directionLinks !== 'undefined' ? this.directionLinks : paginationConfig.directionLinks;
	        this.itemsPerPage = typeof this.itemsPerPage !== 'undefined' ? this.itemsPerPage : paginationConfig.itemsPerPage;
	        this.totalPages = this.calculateTotalPages();
	        this.pages = this.getPages(this.page, this.totalPages);
	        this.page = this.cd.value;
	        this.inited = true;
	    };
	    Pagination.prototype.writeValue = function (value) {
	        this.page = value;
	        this.pages = this.getPages(this.page, this.totalPages);
	    };
	    Pagination.prototype.selectPage = function (page, event) {
	        if (event) {
	            event.preventDefault();
	        }
	        if (!this.disabled) {
	            if (event && event.target) {
	                var target = event.target;
	                target.blur();
	            }
	            this.writeValue(page);
	            this.cd.viewToModelUpdate(this.page);
	        }
	    };
	    Pagination.prototype.getText = function (key) {
	        return this[key + 'Text'] || paginationConfig[key + 'Text'];
	    };
	    Pagination.prototype.noPrevious = function () {
	        return this.page === 1;
	    };
	    Pagination.prototype.noNext = function () {
	        return this.page === this.totalPages;
	    };
	    Pagination.prototype.makePage = function (number, text, isActive) {
	        return {
	            number: number,
	            text: text,
	            active: isActive
	        };
	    };
	    Pagination.prototype.getPages = function (currentPage, totalPages) {
	        var pages = [];
	        var startPage = 1;
	        var endPage = totalPages;
	        var isMaxSized = typeof this.maxSize !== 'undefined' && this.maxSize < totalPages;
	        if (isMaxSized) {
	            if (this.rotate) {
	                startPage = Math.max(currentPage - Math.floor(this.maxSize / 2), 1);
	                endPage = startPage + this.maxSize - 1;
	                if (endPage > totalPages) {
	                    endPage = totalPages;
	                    startPage = endPage - this.maxSize + 1;
	                }
	            }
	            else {
	                startPage = ((Math.ceil(currentPage / this.maxSize) - 1) * this.maxSize) + 1;
	                endPage = Math.min(startPage + this.maxSize - 1, totalPages);
	            }
	        }
	        for (var number = startPage; number <= endPage; number++) {
	            var page = this.makePage(number, number.toString(), number === currentPage);
	            pages.push(page);
	        }
	        if (isMaxSized && !this.rotate) {
	            if (startPage > 1) {
	                var previousPageSet = this.makePage(startPage - 1, '...', false);
	                pages.unshift(previousPageSet);
	            }
	            if (endPage < totalPages) {
	                var nextPageSet = this.makePage(endPage + 1, '...', false);
	                pages.push(nextPageSet);
	            }
	        }
	        return pages;
	    };
	    Pagination.prototype.calculateTotalPages = function () {
	        var totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil(this.totalItems / this.itemsPerPage);
	        return Math.max(totalPages || 0, 1);
	    };
	    Pagination.prototype.registerOnChange = function (fn) {
	        this.onChange = fn;
	    };
	    Pagination.prototype.registerOnTouched = function (fn) {
	        this.onTouched = fn;
	    };
	    Pagination = __decorate([
	        angular2_1.Component({
	            selector: 'pagination[ng-model], [pagination][ng-model]',
	            properties: [
	                'rotate', 'disabled',
	                'totalItems', 'itemsPerPage', 'maxSize',
	                'boundaryLinks', 'directionLinks',
	                'firstText', 'previousText', 'nextText', 'lastText'
	            ],
	            events: ['numPages', 'pageChanged']
	        }),
	        angular2_1.View({
	            template: "\n  <ul class=\"pagination\" [ng-class]=\"classMap\">\n    <li class=\"pagination-first\"\n        [ng-class]=\"{disabled: noPrevious()||disabled, hidden: !boundaryLinks}\"\n        [hidden]=\"!boundaryLinks\">\n      <a href (click)=\"selectPage(1, $event)\">{{getText('first')}}</a>\n    </li>\n\n    <li class=\"pagination-prev\"\n        [ng-class]=\"{disabled: noPrevious()||disabled, hidden: !directionLinks}\"\n        [hidden]=\"!directionLinks\">\n      <a href (click)=\"selectPage(page - 1, $event)\">{{getText('previous')}}</a>\n      </li>\n\n    <li *ng-for=\"#pg of pages\"\n    [ng-class]=\"{active: pg.active, disabled: disabled&&!pg.active}\"\n    class=\"pagination-page\">\n      <a href (click)=\"selectPage(pg.number, $event)\">{{pg.text}}</a>\n    </li>\n\n    <li class=\"pagination-next\"\n        [ng-class]=\"{disabled: noNext()||disabled, hidden: !directionLinks}\"\n        [hidden]=\"!directionLinks\">\n      <a href (click)=\"selectPage(page + 1, $event)\">{{getText('next')}}</a></li>\n\n    <li class=\"pagination-last\"\n        [ng-class]=\"{disabled: noNext()||disabled, hidden: !boundaryLinks}\"\n        [hidden]=\"!boundaryLinks\">\n      <a href (click)=\"selectPage(totalPages, $event)\">{{getText('last')}}</a></li>\n  </ul>\n  ",
	            directives: [angular2_1.CORE_DIRECTIVES, angular2_1.NgClass],
	            encapsulation: angular2_1.ViewEncapsulation.None
	        }),
	        __param(0, angular2_1.Self()), 
	        __metadata('design:paramtypes', [angular2_1.NgModel, angular2_1.Renderer, angular2_1.ElementRef])
	    ], Pagination);
	    return Pagination;
	})();
	exports.Pagination = Pagination;
	var pagerConfig = {
	    itemsPerPage: 10,
	    previousText: '« Previous',
	    nextText: 'Next »',
	    align: true
	};
	var Pager = (function (_super) {
	    __extends(Pager, _super);
	    function Pager(cd, renderer, elementRef) {
	        _super.call(this, cd, renderer, elementRef);
	        this.align = pagerConfig.align;
	        this.config = pagerConfig;
	    }
	    Pager = __decorate([
	        angular2_1.Component({
	            selector: 'pager[ng-model], [pager][ng-model]',
	            properties: [
	                'align',
	                'totalItems', 'itemsPerPage',
	                'previousText', 'nextText',
	            ]
	        }),
	        angular2_1.View({
	            template: "\n    <ul class=\"pager\">\n      <li [ng-class]=\"{disabled: noPrevious(), previous: align, 'pull-left': align}\"><a href (click)=\"selectPage(page - 1, $event)\">{{getText('previous')}}</a></li>\n      <li [ng-class]=\"{disabled: noNext(), next: align, 'pull-right': align}\"><a href (click)=\"selectPage(page + 1, $event)\">{{getText('next')}}</a></li>\n  </ul>\n  ",
	            directives: [angular2_1.NgClass]
	        }),
	        __param(0, angular2_1.Self()), 
	        __metadata('design:paramtypes', [angular2_1.NgModel, angular2_1.Renderer, angular2_1.ElementRef])
	    ], Pager);
	    return Pager;
	})(Pagination);
	exports.Pager = Pager;
	exports.pagination = [Pagination, Pager];


/***/ },

/***/ 386:
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
	var __param = (this && this.__param) || function (paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	};
	var angular2_1 = __webpack_require__(8);
	var progressConfig = {
	    animate: true,
	    max: 100
	};
	var Progress = (function () {
	    function Progress() {
	        this.bars = [];
	    }
	    Progress.prototype.onInit = function () {
	        this.animate = this.animate !== false;
	        this.max = typeof this.max === 'number' ? this.max : progressConfig.max;
	    };
	    Object.defineProperty(Progress.prototype, "max", {
	        get: function () {
	            return this._max;
	        },
	        set: function (v) {
	            this._max = v;
	            this.bars.forEach(function (bar) {
	                bar.recalculatePercentage();
	            });
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Progress.prototype.addBar = function (bar) {
	        if (!this.animate) {
	            bar.transition = 'none';
	        }
	        this.bars.push(bar);
	    };
	    Progress.prototype.removeBar = function (bar) {
	        this.bars.splice(this.bars.indexOf(bar), 1);
	    };
	    Progress = __decorate([
	        angular2_1.Directive({
	            selector: 'bs-progress, [progress]',
	            properties: ['animate', 'max'],
	            host: {
	                'class': 'progress',
	                '[attr.max]': 'max'
	            }
	        }), 
	        __metadata('design:paramtypes', [])
	    ], Progress);
	    return Progress;
	})();
	exports.Progress = Progress;
	var Bar = (function () {
	    function Bar(progress) {
	        this.progress = progress;
	        this.percent = 0;
	    }
	    Bar.prototype.onInit = function () {
	        this.progress.addBar(this);
	    };
	    Bar.prototype.onDestroy = function () {
	        this.progress.removeBar(this);
	    };
	    Object.defineProperty(Bar.prototype, "value", {
	        get: function () {
	            return this._value;
	        },
	        set: function (v) {
	            if (!v && v !== 0) {
	                return;
	            }
	            this._value = v;
	            this.recalculatePercentage();
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Bar.prototype.recalculatePercentage = function () {
	        this.percent = +(100 * this.value / this.progress.max).toFixed(2);
	        var totalPercentage = this.progress.bars.reduce(function (total, bar) {
	            return total + bar.percent;
	        }, 0);
	        if (totalPercentage > 100) {
	            this.percent -= totalPercentage - 100;
	        }
	    };
	    Bar = __decorate([
	        angular2_1.Component({
	            selector: 'bar, [bar]',
	            properties: ['type', 'value']
	        }),
	        angular2_1.View({
	            template: "\n  <div class=\"progress-bar\"\n    style=\"min-width: 0;\"\n    role=\"progressbar\"\n    [ng-class]=\"type && 'progress-bar-' + type\"\n    [ng-style]=\"{width: (percent < 100 ? percent : 100) + '%', transition: transition}\"\n    aria-valuemin=\"0\"\n    [attr.aria-valuenow]=\"value\"\n    [attr.aria-valuetext]=\"percent.toFixed(0) + '%'\"\n    [attr.aria-valuemax]=\"max\"\n    ><ng-content></ng-content></div>\n",
	            directives: [angular2_1.NgStyle, angular2_1.NgClass],
	            encapsulation: angular2_1.ViewEncapsulation.None
	        }),
	        __param(0, angular2_1.Host()), 
	        __metadata('design:paramtypes', [Progress])
	    ], Bar);
	    return Bar;
	})();
	exports.Bar = Bar;
	var Progressbar = (function () {
	    function Progressbar() {
	    }
	    Progressbar = __decorate([
	        angular2_1.Component({
	            selector: 'progressbar, [progressbar]',
	            properties: ['animate', 'max', 'type', 'value']
	        }),
	        angular2_1.View({
	            template: "\n    <div progress [animate]=\"animate\" [max]=\"max\">\n      <bar [type]=\"type\" [value]=\"value\">\n          <ng-content></ng-content>\n      </bar>\n    </div>\n  ",
	            directives: [Progress, Bar]
	        }), 
	        __metadata('design:paramtypes', [])
	    ], Progressbar);
	    return Progressbar;
	})();
	exports.Progressbar = Progressbar;
	exports.progressbar = [Progress, Bar, Progressbar];


/***/ },

/***/ 387:
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
	var __param = (this && this.__param) || function (paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	};
	var angular2_1 = __webpack_require__(8);
	var Rating = (function () {
	    function Rating(cd) {
	        this.cd = cd;
	        this.onHover = new angular2_1.EventEmitter();
	        this.onLeave = new angular2_1.EventEmitter();
	        this.onChange = function (_) { };
	        this.onTouched = function () { };
	        cd.valueAccessor = this;
	    }
	    Rating.prototype.onInit = function () {
	        this.max = typeof this.max !== 'undefined' ? this.max : 5;
	        this.readonly = this.readonly === true;
	        this.stateOn = typeof this.stateOn !== 'undefined' ? this.stateOn : 'glyphicon-star';
	        this.stateOff = typeof this.stateOff !== 'undefined' ? this.stateOff : 'glyphicon-star-empty';
	        this.titles = typeof this.titles !== 'undefined' && this.titles.length > 0 ? this.titles : ['one', 'two', 'three', 'four', 'five'];
	        this.range = this.buildTemplateObjects(this.ratingStates, this.max);
	    };
	    Rating.prototype.writeValue = function (value) {
	        if (value % 1 !== value) {
	            this.value = Math.round(value);
	            this.preValue = value;
	            return;
	        }
	        this.preValue = value;
	        this.value = value;
	    };
	    Rating.prototype.buildTemplateObjects = function (ratingStates, max) {
	        ratingStates = ratingStates || [];
	        var count = ratingStates.length || max;
	        var result = [];
	        for (var i = 0; i < count; i++) {
	            result.push(Object.assign({
	                index: i,
	                stateOn: this.stateOn,
	                stateOff: this.stateOff,
	                title: this.titles[i] || i + 1
	            }, ratingStates[i] || {}));
	        }
	        return result;
	    };
	    Rating.prototype.rate = function (value) {
	        if (!this.readonly && value >= 0 && value <= this.range.length) {
	            this.writeValue(value);
	            this.cd.viewToModelUpdate(value);
	        }
	    };
	    Rating.prototype.enter = function (value) {
	        if (!this.readonly) {
	            this.value = value;
	            this.onHover.next(value);
	        }
	    };
	    Rating.prototype.reset = function () {
	        this.value = this.preValue;
	        this.onLeave.next(this.value);
	    };
	    Rating.prototype.onKeydown = function (event) {
	        if ([37, 38, 39, 40].indexOf(event.which) === -1) {
	            return;
	        }
	        event.preventDefault();
	        event.stopPropagation();
	        var sign = event.which === 38 || event.which === 39 ? 1 : -1;
	        this.rate(this.value + sign);
	    };
	    Rating.prototype.registerOnChange = function (fn) {
	        this.onChange = fn;
	    };
	    Rating.prototype.registerOnTouched = function (fn) {
	        this.onTouched = fn;
	    };
	    Rating = __decorate([
	        angular2_1.Component({
	            selector: 'rating[ng-model]',
	            properties: [
	                'max', 'readonly', 'titles',
	                'stateOn', 'stateOff',
	                'ratingStates'
	            ],
	            events: ['onHover', 'onLeave'],
	            host: {
	                '(keydown)': 'onKeydown($event)'
	            }
	        }),
	        angular2_1.View({
	            template: "\n    <span (mouseleave)=\"reset()\" (keydown)=\"onKeydown($event)\" tabindex=\"0\" role=\"slider\" aria-valuemin=\"0\" [attr.aria-valuemax]=\"range.length\" [attr.aria-valuenow]=\"value\">\n      <template ng-for #r [ng-for-of]=\"range\" #index=\"index\">\n        <span class=\"sr-only\">({{ index < value ? '*' : ' ' }})</span>\n        <i (mouseenter)=\"enter(index + 1)\" (click)=\"rate(index + 1)\" class=\"glyphicon\" [ng-class]=\"index < value ? r.stateOn : r.stateOff\" [title]=\"r.title\" ></i>\n      </template>\n    </span>\n  ",
	            directives: [angular2_1.NgClass, angular2_1.NgFor]
	        }),
	        __param(0, angular2_1.Self()), 
	        __metadata('design:paramtypes', [angular2_1.NgModel])
	    ], Rating);
	    return Rating;
	})();
	exports.Rating = Rating;


/***/ },

/***/ 388:
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
	var common_1 = __webpack_require__(209);
	var Tabset = (function () {
	    function Tabset() {
	        this.tabs = [];
	    }
	    Object.defineProperty(Tabset.prototype, "classMap", {
	        get: function () {
	            var map = {
	                'nav-stacked': this.vertical,
	                'nav-justified': this.justified
	            };
	            map['nav-' + (this.type || 'tabs')] = true;
	            return map;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Tabset.prototype.onInit = function () {
	        this.type = this.type !== 'undefined' ? this.type : 'tabs';
	    };
	    Tabset.prototype.addTab = function (tab) {
	        this.tabs.push(tab);
	        tab.active = this.tabs.length === 1 && tab.active !== false;
	    };
	    Tabset.prototype.removeTab = function (tab) {
	        var index = this.tabs.indexOf(tab);
	        if (index === -1) {
	            return;
	        }
	        if (tab.active && this.tabs.length > 1) {
	            var newActiveIndex = index === this.tabs.length - 1 ? index - 1 : index + 1;
	            this.tabs[newActiveIndex].active = true;
	        }
	        this.tabs.slice(index, 1);
	    };
	    Tabset = __decorate([
	        angular2_1.Component({
	            selector: 'tabset',
	            properties: ['vertical', 'justified', 'type']
	        }),
	        angular2_1.View({
	            template: "\n    <ul class=\"nav\" [ng-class]=\"classMap\" (click)=\"$event.preventDefault()\">\n        <li *ng-for=\"#tabz of tabs\" class=\"nav-item\" [ng-class]=\"{active: tabz.active, disabled: tabz.disabled}\">\n          <a href class=\"nav-link\" [ng-class]=\"{active: tabz.active, disabled: tabz.disabled}\" (click)=\"tabz.active = true\">\n            <span [ng-transclude]=\"tabz.headingRef\">{{tabz.heading}}</span>\n          </a>\n        </li>\n    </ul>\n    <div class=\"tab-content\">\n      <ng-content></ng-content>\n    </div>\n  ",
	            directives: [angular2_1.CORE_DIRECTIVES, angular2_1.NgClass, common_1.NgTransclude]
	        }), 
	        __metadata('design:paramtypes', [])
	    ], Tabset);
	    return Tabset;
	})();
	exports.Tabset = Tabset;
	var Tab = (function () {
	    function Tab(tabset) {
	        this.tabset = tabset;
	        this.select = new angular2_1.EventEmitter();
	        this.deselect = new angular2_1.EventEmitter();
	        this.tabset.addTab(this);
	    }
	    Object.defineProperty(Tab.prototype, "disable", {
	        get: function () {
	            return this.disabled;
	        },
	        set: function (v) {
	            console.warn('DEPRECATED use `disabled` property (not `disable`)');
	            this.disabled = v;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Tab.prototype, "active", {
	        get: function () {
	            return this._active;
	        },
	        set: function (active) {
	            var _this = this;
	            if (this.disabled && active || !active) {
	                if (!active) {
	                    this._active = active;
	                }
	                this.deselect.next(this);
	                return;
	            }
	            this._active = active;
	            this.select.next(this);
	            this.tabset.tabs.forEach(function (tab) {
	                if (tab !== _this) {
	                    tab.active = false;
	                }
	            });
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Tab.prototype.doCheck = function () {
	        return true;
	    };
	    Tab.prototype.onInit = function () {
	    };
	    Tab.prototype.onDestroy = function () {
	        this.tabset.removeTab(this);
	    };
	    Tab = __decorate([
	        angular2_1.Directive({
	            selector: 'tab, [tab]',
	            properties: ['active', 'disable', 'disabled', 'heading'],
	            events: ['select', 'deselect'],
	            host: {
	                '[class.tab-pane]': 'true',
	                '[class.active]': 'active'
	            }
	        }), 
	        __metadata('design:paramtypes', [Tabset])
	    ], Tab);
	    return Tab;
	})();
	exports.Tab = Tab;
	var TabHeading = (function () {
	    function TabHeading(templateRef, tab) {
	        this.templateRef = templateRef;
	        tab.headingRef = templateRef;
	    }
	    TabHeading = __decorate([
	        angular2_1.Directive({ selector: '[tab-heading]' }), 
	        __metadata('design:paramtypes', [angular2_1.TemplateRef, Tab])
	    ], TabHeading);
	    return TabHeading;
	})();
	exports.TabHeading = TabHeading;
	exports.tabs = [Tab, TabHeading, Tabset];


/***/ },

/***/ 389:
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
	var __param = (this && this.__param) || function (paramIndex, decorator) {
	    return function (target, key) { decorator(target, key, paramIndex); }
	};
	var angular2_1 = __webpack_require__(8);
	exports.timepickerConfig = {
	    hourStep: 1,
	    minuteStep: 1,
	    showMeridian: true,
	    meridians: null,
	    readonlyInput: false,
	    mousewheel: true,
	    arrowkeys: true,
	    showSpinners: true,
	    min: void 0,
	    max: void 0
	};
	function isDefined(value) {
	    return typeof value !== 'undefined';
	}
	function def(value, fn, defaultValue) {
	    return fn(value) ? value : defaultValue;
	}
	function addMinutes(date, minutes) {
	    var dt = new Date(date.getTime() + minutes * 60000);
	    var newDate = new Date(date);
	    newDate.setHours(dt.getHours(), dt.getMinutes());
	    return newDate;
	}
	var Timepicker = (function () {
	    function Timepicker(cd) {
	        this.cd = cd;
	        this._selected = new Date();
	        this.meridians = ['AM', 'PM'];
	        this.onChange = function (_) { };
	        this.onTouched = function () { };
	        cd.valueAccessor = this;
	    }
	    Object.defineProperty(Timepicker.prototype, "selected", {
	        get: function () {
	            return this._selected;
	        },
	        set: function (v) {
	            if (v) {
	                this._selected = v;
	                this.updateTemplate();
	                this.cd.viewToModelUpdate(this.selected);
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Object.defineProperty(Timepicker.prototype, "showMeridian", {
	        get: function () {
	            return this._showMeridian;
	        },
	        set: function (value) {
	            this._showMeridian = value;
	            if (true) {
	                this.updateTemplate();
	                return;
	            }
	            var hours = this.getHoursFromTemplate();
	            var minutes = this.getMinutesFromTemplate();
	            if (isDefined(hours) && isDefined(minutes)) {
	                this.selected.setHours(hours);
	                this.refresh();
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Timepicker.prototype.onInit = function () {
	        this.meridians = def(this.meridians, isDefined, exports.timepickerConfig.meridians) || ['AM', 'PM'];
	        this.mousewheel = def(this.mousewheel, isDefined, exports.timepickerConfig.mousewheel);
	        if (this.mousewheel) {
	            this.setupMousewheelEvents();
	        }
	        this.arrowkeys = def(this.arrowkeys, isDefined, exports.timepickerConfig.arrowkeys);
	        if (this.arrowkeys) {
	            this.setupArrowkeyEvents();
	        }
	        this.readonlyInput = def(this.readonlyInput, isDefined, exports.timepickerConfig.readonlyInput);
	        this.setupInputEvents();
	        this.hourStep = def(this.hourStep, isDefined, exports.timepickerConfig.hourStep);
	        this.minuteStep = def(this.minuteStep, isDefined, exports.timepickerConfig.minuteStep);
	        this.min = def(this.min, isDefined, exports.timepickerConfig.min);
	        this.max = def(this.max, isDefined, exports.timepickerConfig.max);
	        this.showMeridian = def(this.showMeridian, isDefined, exports.timepickerConfig.showMeridian);
	        this.showSpinners = def(this.showSpinners, isDefined, exports.timepickerConfig.showSpinners);
	    };
	    Timepicker.prototype.writeValue = function (v) {
	        if (v === this.selected) {
	            return;
	        }
	        if (v && v instanceof Date) {
	            this.selected = v;
	            return;
	        }
	        this.selected = v ? new Date(v) : null;
	    };
	    Timepicker.prototype.refresh = function (type) {
	        this.updateTemplate();
	        this.cd.viewToModelUpdate(this.selected);
	    };
	    Timepicker.prototype.updateTemplate = function (keyboardChange) {
	        var hours = this.selected.getHours();
	        var minutes = this.selected.getMinutes();
	        if (this.showMeridian) {
	            hours = (hours === 0 || hours === 12) ? 12 : hours % 12;
	        }
	        this.hours = this.pad(hours);
	        this.minutes = this.pad(minutes);
	        this.meridian = this.selected.getHours() < 12 ? this.meridians[0] : this.meridians[1];
	    };
	    Timepicker.prototype.getHoursFromTemplate = function () {
	        var hours = parseInt(this.hours, 10);
	        var valid = this.showMeridian ? (hours > 0 && hours < 13) : (hours >= 0 && hours < 24);
	        if (!valid) {
	            return undefined;
	        }
	        if (this.showMeridian) {
	            if (hours === 12) {
	                hours = 0;
	            }
	            if (this.meridian === this.meridians[1]) {
	                hours = hours + 12;
	            }
	        }
	        return hours;
	    };
	    Timepicker.prototype.getMinutesFromTemplate = function () {
	        var minutes = parseInt(this.minutes, 10);
	        return (minutes >= 0 && minutes < 60) ? minutes : undefined;
	    };
	    Timepicker.prototype.pad = function (value) {
	        return (isDefined(value) && value.toString().length < 2) ? '0' + value : value.toString();
	    };
	    Timepicker.prototype.setupMousewheelEvents = function () {
	    };
	    Timepicker.prototype.setupArrowkeyEvents = function () {
	    };
	    Timepicker.prototype.setupInputEvents = function () {
	    };
	    Timepicker.prototype.updateHours = function () {
	        if (this.readonlyInput) {
	            return;
	        }
	        var hours = this.getHoursFromTemplate();
	        var minutes = this.getMinutesFromTemplate();
	        if (!isDefined(hours) || !isDefined(minutes)) {
	        }
	        this.selected.setHours(hours);
	        if (this.selected < this.min || this.selected > this.max) {
	        }
	        else {
	            this.refresh('h');
	        }
	    };
	    Timepicker.prototype.hoursOnBlur = function (event) {
	        if (this.readonlyInput) {
	            return;
	        }
	        if (!this.invalidHours && parseInt(this.hours, 10) < 10) {
	            this.hours = this.pad(this.hours);
	        }
	    };
	    Timepicker.prototype.updateMinutes = function () {
	        if (this.readonlyInput) {
	            return;
	        }
	        var minutes = this.getMinutesFromTemplate();
	        var hours = this.getHoursFromTemplate();
	        if (!isDefined(minutes) || !isDefined(hours)) {
	        }
	        this.selected.setMinutes(minutes);
	        if (this.selected < this.min || this.selected > this.max) {
	        }
	        else {
	            this.refresh('m');
	        }
	    };
	    Timepicker.prototype.minutesOnBlur = function (event) {
	        if (this.readonlyInput) {
	            return;
	        }
	        if (!this.invalidMinutes && parseInt(this.minutes, 10) < 10) {
	            this.minutes = this.pad(this.minutes);
	        }
	    };
	    Timepicker.prototype.noIncrementHours = function () {
	        var incrementedSelected = addMinutes(this.selected, this.hourStep * 60);
	        return incrementedSelected > this.max ||
	            (incrementedSelected < this.selected && incrementedSelected < this.min);
	    };
	    Timepicker.prototype.noDecrementHours = function () {
	        var decrementedSelected = addMinutes(this.selected, -this.hourStep * 60);
	        return decrementedSelected < this.min ||
	            (decrementedSelected > this.selected && decrementedSelected > this.max);
	    };
	    Timepicker.prototype.noIncrementMinutes = function () {
	        var incrementedSelected = addMinutes(this.selected, this.minuteStep);
	        return incrementedSelected > this.max ||
	            (incrementedSelected < this.selected && incrementedSelected < this.min);
	    };
	    Timepicker.prototype.noDecrementMinutes = function () {
	        var decrementedSelected = addMinutes(this.selected, -this.minuteStep);
	        return decrementedSelected < this.min ||
	            (decrementedSelected > this.selected && decrementedSelected > this.max);
	    };
	    Timepicker.prototype.addMinutesToSelected = function (minutes) {
	        this.selected = addMinutes(this.selected, minutes);
	        this.refresh();
	    };
	    Timepicker.prototype.noToggleMeridian = function () {
	        if (this.selected.getHours() < 13) {
	            return addMinutes(this.selected, 12 * 60) > this.max;
	        }
	        else {
	            return addMinutes(this.selected, -12 * 60) < this.min;
	        }
	    };
	    Timepicker.prototype.incrementHours = function () {
	        if (!this.noIncrementHours()) {
	            this.addMinutesToSelected(this.hourStep * 60);
	        }
	    };
	    Timepicker.prototype.decrementHours = function () {
	        if (!this.noDecrementHours()) {
	            this.addMinutesToSelected(-this.hourStep * 60);
	        }
	    };
	    Timepicker.prototype.incrementMinutes = function () {
	        if (!this.noIncrementMinutes()) {
	            this.addMinutesToSelected(this.minuteStep);
	        }
	    };
	    Timepicker.prototype.decrementMinutes = function () {
	        if (!this.noDecrementMinutes()) {
	            this.addMinutesToSelected(-this.minuteStep);
	        }
	    };
	    Timepicker.prototype.toggleMeridian = function () {
	        if (!this.noToggleMeridian()) {
	            var sign = this.selected.getHours() < 12 ? 1 : -1;
	            this.addMinutesToSelected(12 * 60 * sign);
	        }
	    };
	    Timepicker.prototype.registerOnChange = function (fn) {
	        this.onChange = fn;
	    };
	    Timepicker.prototype.registerOnTouched = function (fn) {
	        this.onTouched = fn;
	    };
	    Timepicker = __decorate([
	        angular2_1.Component({
	            selector: 'timepicker[ng-model]',
	            properties: [
	                'hourStep', 'minuteStep',
	                'meridians', 'showMeridian',
	                'readonlyInput',
	                'mousewheel', 'arrowkeys',
	                'showSpinners',
	                'min', 'max'
	            ]
	        }),
	        angular2_1.View({
	            template: "\n    <table>\n      <tbody>\n        <tr class=\"text-center\" [ng-class]=\"{hidden: !showSpinners}\">\n          <td><a (click)=\"incrementHours()\" [ng-class]=\"{disabled: noIncrementHours()}\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n          <td>&nbsp;</td>\n          <td><a (click)=\"incrementMinutes()\" [ng-class]=\"{disabled: noIncrementMinutes()}\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a></td>\n          <td [ng-class]=\"{hidden: !showMeridian}\" [hidden]=\"!showMeridian\"></td>\n        </tr>\n        <tr>\n          <td class=\"form-group\" [ng-class]=\"{'has-error': invalidHours}\">\n            <input style=\"width:50px;\" type=\"text\" [(ng-model)]=\"hours\" (change)=\"updateHours()\" class=\"form-control text-center\" [readonly]=\"readonlyInput\" (blur)=\"hoursOnBlur($event)\" maxlength=\"2\">\n          </td>\n          <td>:</td>\n          <td class=\"form-group\" [ng-class]=\"{'has-error': invalidMinutes}\">\n            <input style=\"width:50px;\" type=\"text\" [(ng-model)]=\"minutes\" (change)=\"updateMinutes()\" class=\"form-control text-center\" [readonly]=\"readonlyInput\" (blur)=\"minutesOnBlur($event)\" maxlength=\"2\">\n          </td>\n          <td [ng-class]=\"{hidden: !showMeridian}\" [hidden]=\"!showMeridian\"><button type=\"button\" [ng-class]=\"{disabled: noToggleMeridian()}\" class=\"btn btn-default text-center\" (click)=\"toggleMeridian()\">{{meridian}}</button></td>\n        </tr>\n        <tr class=\"text-center\" [ng-class]=\"{hidden: !showSpinners}\">\n          <td><a (click)=\"decrementHours()\" [ng-class]=\"{disabled: noDecrementHours()}\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n          <td>&nbsp;</td>\n          <td><a (click)=\"decrementMinutes()\" [ng-class]=\"{disabled: noDecrementMinutes()}\" class=\"btn btn-link\"><span class=\"glyphicon glyphicon-chevron-down\"></span></a></td>\n          <td [ng-class]=\"{hidden: !showMeridian}\" [hidden]=\"!showMeridian\"></td>\n        </tr>\n      </tbody>\n    </table>\n  ",
	            directives: [angular2_1.FORM_DIRECTIVES, angular2_1.NgClass]
	        }),
	        __param(0, angular2_1.Self()), 
	        __metadata('design:paramtypes', [angular2_1.NgModel])
	    ], Timepicker);
	    return Timepicker;
	})();
	exports.Timepicker = Timepicker;


/***/ },

/***/ 390:
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
	var angular2_2 = __webpack_require__(8);
	var position_1 = __webpack_require__(130);
	var TooltipOptions = (function () {
	    function TooltipOptions(options) {
	        Object.assign(this, options);
	    }
	    return TooltipOptions;
	})();
	var TooltipContainer = (function () {
	    function TooltipContainer(element, options) {
	        this.element = element;
	        Object.assign(this, options);
	        this.classMap = { 'in': false };
	        this.classMap[options.placement] = true;
	    }
	    TooltipContainer.prototype.position = function (hostEl) {
	        this.display = 'block';
	        this.top = '0px';
	        this.left = '0px';
	        var p = position_1.positionService
	            .positionElements(hostEl.nativeElement, this.element.nativeElement.children[0], this.placement, this.appendToBody);
	        this.top = p.top + 'px';
	        this.left = p.left + 'px';
	        this.classMap['in'] = true;
	    };
	    TooltipContainer = __decorate([
	        angular2_1.Component({
	            selector: 'tooltip-container'
	        }),
	        angular2_1.View({
	            template: "\n    <div class=\"tooltip\" role=\"tooltip\"\n     [ng-style]=\"{top: top, left: left, display: display}\"\n     [ng-class]=\"classMap\" >\n      <div class=\"tooltip-arrow\"></div>\n      <div class=\"tooltip-inner\">\n        {{content}}\n      </div>\n    </div>",
	            directives: [angular2_1.NgClass, angular2_1.NgStyle],
	            encapsulation: angular2_1.ViewEncapsulation.None
	        }), 
	        __metadata('design:paramtypes', [angular2_1.ElementRef, TooltipOptions])
	    ], TooltipContainer);
	    return TooltipContainer;
	})();
	var Tooltip = (function () {
	    function Tooltip(element, loader) {
	        this.element = element;
	        this.loader = loader;
	        this.visible = false;
	        this.placement = 'top';
	    }
	    Tooltip.prototype.onInit = function () {
	    };
	    Tooltip.prototype.show = function () {
	        var _this = this;
	        if (this.visible) {
	            return;
	        }
	        this.visible = true;
	        var options = new TooltipOptions({
	            content: this.content,
	            placement: this.placement
	        });
	        var binding = angular2_2.Injector.resolve([
	            angular2_2.bind(TooltipOptions).toValue(options)
	        ]);
	        this.tooltip = this.loader
	            .loadNextToLocation(TooltipContainer, this.element, binding)
	            .then(function (componentRef) {
	            componentRef.instance.position(_this.element);
	            return componentRef;
	        });
	    };
	    Tooltip.prototype.hide = function () {
	        if (!this.visible) {
	            return;
	        }
	        this.visible = false;
	        this.tooltip.then(function (componentRef) {
	            componentRef.dispose();
	            return componentRef;
	        });
	    };
	    Tooltip = __decorate([
	        angular2_1.Directive({
	            selector: '[tooltip]',
	            properties: [
	                'content:tooltip',
	                'placement:tooltip-placement',
	                'appendToBody',
	                'isOpen: tooltip-is-open',
	                'enable: tooltip-enable'
	            ],
	            host: {
	                '(mouseenter)': 'show($event, $targe)',
	                '(mouseleave)': 'hide($event, $targe)',
	                '(focusin)': 'show($event, $targe)',
	                '(focusout)': 'hide($event, $targe)'
	            }
	        }), 
	        __metadata('design:paramtypes', [angular2_1.ElementRef, angular2_1.DynamicComponentLoader])
	    ], Tooltip);
	    return Tooltip;
	})();
	exports.Tooltip = Tooltip;
	exports.tooltip = [Tooltip, TooltipContainer];


/***/ },

/***/ 391:
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
	function setProperty(renderer, elementRef, propName, propValue) {
	    renderer.setElementProperty(elementRef, propName, propValue);
	}
	var angular2_2 = __webpack_require__(8);
	var ng2_bootstrap_config_1 = __webpack_require__(129);
	var position_1 = __webpack_require__(130);
	var TEMPLATE = (_a = {},
	    _a[ng2_bootstrap_config_1.Ng2BootstrapTheme.BS4] = "\n  <div class=\"dropdown-menu\"\n      [ng-style]=\"{top: top, left: left, display: display}\"\n      style=\"display: block\">\n      <a href=\"#\"\n         *ng-for=\"#match of matches\"\n         (click)=\"selectMatch(match, $event)\"\n         [ng-class]=\"{active: isActive(match) }\"\n         (mouseenter)=\"selectActive(match)\"\n         class=\"dropdown-item\"\n         [inner-html]=\"hightlight(match, query)\"></a>\n  </div>\n  ",
	    _a[ng2_bootstrap_config_1.Ng2BootstrapTheme.BS3] = "\n  <ul class=\"dropdown-menu\"\n      [ng-style]=\"{top: top, left: left, display: display}\"\n      style=\"display: block\">\n    <li *ng-for=\"#match of matches\"\n        [ng-class]=\"{active: isActive(match) }\"\n        (mouseenter)=\"selectActive(match)\">\n        <a href=\"#\" (click)=\"selectMatch(match, $event)\" tabindex=\"-1\" [inner-html]=\"hightlight(match, query)\"></a>\n    </li>\n  </ul>\n  ",
	    _a
	);
	var TypeaheadOptions = (function () {
	    function TypeaheadOptions(options) {
	        Object.assign(this, options);
	    }
	    return TypeaheadOptions;
	})();
	exports.TypeaheadOptions = TypeaheadOptions;
	var TypeaheadContainer = (function () {
	    function TypeaheadContainer(element, options) {
	        this.element = element;
	        this._matches = [];
	        Object.assign(this, options);
	    }
	    Object.defineProperty(TypeaheadContainer.prototype, "matches", {
	        get: function () {
	            return this._matches;
	        },
	        set: function (value) {
	            this._matches = value;
	            if (this._matches.length > 0) {
	                this._active = this._matches[0];
	            }
	        },
	        enumerable: true,
	        configurable: true
	    });
	    TypeaheadContainer.prototype.position = function (hostEl) {
	        this.display = 'block';
	        this.top = '0px';
	        this.left = '0px';
	        var p = position_1.positionService
	            .positionElements(hostEl.nativeElement, this.element.nativeElement.children[0], this.placement, false);
	        this.top = p.top + 'px';
	        this.left = p.left + 'px';
	    };
	    TypeaheadContainer.prototype.selectActiveMatch = function () {
	        this.selectMatch(this._active);
	    };
	    TypeaheadContainer.prototype.prevActiveMatch = function () {
	        var index = this.matches.indexOf(this._active);
	        this._active = this.matches[index - 1 < 0 ? this.matches.length - 1 : index - 1];
	    };
	    TypeaheadContainer.prototype.nextActiveMatch = function () {
	        var index = this.matches.indexOf(this._active);
	        this._active = this.matches[index + 1 > this.matches.length - 1 ? 0 : index + 1];
	    };
	    TypeaheadContainer.prototype.selectActive = function (value) {
	        this._active = value;
	    };
	    TypeaheadContainer.prototype.isActive = function (value) {
	        return this._active === value;
	    };
	    TypeaheadContainer.prototype.selectMatch = function (value, e) {
	        if (e === void 0) { e = null; }
	        if (e) {
	            e.stopPropagation();
	            e.preventDefault();
	        }
	        this.parent.changeModel(value);
	        this.parent.typeaheadOnSelect.next({
	            item: value
	        });
	        return false;
	    };
	    TypeaheadContainer.prototype.escapeRegexp = function (queryToEscape) {
	        return queryToEscape.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');
	    };
	    TypeaheadContainer.prototype.hightlight = function (item, query) {
	        return query ? item.replace(new RegExp(this.escapeRegexp(query), 'gi'), '<strong>$&</strong>') : item;
	    };
	    ;
	    TypeaheadContainer = __decorate([
	        angular2_1.Component({
	            selector: 'typeahead-container'
	        }),
	        angular2_1.View({
	            template: TEMPLATE[ng2_bootstrap_config_1.Ng2BootstrapConfig.theme],
	            directives: [angular2_1.CORE_DIRECTIVES, angular2_1.NgClass, angular2_1.NgStyle],
	            encapsulation: angular2_1.ViewEncapsulation.None
	        }), 
	        __metadata('design:paramtypes', [angular2_1.ElementRef, TypeaheadOptions])
	    ], TypeaheadContainer);
	    return TypeaheadContainer;
	})();
	exports.TypeaheadContainer = TypeaheadContainer;
	var Typeahead = (function () {
	    function Typeahead(cd, element, renderer, loader) {
	        this.cd = cd;
	        this.element = element;
	        this.renderer = renderer;
	        this.loader = loader;
	        this.typeaheadLoading = new angular2_1.EventEmitter();
	        this.typeaheadNoResults = new angular2_1.EventEmitter();
	        this.typeaheadOnSelect = new angular2_1.EventEmitter();
	        this.async = null;
	        this._matches = [];
	        this.placement = 'bottom-left';
	    }
	    Object.defineProperty(Typeahead.prototype, "matches", {
	        get: function () {
	            return this._matches;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    Typeahead.prototype.debounce = function (func, wait) {
	        var timeout;
	        var args;
	        var timestamp;
	        var waitOriginal = wait;
	        return function () {
	            args = [].slice.call(arguments, 0);
	            timestamp = Date.now();
	            wait = this.container ? waitOriginal : this.waitMs;
	            var later = function () {
	                var last = Date.now() - timestamp;
	                if (last < wait) {
	                    timeout = setTimeout(later, wait - last);
	                }
	                else {
	                    timeout = null;
	                    func.apply(this, args);
	                }
	            };
	            if (!timeout) {
	                timeout = setTimeout(later, wait);
	            }
	        };
	    };
	    Typeahead.prototype.processMatches = function () {
	        this._matches = [];
	        if (this.cd.model.toString().length >= this.minLength) {
	            for (var i = 0; i < this.source.length; i++) {
	                var match = void 0;
	                if (typeof this.source[i] === 'object' &&
	                    this.source[i][this.field]) {
	                    match = this.source[i][this.field];
	                }
	                if (typeof this.source[i] === 'string') {
	                    match = this.source[i];
	                }
	                if (!match) {
	                    console.log('Invalid match type', typeof this.source[i], this.field);
	                    continue;
	                }
	                if (match.toLowerCase().indexOf(this.cd.model.toString().toLowerCase()) >= 0) {
	                    this._matches.push(match);
	                    if (this._matches.length > this.optionsLimit - 1) {
	                        break;
	                    }
	                }
	            }
	        }
	    };
	    Typeahead.prototype.finalizeAsyncCall = function () {
	        this.typeaheadLoading.next(false);
	        this.typeaheadNoResults.next(this.cd.model.toString().length >=
	            this.minLength && this.matches.length <= 0);
	        if (this.cd.model.toString().length <= 0 || this._matches.length <= 0) {
	            this.hide();
	            return;
	        }
	        if (this.container && this._matches.length > 0) {
	            this.container.query = this.cd.model;
	            this.container.matches = this._matches;
	        }
	        if (!this.container && this._matches.length > 0) {
	            this.show(this._matches);
	        }
	    };
	    Typeahead.prototype.onInit = function () {
	        var _this = this;
	        this.optionsLimit = this.optionsLimit || 20;
	        this.minLength = this.minLength || 1;
	        this.waitMs = this.waitMs || 0;
	        if (this.async === null && typeof this.source !== 'function') {
	            this.async = false;
	        }
	        if (typeof this.source === 'function') {
	            this.async = true;
	        }
	        if (this.async === true) {
	            this.debouncer = this.debounce(function () {
	                if (typeof _this.source === 'function') {
	                    _this.source().then(function (matches) {
	                        _this._matches = [];
	                        if (_this.cd.model.toString().length >= _this.minLength) {
	                            for (var i = 0; i < matches.length; i++) {
	                                _this._matches.push(matches[i]);
	                                if (_this._matches.length > _this.optionsLimit - 1) {
	                                    break;
	                                }
	                            }
	                        }
	                        _this.finalizeAsyncCall();
	                    });
	                }
	                if (typeof _this.source === 'object' && _this.source.length) {
	                    _this.processMatches();
	                    _this.finalizeAsyncCall();
	                }
	            }, 100);
	        }
	    };
	    Typeahead.prototype.onChange = function (e) {
	        if (this.container) {
	            if (e.keyCode === 27) {
	                this.hide();
	                return;
	            }
	            if (e.keyCode === 38) {
	                this.container.prevActiveMatch();
	                return;
	            }
	            if (e.keyCode === 40) {
	                this.container.nextActiveMatch();
	                return;
	            }
	            if (e.keyCode === 13) {
	                this.container.selectActiveMatch();
	                return;
	            }
	        }
	        this.typeaheadLoading.next(true);
	        if (this.async === true) {
	            this.debouncer();
	        }
	        if (this.async === false) {
	            this.processMatches();
	            this.finalizeAsyncCall();
	        }
	    };
	    Typeahead.prototype.changeModel = function (value) {
	        this.cd.viewToModelUpdate(value);
	        setProperty(this.renderer, this.element, 'value', value);
	        this.hide();
	    };
	    Typeahead.prototype.show = function (matches) {
	        var _this = this;
	        var options = new TypeaheadOptions({
	            placement: this.placement,
	            animation: false
	        });
	        var binding = angular2_2.Injector.resolve([
	            angular2_2.bind(TypeaheadOptions).toValue(options)
	        ]);
	        this.popup = this.loader
	            .loadNextToLocation(TypeaheadContainer, this.element, binding)
	            .then(function (componentRef) {
	            componentRef.instance.position(_this.element);
	            _this.container = componentRef.instance;
	            _this.container.parent = _this;
	            _this.container.query = _this.cd.model;
	            _this.container.matches = matches;
	            _this.element.nativeElement.focus();
	            return componentRef;
	        });
	    };
	    Typeahead.prototype.hide = function () {
	        var _this = this;
	        if (this.container) {
	            this.popup.then(function (componentRef) {
	                componentRef.dispose();
	                _this.container = null;
	                return componentRef;
	            });
	        }
	    };
	    Typeahead = __decorate([
	        angular2_1.Directive({
	            selector: 'typeahead, [typeahead]',
	            properties: [
	                'source:typeahead',
	                'appendToBody:typeaheadAppendToBody',
	                'editable:typeaheadEditable',
	                'focusFirst:typeaheadFocusFirst',
	                'inputFormatter:typeaheadInputFormatter',
	                'minLength:typeaheadMinLength',
	                'selectOnExact:typeaheadSelectOnExact',
	                'templateUrl:typeaheadTemplateUrl',
	                'popupTemplateUrl:typeaheadPopupTemplateUrl',
	                'waitMs:typeaheadWaitMs',
	                'optionsLimit:typeaheadOptionsLimit',
	                'selectOnBlur:typeaheadSelectOnBlur',
	                'focusOnSelect:typeaheadFocusOnSelect',
	                'field:typeaheadOptionField',
	                'async:typeaheadAsync'
	            ],
	            events: ['typeaheadLoading', 'typeaheadNoResults', 'typeaheadOnSelect'],
	            host: {
	                '(keyup)': 'onChange($event)'
	            }
	        }), 
	        __metadata('design:paramtypes', [angular2_1.NgModel, angular2_1.ElementRef, angular2_1.Renderer, angular2_1.DynamicComponentLoader])
	    ], Typeahead);
	    return Typeahead;
	})();
	exports.Typeahead = Typeahead;
	exports.typeahead = [Typeahead];
	var _a;


/***/ },

/***/ 392:
/***/ function(module, exports, __webpack_require__) {

	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(379));
	__export(__webpack_require__(380));
	__export(__webpack_require__(382));
	__export(__webpack_require__(381));
	__export(__webpack_require__(384));
	__export(__webpack_require__(76));
	__export(__webpack_require__(210));
	__export(__webpack_require__(211));
	__export(__webpack_require__(212));
	__export(__webpack_require__(383));
	__export(__webpack_require__(208));
	__export(__webpack_require__(385));
	__export(__webpack_require__(386));
	__export(__webpack_require__(387));
	__export(__webpack_require__(388));
	__export(__webpack_require__(389));
	__export(__webpack_require__(390));
	__export(__webpack_require__(391));
	__export(__webpack_require__(130));
	__export(__webpack_require__(209));
	__export(__webpack_require__(129));


/***/ }

});
//# sourceMappingURL=angular2-file-upload-demo.js.map