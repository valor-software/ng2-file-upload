export class FileChunk {
	public stepSize: number = 1024 * 1024 * 3;
	public rawFile: any = null;
	public uploadProgress: number = null;
	public uploading: boolean = null;
	public uploadComplete: boolean = null;
	public byteStepSize: number = null;
	public totalSize: number = null;
	public startByte: number = null;
	public endByte: number = null;
	public currentChunk: number = 0;
	public totalChunks: number = null;
	public uniqueIdentifier: string = null;
	public totalSent: number = null;
	public extraData: any = {};

	constructor(rawFile: any, options: any = {}) {
		this.setByteStepSize(this.stepSize);
		if (typeof options !== 'undefined') {
			if (typeof options.byteStepSize !== 'undefined') {
				this.setByteStepSize(options.byteStepSize);
			}
		}
		this.setRawFile(rawFile);

		this.setRawFile(rawFile);
		this.setUploadProgress(0);
		this.setUploading(false);
		this.setUploadComplete(false);
		this.setTotalSize(this.getRawFile().size);
		this.setStartByte(0);
		this.setEndByte(this.getByteStepSize());
		this.setCurrentChunk(0);
		if (!this.getBrowserSliceMethod()) {
			this.setTotalChunks(1);
		} else {
			this.setTotalChunks(Math.ceil(this.totalSize / this.byteStepSize));
		}
		this.setUniqueIdenfier(this.generateUniqueIdentifier());
		this.setTotalSent(0);
	}

	public setExtraData(index: any, value: any) {
		this.extraData[index] = value;
	}

	public getExtraData(index: any) {
		return this.extraData[index];
	}

	//getters and setters
	public setProgress(v: number) {
		this.uploadProgress = v;
	}

	public getProgress():number {
		return this.uploadProgress;
	}

	public setUploading(v: boolean) {
		this.uploading = v;
	}

	public getUploading():boolean {
		return this.uploading;
	}

	public getUploadComplete():boolean {
		return this.uploadComplete;
	}

	public setUploadComplete(v: boolean) {
		this.uploadComplete = v;
	}

	public setUploadProgress(v: number) {
		this.uploadProgress = v;
	}

	public getUploadProgress():number {
		return this.uploadProgress;
	}

	public getStartByte():number {
		return this.startByte;
	}

	public setStartByte(v: number) {
		this.startByte = v;
	}

	public getEndByte():number {
		return this.endByte;
	}

	public setEndByte(v: number) {
		this.endByte = v;
	}

	public getByteStepSize():number {
		return this.byteStepSize;
	}

	public setByteStepSize(v: number) {
		this.byteStepSize = v;
	}

	public setTotalSize(v: number) {
		this.totalSize = v;
	}

	public getTotalSize():number {
		return this.totalSize;
	}

	public getRawFile():any {
		return this.rawFile;
	}

	public setRawFile(v: File) {
		this.rawFile = v;
	}

	public getCurrentChunk():number {
		return this.currentChunk;
	}

	public setCurrentChunk(v: number) {
		this.currentChunk = v;
	}

	public getTotalChunks():number {
		return this.totalChunks;
	}

	public setTotalChunks(v: number) {
		this.totalChunks = v;
	}

	public setUniqueIdenfier(v: string) {
		this.uniqueIdentifier = v;
	}

	public getUniqueIdenfier():string {
		return this.uniqueIdentifier;
	}

	public getRawFileExtension() {
		const extension = this.getRawFileName().split('.');
		return extension[extension.length - 1];
	}

	public getRawFileName() {
		return this.getRawFile().name;
	}

	public getContentType() {
		return this.getRawFile().type;
	}

	public getTotalSent() {
		return this.totalSent;
	}

	public setTotalSent(v: number) {
		this.totalSent = v;
	}

	public getCurrentRawFileChunk() {
		if (!this.getBrowserSliceMethod()) {
			return this.getRawFile();
		}
		else {
			return this.getRawFile()[this.getBrowserSliceMethod()](this.getStartByte(), this.getEndByte());
		}
	}

	public retrocedeChunk() {
		if (!this.getBrowserSliceMethod()) {
			return false;
		}

		this.setEndByte(this.getStartByte());
		this.setStartByte(this.getStartByte() - this.getByteStepSize());
		this.setCurrentChunk(this.getCurrentChunk() - 1);

		if (this.getTotalSent() != 0) {
			this.setTotalSent(this.getTotalSent() - this.getByteStepSize());
		}
	}

	public prepareNextChunk() {
		if (!this.getBrowserSliceMethod()) {
			return false;
		}
		if (this.getEndByte() > this.getTotalSize() && this.getCurrentChunk() < this.getTotalChunks()) { // finished
			return false;
		}
		this.setStartByte(this.getEndByte());
		this.setEndByte(this.getEndByte() + this.getByteStepSize());
		this.setCurrentChunk(this.getCurrentChunk() + 1);
		if (this.getEndByte() > this.getTotalSize() && this.getCurrentChunk() === this.getTotalChunks()) {
			// something went wrong with the calculations
			this.setEndByte(this.getTotalSize());
		}
		return true;
	}

	public getBrowserSliceMethod(): string {
		if (this.rawFile && typeof this.rawFile !== 'undefined') {
			if (this.rawFile.slice && typeof this.rawFile.slice === 'function') {
				return 'slice';
			}
			else if (this.rawFile.mozSlice && typeof this.rawFile.mozSlice === 'function') {
				return 'mozSlice';
			}
			else if (this.rawFile.webkitSlice && typeof this.rawFile.webkitSlice === 'function') {
				return 'webkitSlice';
			}
		}
		else {
			return null;
		}
	}//getBrowserSliceMethod() ends here

	public generateUniqueIdentifier(): string {
		let d = new Date().getTime();
		if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
			d += performance.now(); // use high-precision timer if available
		}
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			const r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
	}

}




