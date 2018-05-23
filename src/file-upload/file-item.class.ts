import { HttpHeaders } from '@angular/common/http';
import { FileLikeObject } from './file-like-object.class';
import { FileUploader, FileUploaderOptions } from './file-uploader.class';
import { FileChunk } from './file-chunk.class'
export class FileItem {
	public file: FileLikeObject;
	public _file: File;
	public id: any;
	public alias: string;
	public url: string = '/';
	public method: string;
	public headers: any = [];
	public withCredentials: boolean = true;
	public formData: any = [];
	public isReady: boolean = false;
	public isUploading: boolean = false;
	public isUploaded: boolean = false;
	public isSuccess: boolean = false;
	public isCancel: boolean = false;
	public isError: boolean = false;
	public isRemoving: boolean = false;
	public progress: number = 0;
	public index: number = void 0;
	public downloadUrl?: string = null;
	public _form: any;
	public _fileChunks: FileChunk;
	
	protected chunkTotalRetries = 10;
	protected chunkRetries = 0;
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
			this.uploader._onCompleteItem(this, '', 0, new HttpHeaders());
			this.uploader._onErrorItem(this, '', 0, new HttpHeaders());
		}
	}
	public createFileChunk(chunkSize: number): void {
		this.fileChunks = new FileChunk(this._file, { byteStepSize: chunkSize });
	}
	public getCurrentChunkFile(): any {
		return this.fileChunks.getCurrentRawFileChunk();
	}
	public prepareNextChunk(): void {
		this.fileChunks.prepareNextChunk();
	}
	public getCurrentChunk(): number {
		return this.fileChunks.getCurrentChunk()
	}
	public getTotalChunks(): number {
		return this.fileChunks.getTotalChunks()
	}
	public setIsUploading(val: boolean) {
		this.isUploading = val;
		if (this.fileChunks) {
			this.fileChunks.setUploading(val)
		}
	}
	public set fileChunks(val: FileChunk) {
		this._fileChunks = val;
	}
	public get fileChunks(): FileChunk {
		return this._fileChunks;
	}
	public getId(): any {
		return this.id;
	}
	public setId(id: any) {
		this.id = id;
	}
	public cancel(): void {
		this.uploader.cancelItem(this);
	}
	public remove(): void {
		this.uploader.removeFromQueue(this);
	}
	public removeOnline(): void {
		this.isRemoving = true;
		this.uploader.uploaderService.deleteEntry(this,{},true).subscribe(
			(result:any) => {
				this.isRemoving = false;
				this.remove();
			},
			(error:any) => {
				this.isRemoving = false;
			}
		);
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
	public onSuccess(response: string, status: number, headers: HttpHeaders): any {
		return { response, status, headers };
	}
	public onError(response: string, status: number, headers: HttpHeaders): any {
		return { response, status, headers };
	}
	public onCancel(): any {
		return {};
	}
	public onComplete(response: string, status: number, headers: HttpHeaders): any {
		return { response, status, headers };
	}
	public onCompleteChunk(response: string, status: number, headers: HttpHeaders): any {
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
	public _onSuccess(response: string, status: number, headers: HttpHeaders): void {
		this.isReady = false;
		this.isUploading = false;
		this.isUploaded = true;
		this.isSuccess = true;
		this.isCancel = false;
		this.isError = false;
		this.progress = 100;
		this.index = void 0;
		this.onSuccess(response, status, headers);
	}
	public _onError(response: string, status: number, headers: HttpHeaders): void {
		this.isReady = false;
		this.isUploading = false;
		this.isUploaded = true;
		this.isSuccess = false;
		this.isCancel = false;
		this.isError = true;
		this.progress = 0;
		this.index = void 0;
		this.onError(response, status, headers);
	}
	public _onCancel(): void {
		this.isReady = false;
		this.isUploading = false;
		this.isUploaded = false;
		this.isSuccess = false;
		this.isCancel = true;
		this.isError = false;
		this.progress = 0;
		this.index = void 0;
		this.onCancel();
	}
	public _onComplete(response: string, status: number, headers: HttpHeaders): void {
		this.onComplete(response, status, headers);

		if (this.uploader.options.removeAfterUpload) {
			this.remove();
		}
	}
	public _onCompleteChunk(response: string, status: number, headers: HttpHeaders): void {
		this.chunkRetries = 0;
		this._onCompleteChunkCallNext();
		this.onCompleteChunk(response, status, headers);
	}
	public _onCompleteChunkCallNext(): void {
		this.uploader.uploaderService.uploadFile(this,this.uploader.options);
		this.prepareNextChunk()
	}
	public _onErrorChunk(response: string, status: number, headers: HttpHeaders): void {
		if (this.chunkRetries > this.chunkTotalRetries) {
			this.uploader.onErrorItem(this, response, status, headers);
			this.uploader.onCompleteItem(this, response, status, headers);
		} else {
			this.chunkRetries++;
			this.fileChunks.retrocedeChunk();
			this._onCompleteChunkCallNext();
		}
	}
	public _prepareToUploading(): void {
		this.index = this.index || ++this.uploader._nextIndex;
		this.isReady = true;
	}
}
