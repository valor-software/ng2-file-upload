import { Headers } from './file-uploader.class';
import { EventEmitter } from '@angular/core';
import { FileLikeObject } from './file-like-object.class';
import { FileItem } from './file-item.class';
import { FileType } from './file-type.class';
import { HttpEvent, HttpResponse, HttpHeaders } from '@angular/common/http';
import { HttpUploadProgressEvent, HttpProgressEvent, HttpSentEvent, HttpErrorResponse } from '@angular/common/http/src/response';
function isFile(value: any): boolean {
	return (File && value instanceof File);
}

export interface Headers {
	name: string;
	value: string;
}


export type FilterFunction = {
	name: string,
	fn: (item?: FileLikeObject, options?: FileUploaderOptions) => boolean
};

export interface FileUploaderOptions {
	uploaderService: any;
	allowedMimeType?: string[];
	allowedFileType?: string[];
	autoUpload?: boolean;
	isHTML5?: boolean;
	filters?: FilterFunction[];
	headers?: Headers[];
	method?: string;
	authToken?: string;
	maxFileSize?: number;
	queueLimit?: number;
	removeAfterUpload?: boolean;
	url?: string;
	disableMultipart?: boolean;
	itemAlias?: string;
	authTokenHeader?: string;
	additionalParameter?: { [key: string]: any };
	parametersBeforeFiles?: boolean;
	formatDataFunction?: Function;
	formatDataFunctionIsAsync?: boolean;
}

export class FileUploader {
	public uploaderService: any;
	public authToken: string;
	public isUploading: boolean = false;
	public queue: FileItem[] = [];
	public progress: number = 0;
	public _nextIndex: number = 0;
	public autoUpload: any;
	public authTokenHeader: string;
	public response: EventEmitter<any>;
	public chunkSize: number = null;
	public options: FileUploaderOptions = {
		uploaderService: null,
		autoUpload: false,
		isHTML5: true,
		filters: [],
		removeAfterUpload: false,
		disableMultipart: false,
		formatDataFunction: (item: FileItem) => item._file,
		formatDataFunctionIsAsync: false
	};

	protected _failFilterIndex: number;

	public constructor(options: FileUploaderOptions) {
		this.setOptions(options);
		this.response = new EventEmitter<any>();
	}
	public setOptions(options: FileUploaderOptions): void {
		this.options = Object.assign(this.options, options);
		this.uploaderService = this.options.uploaderService;
		this.uploaderService.uploader = this;
		this.authToken = this.options.authToken;
		this.authTokenHeader = this.options.authTokenHeader || 'Authorization';
		this.autoUpload = this.options.autoUpload;
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

		for (let i = 0; i < this.queue.length; i++) {
			this.queue[i].url = this.options.url;
		}
	}

	public addToQueue(files: File[], options?: FileUploaderOptions, filters?: FilterFunction[] | string): void {
		let list: File[] = [];
		for (let file of files) {
			list.push(file);
		}
		let arrayOfFilters = this._getFilters(filters);
		let count = this.queue.length;
		let addedFileItems: FileItem[] = [];
		list.map((some: File) => {
			if (!options) {
				options = this.options;
			}

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
	}

	public removeFromQueue(value: FileItem): void {
		let index = this.getIndexOfItem(value);
		let item = this.queue[index];
		if (item.isUploading) {
			item.cancel();
		}
		this.queue.splice(index, 1);
		this.progress = this._getTotalProgress();
		this.onRemoveItem(item);		
	}

	public clearQueue(): void {
		while (this.queue.length) {
			this.queue[0].remove();
		}
		this.progress = 0;
	}

	public uploadItem(value: FileItem): void {
		let index = this.getIndexOfItem(value);
		let item = this.queue[index];
		item._prepareToUploading();
		if (this.isUploading) {
			return;
		}
		this.isUploading = true;
		this._uploadFile(item);
	}

	public cancelItem(value: FileItem): void {
		const index = this.getIndexOfItem(value);
		const item = this.queue[index];
		if (item && item.isUploading) {
			this.uploaderService.stopUpload()
		}
	}

	public uploadAll(): void {
		const items = this.getNotUploadedItems().filter((item: FileItem) => !item.isUploading);
		if (!items.length) {
			return;
		}
		items.map((item: FileItem) => item._prepareToUploading());
		items[0].upload();
	}

	public cancelAll(): void {
		const items = this.getNotUploadedItems();
		items.map((item: FileItem) => item.cancel());
	}

	public isFile(value: any): boolean {
		return isFile(value);
	}

	public isFileLikeObject(value: any): boolean {
		return value instanceof FileLikeObject;
	}

	public getIndexOfItem(value: any): number {
		return typeof value === 'number' ? value : this.queue.indexOf(value);
	}

	public getIsErrorItems(): any[] {
		return this.queue.filter((item: FileItem) => item.isError);
	}

	public getIsCancelItems(): any[] {
		return this.queue.filter((item: FileItem) => item.isCancel);
	}

	public getIsSuccessItems(): any[] {
		return this.queue.filter((item: FileItem) => item.isSuccess);
	}

	public getAllItems(): any[] {
		return this.queue;
	}


	public getNotUploadedItems(): any[] {
		return this.queue.filter((item: FileItem) => !item.isUploaded);
	}

	public getReadyItems(): any[] {
		return this.queue
			.filter((item: FileItem) => (item.isReady && !item.isUploading))
			.sort((item1: any, item2: any) => item1.index - item2.index);
	}

	public destroy(): void {
		return void 0;
	}

	public onAfterAddingAll(fileItems: any): any {
		return { fileItems };
	}

	public onBuildItemForm(fileItem: FileItem, form: any): any {
		return { fileItem, form };
	}

	public onAfterAddingFile(fileItem: FileItem): any {
		return { fileItem };
	}

	public onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any): any {
		return { item, filter, options };
	}

	public onBeforeUploadItem(fileItem: FileItem): any {
		return { fileItem };
	}

	public onProgressItem(fileItem: FileItem, progress: any): any {
		return { fileItem, progress };
	}

	public onProgressAll(progress: any): any {
		return { progress };
	}

	public onSuccessItem(item: FileItem, response: string, status: number, headers: HttpHeaders): any {
		return { item, response, status, headers };
	}

	public onErrorItem(item: FileItem, response: string, status: number, headers: HttpHeaders): any {
		return { item, response, status, headers };
	}

	public onCancelItem(item: FileItem): any {
		return { item };
	}
	public onRemoveItem(item: FileItem): any {
		return { item };
	}
	public onCompleteChunk(item: FileItem, response: string, status: number, headers: HttpHeaders): any {
		return { item, response, status, headers };
	}
	public onErrorChunk(item: FileItem, response: string, status: number, headers: HttpHeaders): any {
		return { item, response, status, headers };
	}
	public onCompleteItem(item: FileItem, response: string, status: number, headers: HttpHeaders): any {
		return { item, response, status, headers };
	}

	public onCompleteAll(): any {
		return void 0;
	}

	public _mimeTypeFilter(item: FileLikeObject): boolean {
		return !(this.options.allowedMimeType && this.options.allowedMimeType.indexOf(item.type) === -1);
	}

	public _fileSizeFilter(item: FileLikeObject): boolean {
		return !(this.options.maxFileSize && item.size > this.options.maxFileSize);
	}

	public _fileTypeFilter(item: FileLikeObject): boolean {
		return !(this.options.allowedFileType &&
			this.options.allowedFileType.indexOf(FileType.getMimeClass(item)) === -1);
	}

	public _onErrorItem(item: FileItem, response: string, status: number, headers: HttpHeaders): void {
		item._onError(response, status, headers);
		this.onErrorItem(item, response, status, headers);
	}
	public _onCompleteChunk(item: FileItem, response: string, status: number, headers: HttpHeaders): void {
		this.onCompleteChunk(item, response, status, headers);
		item._onCompleteChunk(response, status, headers);
		this.progress = this._getTotalProgress();
		this._render();
	}
	public _onCompleteItem(item: FileItem, response?: string, status?: number, headers?: HttpHeaders): void {
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
	
	protected _onProgress(event: HttpProgressEvent, item: FileItem) {
		event = event;
		let progress = (100 * event.loaded / event.total); 
		if (this.uploaderService.options.chunkSize > 0) {
			progress = ( 100 * item.getCurrentChunk() / item.getTotalChunks() ) + (progress / item.getTotalChunks() );
		}
		// TODO: Check why it's not showing upload progress per item only on complete.
		this._onProgressItem(item, Math.round(progress) );
	}
	public onProgress(event: HttpProgressEvent, item: FileItem) {
		this._onProgress(event, item);
	}
	protected _onStart(event: HttpSentEvent, item: FileItem) {

	}
	public onStart(event: HttpSentEvent, item: FileItem) {
		this._onStart(event, item);
	}
	protected _onLoad(event: HttpResponse<any>, item: FileItem) {
		const headers = event.headers;
		const response = this._transformResponse(event.body, headers);
		const gist = this._isSuccessCode(event.status) ? 'Success' : 'Error';
		const method = '_on' + gist + 'Item';
		if (this.uploaderService.options.chunkSize > 0) {
			if ( (item.getCurrentChunk() +1) >= item.getTotalChunks()) {
				(this as any)[method](item, response, event.status, headers);
				this._onCompleteItem(item, response, event.status, headers);
			} else {
				this._onCompleteChunk(item, response, event.status, headers);
			}
		} else {
			(this as any)[method](item, response, event.status, headers);
			this._onCompleteItem(item, response, event.status, headers);
		}
		
	}
	public onLoad(event: HttpResponse<any>, item: FileItem) {
		this._onLoad(event, item);
	}

	protected _onError(error: any, item: FileItem) {
		const headers: HttpHeaders = error.Headers
		const response = this._transformResponse(error.error, headers);
		if (this.uploaderService.options.chunkSize > 0) {
			this._onErrorChunk(item, response, error.status, headers);
		} else {
			this._onErrorItem(item, response, error.status, headers);
			this._onCompleteItem(item, response, error.status, headers);
		}
	}
	public onError(error: HttpErrorResponse, item: FileItem) {
		this._onError(error,item);
	}
	protected _onAbort(error: HttpErrorResponse, item: FileItem) {
		this._onCancelItem(item);
		this._onCompleteItem(item);
	}

	public onAbort(error: HttpErrorResponse, item: FileItem) {
		this._onAbort(error, item);
	}
	
	protected _uploadFile(item: FileItem): any {
		this._onBeforeUploadItem(item);
		if (typeof item._file.size !== 'number') {
			throw new TypeError('The file specified is no longer valid');
		}
		this.uploaderService.uploadFile(item, this.options);
	}
	
	protected _getTotalProgress(value: number = 0): number {
		if (this.options.removeAfterUpload) {
			return value;
		}
		let notUploaded = this.getNotUploadedItems().length;
		let uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
		let ratio = 100 / this.queue.length;
		let current = value * ratio / 100;
		return Math.round(uploaded * ratio + current);
	}

	protected _getFilters(filters: FilterFunction[] | string): FilterFunction[] {
		if (!filters) {
			return this.options.filters;
		}
		if (Array.isArray(filters)) {
			return filters;
		}
		if (typeof filters === 'string') {
			let names = filters.match(/[^\s,]+/g);
			return this.options.filters
				.filter((filter: any) => names.indexOf(filter.name) !== -1);
		}
		return this.options.filters;
	}

	protected _render(): any {
		return void 0;
	}

	protected _queueLimitFilter(): boolean {
		return this.options.queueLimit === undefined || this.queue.length < this.options.queueLimit;
	}

	protected _isValidFile(file: FileLikeObject, filters: FilterFunction[], options: FileUploaderOptions): boolean {
		this._failFilterIndex = -1;
		return !filters.length ? true : filters.every((filter: FilterFunction) => {
			this._failFilterIndex++;
			return filter.fn.call(this, file, options);
		});
	}

	protected _isSuccessCode(status: number): boolean {
		return (status >= 200 && status < 300) || status === 304;
	}

	protected _transformResponse(response: string, headers: HttpHeaders): string {
		return response;
	}

	protected _onWhenAddingFileFailed(item: FileLikeObject, filter: any, options: any): void {
		this.onWhenAddingFileFailed(item, filter, options);
	}

	protected _onAfterAddingFile(item: FileItem): void {
		this.onAfterAddingFile(item);
	}

	protected _onAfterAddingAll(items: any): void {
		this.onAfterAddingAll(items);
	}

	protected _onBeforeUploadItem(item: FileItem): void {
		item._onBeforeUpload();
		this.onBeforeUploadItem(item);
	}

	public _onBuildItemForm(item: FileItem, form: any): void {
		item._onBuildForm(form);
		this.onBuildItemForm(item, form);
	}

	protected _onProgressItem(item: FileItem, progress: any): void {
		const total = this._getTotalProgress(progress);
		this.progress = total;
		item._onProgress(progress);
		this.onProgressItem(item, progress);
		this.onProgressAll(total);
		this._render();
	}
	protected _onErrorChunk(item: FileItem, response: string, status: number, headers: HttpHeaders): void {
		item._onErrorChunk(response, status, headers);
		this.onErrorChunk(item, response, status, headers)
	}
	protected _onSuccessItem(item: FileItem, response: string, status: number, headers: HttpHeaders): void {
		item._onSuccess(response, status, headers);
		this.onSuccessItem(item, response, status, headers);
	}

	protected _onCancelItem(item: FileItem): void {
		item._onCancel();
		this.onCancelItem(item);
	}
}