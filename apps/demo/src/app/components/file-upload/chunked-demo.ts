import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ChunkedFileUploader, FileItem } from 'ng2-file-upload';

// run chunk-catcher.js from the "Backend Demo" tab to try it locally
const URL = 'http://localhost:3000/api/chunks';
const MAX_RETRIES = 3;

@Component({
  selector: 'chunked-demo',
  templateUrl: './chunked-demo.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class ChunkedDemoComponent {

  uploader: ChunkedFileUploader;
  log: string[] = [];

  private retries = new Map<FileItem, number>();

  constructor() {
    this.uploader = new ChunkedFileUploader({
      url: URL,
      chunkSize: 1024 * 1024 // 1 MB per request
    });

    // a fresh upload starts at the base url; a resumed one keeps the upload id
    this.uploader.onBeforeUploadItem = item => {
      if (!this.uploader.getChunk(item)) {
        item.url = URL;
      }
    };

    // the server answers the first chunk with an upload id, the rest of the file goes there
    this.uploader.onSuccessChunk = (item, chunk, response) => {
      if (chunk.index === 0) {
        item.url = `${ URL }/${ JSON.parse(response).id }`;
      }
      this.addLog(`${ item.file.name }: chunk ${ chunk.index + 1 } of ${ chunk.total } uploaded`);
    };

    this.uploader.onErrorChunk = (item, chunk, response, status) => {
      this.addLog(`${ item.file.name }: chunk ${ chunk.index + 1 } failed (${ status || 'network error' })`);
    };

    // retries are up to the app: resume from the failed chunk a few times, waiting longer each time
    this.uploader.onErrorItem = (item, response, status) => {
      const count = this.retries.get(item) ?? 0;
      if ((status === 0 || status >= 500) && count < MAX_RETRIES) {
        this.retries.set(item, count + 1);
        this.addLog(`${ item.file.name }: retry ${ count + 1 } of ${ MAX_RETRIES }`);
        setTimeout(() => this.uploader.resumeItem(item), 1000 * (count + 1));
      }
    };

    this.uploader.onSuccessItem = item => {
      this.retries.delete(item);
      this.addLog(`${ item.file.name }: done`);
    };

    this.uploader.onCancelItem = item => this.addLog(`${ item.file.name }: cancelled`);
  }

  chunkLabel(item: FileItem): string {
    const chunk = this.uploader.getChunk(item);

    return chunk ? `${ chunk.index + 1 } / ${ chunk.total }` : '';
  }

  resume(item: FileItem): void {
    this.retries.delete(item);
    this.uploader.resumeItem(item);
  }

  private addLog(message: string): void {
    this.log = [ message, ...this.log ].slice(0, 20);
  }
}
