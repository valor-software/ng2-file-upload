webpackJsonp([2],{

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(96);


/***/ },

/***/ 94:
/***/ function(module, exports, __webpack_require__) {

	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
	    switch (arguments.length) {
	        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
	        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
	        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
	    }
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var angular2_1 = __webpack_require__(6);
	var FileDrop = (function () {
	    function FileDrop(element) {
	        this.element = element;
	        this.config = {};
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
	            properties: ['config: ng2FileDrop', 'uploader'],
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

/***/ 95:
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../../tsd.d.ts" />
	var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") return Reflect.decorate(decorators, target, key, desc);
	    switch (arguments.length) {
	        case 2: return decorators.reduceRight(function(o, d) { return (d && d(o)) || o; }, target);
	        case 3: return decorators.reduceRight(function(o, d) { return (d && d(target, key)), void 0; }, void 0);
	        case 4: return decorators.reduceRight(function(o, d) { return (d && d(target, key, o)) || o; }, desc);
	    }
	};
	var __metadata = (this && this.__metadata) || function (k, v) {
	    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
	};
	var angular2_1 = __webpack_require__(6);
	var FileSelect = (function () {
	    function FileSelect(element) {
	        this.element = element;
	        this.config = {};
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
	            properties: ['config: ng2FileSelect', 'uploader'],
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

/***/ 96:
/***/ function(module, exports, __webpack_require__) {

	///<reference path="../tsd.d.ts"/>
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(95));
	__export(__webpack_require__(94));


/***/ }

});
//# sourceMappingURL=angular2-file-upload.js.map