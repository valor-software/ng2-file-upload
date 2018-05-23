import { HttpErrorResponse } from '@angular/common/http/src/response';
import { FileUploaderOptions, FileUploader } from './file-uploader.class';
import { FileItem } from './file-item.class';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType } from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { map } from 'rxjs/operators';

export interface UploaderLinksOptions {
	downloadEntry: string;
	updateEntry: string;
	createEntry: string;
	deleteEntry: string;
}

export interface UploaderServiceOptions {
	createMethod: string;
	updateMethod: string;
	authorizationHeaderName?: string;
	tokenPattern?: string;
	token?: string;
	chunkSize?: number;
	totalChunkParamName?: string;
	currentChunkParamName?: string;
	fileParamName?: string;
	idAttribute?: string;
}
@Injectable()
export class FileUploaderService {
	public defaultLinks: UploaderLinksOptions = {
		downloadEntry: '',
		updateEntry: '',
		createEntry: '',
		deleteEntry: ''
	};
	public defaultOptions: UploaderServiceOptions = {
		createMethod: 'POST',
		updateMethod: 'POST',
		authorizationHeaderName: 'Authorization',
		tokenPattern: null,
		token: null,
		chunkSize: 0,
		totalChunkParamName: 'total_chunks',
		currentChunkParamName: 'current_chunk',
		fileParamName: 'file',
		idAttribute: 'id'
	};
	public additionalHeaders:any = {};
	protected cancelError = 'UPLOAD CANCELED';
	protected uploadSubscription: any = null;
	public links: UploaderLinksOptions;
	public options: UploaderServiceOptions;
	private _uploader: FileUploader = null;
	constructor(protected http: HttpClient) {
		this.links = Object.assign({}, this.defaultLinks, this.links);
		this.options = Object.assign({}, this.defaultOptions, this.options);
	}
	get uploader(): FileUploader {
		return this._uploader;
	}
	set uploader(theUploader: FileUploader) {
		this._uploader = theUploader;
	}
	public onBeforeUpload(
		item: FileItem,
		options: FileUploaderOptions
	): Promise<any> {
		const promise = new Promise((resolve, reject) => {
			resolve(true);
		});
		return promise;
	}
	public uploadFile(item: FileItem, options: FileUploaderOptions): void {
		this.onBeforeUpload(item, options).then(() => {
			this._uploadFile(item, options);
		});
	}
	public onBeforeGetDefaultHeaders(): Promise<any> {
		const promise = new Promise((resolve, reject) => {
			resolve(true);
		});
		return promise;
	}
	protected _getDefaultHeaders(): Promise<any> {
		return new Promise((resolve, reject) => {
			this.onBeforeGetDefaultHeaders().then(
				result => {
					const h: any = {};
					if (this.options.tokenPattern && this.options.token) {
						h[
							this.options.authorizationHeaderName
						] = this.options.tokenPattern.replace(
							'#token#',
							this.options.token
						);
					}
					for (const key in this.additionalHeaders) {
						if (this.additionalHeaders.hasOwnProperty(key)) {
							h[key] = this.additionalHeaders[key];
						}
					}
					resolve(h);
				},
				error => {
					reject(error);
				}
			);
		});
	}
	protected _getRequestHeaders(
		item: FileItem,
		options: FileUploaderOptions
	): Promise<any> {
		return new Promise((resolve, reject) => {
			this._getDefaultHeaders().then(
				h => {
					if (options.headers) {
						for (let header of options.headers) {
							h[header.name] = header.value;
						}
					}
					if (item.headers.length) {
						for (let header of item.headers) {
							h[header.name] = header.value;
						}
					}
					resolve(h);
				},
				error => {
					reject(error);
				}
			);
		});
	}

	public buildPackageToSend(item: FileItem, options: FileUploaderOptions) {
		let sendable: FormData = new FormData();
		this.uploader._onBuildItemForm(item, sendable);
		let file: any = null;
		if (this.options.chunkSize > 0) {
			file = item.getCurrentChunkFile();
		} else {
			file = item._file;
		}
		const appendFile = () =>
			sendable.append(this.options.fileParamName, file, item.file.name);
		if (!options.parametersBeforeFiles) {
			appendFile();
		}

		// For AWS, Additional Parameters must come BEFORE Files
		if (options.additionalParameter !== undefined) {
			Object.keys(options.additionalParameter).forEach((key: string) => {
				let paramVal = options.additionalParameter[key];
				// Allow an additional parameter to include the filename
				if (
					typeof paramVal === 'string' &&
					paramVal.indexOf('{{file_name}}') >= 0
				) {
					paramVal = paramVal.replace('{{file_name}}', item.file.name);
				}
				sendable.append(key, paramVal);
			});
		}

		if (this.options.chunkSize > 0 && this.options.totalChunkParamName) {
			sendable.append(
				this.options.totalChunkParamName,
				item.getTotalChunks().toString()
			);
		}
		if (this.options.chunkSize > 0 && this.options.currentChunkParamName) {
			sendable.append(
				this.options.currentChunkParamName,
				(item.getCurrentChunk() + 1).toString()
			);
		}

		if (options.parametersBeforeFiles) {
			appendFile();
		}

		return sendable;
	}

	protected _uploadFile(item: FileItem, options: FileUploaderOptions): void {
		this._getRequestHeaders(item, options).then(
			headers => {
				let request_method = this.options.createMethod;
				let link = this.links.createEntry;
				item.setIsUploading(true);
				if (this.options.chunkSize > 0) {
					try {
						item.getCurrentChunk();
					} catch (err) {
						item.createFileChunk(this.options.chunkSize);
					}
					request_method =
						item.getCurrentChunk() > 0
							? this.options.updateMethod
							: this.options.createMethod;
					link =
						item.getCurrentChunk() > 0
							? this.links.updateEntry
							: this.links.createEntry;
				}
				if (item.getId()) {
					link = link.replace('#id#', item.getId());
				}
				const data = this.buildPackageToSend(item, options);
				const request = new HttpRequest(request_method, link, data, {
					headers: new HttpHeaders(headers),
					reportProgress: true,
					withCredentials: item.withCredentials,
				});
				this.uploadSubscription = this.http.request(request).subscribe(
					(event: any) => {
						this.getEventMessage(event, item);
					},
					(error: any) => {
						if (this.cancelError === error) {
							this.uploader.onAbort(error, item);
						} else {
							this.uploader.onError(error, item);
						}
					}
				);
			},
			error => {}
		);
	}
	public stopUpload() {
		if (this.uploadSubscription && this.uploadSubscription.unsubscribe) {
			this.uploadSubscription.error(this.cancelError);
		}
	}
	private getEventMessage(event: any, item: FileItem) {
		switch (event.type) {
			case HttpEventType.ResponseHeader:
				break;
			case HttpEventType.Sent:
				this.uploader.onStart(event, item);
				break;
			case HttpEventType.UploadProgress:
				this.uploader.onProgress(event, item);
				break;
			case HttpEventType.Response:
				if (this.options.chunkSize > 0) {
					if (item.getCurrentChunk() === 0) {
						const response = event.body;
						if (response[this.options.idAttribute]) {
							item.setId(response[this.options.idAttribute]);
						}
					}
				}
				this.uploader.onLoad(event, item);
				break;
			default:
				break;
		}
	}
	private handleError(item: FileItem) {
		const userMessage = `${item.file.name} upload failed.`;

		return (error: HttpErrorResponse) => {
			this.uploader.onError(error, item);

			const message =
				error.error instanceof Error
					? error.error.message
					: `server returned code ${error.status} with body "${error.error}"`;

			return of (userMessage);
		};
	}

	public deleteEntry(
		item: FileItem,
		options = {},
		skipConfirmation = false
	): Observable <any> {
		if (item.getId() && this.links['deleteEntry']) {
			let link = this.links['deleteEntry'].replace(/#id#/g, item.getId());
			let confirmation = false;
			if (skipConfirmation) {
				confirmation = true;
			} else {
				confirmation = confirm('Are you sure you want to delete this entry?');
			}

			if (confirmation) {
				return this.delete(link, options)
			} else {
				return of(false);
			}
		} else {
			return of(false);
		}
	}

	protected delete(url: string, options = {}): Observable<any> {
		return new Observable((observe:any) => {
			this._getDefaultHeaders().then(
				function(headers: any) {
					return this.http
						.delete(url, { headers: new HttpHeaders(headers) })
						.subscribe(
							(response: Response) => {
								observe.next(response);
							},
							(error: any) => {
								observe.error(error);
							}
						);
				}.bind(this),
				error => {
					observe.error(error);
				}
			);
		});
	}

	/*
		HTTP General methos only bellow
	*/
	protected get(url: string): Observable<any> {
		return new Observable(observe => {
			this._getDefaultHeaders().then(
				function(headers:any) {
					return this.http
						.get(url, { headers: new HttpHeaders(headers) })
						.subscribe(
							(response: Response) => {
								observe.next(response);
							},
							(error: any) => {
								observe.error(error);
							}
						);
				}.bind(this),
				error => {
					observe.error(error);
				}
			);
		});
	}

	public addHeader(name:string = null, value:any = null) {
		this.additionalHeaders[name] = value;
	}

	public removeHeader(name:string = null) {
		if (this.additionalHeaders.hasOwnProperty(name)) {
			delete this.additionalHeaders[name];
		}
	}
}
