# ng2-file-upload [![npm version](https://badge.fury.io/js/ng2-file-upload.svg)](http://badge.fury.io/js/ng2-file-upload) [![npm downloads](https://img.shields.io/npm/dm/ng2-file-upload.svg)](https://npmjs.org/ng2-file-upload)
Easy to use Angular directives for files upload ([demo](http://valor-software.github.io/ng2-file-upload/))

[![Build Status](https://github.com/valor-software/ng2-file-upload/actions/workflows/on-push-or-pull.yml/badge.svg?branch=development)](https://github.com/valor-software/ng2-file-upload/actions/workflows/on-push-or-pull.yml)

## Quick start

1. A recommended way to install ***ng2-file-upload*** is through [npm](https://www.npmjs.com/search?q=ng2-file-upload) package manager using the following command:

  `npm i ng2-file-upload`

  Alternatively, you can [download it in a ZIP file](https://github.com/valor-software/ng2-file-upload/archive/development.zip).

2. Currently `ng2-file-upload` contains two directives: `ng2-file-select` and `ng2-file-drop`. `ng2-file-select` is used for 'file-input' field of form and
  `ng2-file-drop` is used for area that will be used for dropping of file or files.

3. More information regarding using of ***ng2-file-upload*** is located in
  [demo](http://valor-software.github.io/ng2-file-upload/) and [demo sources](https://github.com/valor-software/ng2-file-upload/tree/development/apps/demo/src/app/components/file-upload).

## Compatibility

| Angular     | ng2-file-upload |
|-------------|-----------------|
| 22.x        | 11.x            |
| 21.x        | 10.x            |
| 20.x        | 9.x             |
| 19.x        | 8.x             |
| 18.x        | 7.x             |
| 17.x        | 6.x             |
| 16.x        | 5.x             |
| 15.x        | 4.x             |
| 14.x        | 3.x             |
| 11.x - 12.x | 2.0.0-x         |
| 2.x - 10.x  | 1.x             |

## Using ***ng2-file-upload*** in a project

1. Install as shown in the above section.

2. Import the directives into a standalone component, or `FileUploadModule` into an `NgModule`:

```typescript
import { Component } from '@angular/core';
import { FileDropDirective, FileSelectDirective, FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-upload',
  imports: [ FileSelectDirective, FileDropDirective ],
  template: `
    <div ng2FileDrop [uploader]="uploader" (fileOver)="over = $event">Drop files here</div>
    <input type="file" ng2FileSelect [uploader]="uploader" multiple />
    <button (click)="uploader.uploadAll()">Upload all</button>
  `
})
export class UploadComponent {
  uploader = new FileUploader({ url: '/api/upload' });
  over = false;
}
```

```typescript
import { FileUploadModule } from 'ng2-file-upload';

@NgModule({ imports: [ FileUploadModule ] })
```

The uploader updates items and progress from XHR callbacks. Apps without zone.js (zoneless change detection, the default for new Angular apps) are not re-rendered by those updates: add `provideZoneChangeDetection()` to the app providers, or call `ChangeDetectorRef.markForCheck()` (or update a signal) from every callback whose state you display, e.g. `onBeforeUploadItem`, `onProgressItem`, `onSuccessItem`, `onErrorItem`, `onCancelItem` and `onCompleteItem`, and after your own calls such as `item.remove()`.

Requests are sent with `withCredentials` on, so a server on another origin must answer with that exact origin in `Access-Control-Allow-Origin` and with `Access-Control-Allow-Credentials: true`. To send requests without credentials, set `item.withCredentials = false` in `onAfterAddingFile`.

To keep uploads running while the user navigates between routes, create the uploader in a service instead of a component.

## API for `ng2FileSelect`

### Properties

  - `uploader` - (`FileUploader`) - the uploader that selected files are added to.

### Events
 - `onFileSelected` - fires when files are selected and added to the uploader queue; `$event` is the selected `FileList` (use `Array.from($event)` for an array). A file removed from the queue can be selected again.

## API for `ng2FileDrop`

### Properties

  - `uploader` - (`FileUploader`) - the uploader that dropped files are added to.

### Events

  - `fileOver` - fires when files are dragged over the drop area (`true`) and when they leave it or are dropped (`false`).
  - `onFileDrop` - fires after files are dropped and added to the uploader queue; `$event` is the dropped `FileList` (use `Array.from($event)` for an array), i.e. `(onFileDrop)="dropped($event)"`.

See the [demo sources](https://github.com/valor-software/ng2-file-upload/tree/development/apps/demo/src/app/components/file-upload) for complete examples.

## API for `FileUploader`

### Options

  `new FileUploader(options)` and `setOptions(options)` accept:

  1. `url` - URL of the upload route (required).
  2. `method` - HTTP method. Defaults to `POST`.
  3. `headers` - Headers sent with every request, as an array of `{ name, value }`.
  4. `authToken` - Value of the auth header sent with every request, including its scheme, e.g. `'Bearer ' + token`.
  5. `authTokenHeader` - Name of that header. Defaults to `Authorization`.
  6. `itemAlias` - Name of the file field in the multipart form. Defaults to `file`.
  7. `additionalParameter` - Extra form fields sent with every file; `{{file_name}}` in a string value is replaced with the file name.
  8. `parametersBeforeFiles` - Sends `additionalParameter` fields before the file instead of after it. Defaults to false.
  9. `disableMultipart` - If true, sends the file itself as the request body instead of a multipart form. Some APIs (e.g. Amazon S3) expect this. Defaults to false.
  10. `formatDataFunction` - Function to modify the request body. `disableMultipart` must be true for this function to be called.
  11. `formatDataFunctionIsAsync` - Informs if the function sent in `formatDataFunction` is asynchronous. Defaults to false.
  12. `autoUpload` - Uploads files as soon as they are added. Defaults to false.
  13. `removeAfterUpload` - Removes an item from the queue once its upload has finished, whether it succeeded or failed. Defaults to false.
  14. `maxFileSize` - Largest accepted file size in bytes.
  15. `allowedMimeType` - Accepted MIME types, e.g. `['image/png', 'application/pdf']`.
  16. `allowEmptyMimeType` - Whether files with an empty MIME type pass `allowedMimeType`. Browsers report an empty type when the operating system does not know the extension, which differs between systems (e.g. `.7z`, `.mkv` or old Office files on some machines). Defaults to true. Set it to false to accept only the listed types; to accept untyped files with certain extensions instead, keep it true and add your own filter that checks the extension of files without a type.
  17. `allowedFileType` - Accepted file classes: `image`, `video`, `audio`, `pdf`, `compress`, `doc`, `xls`, `ppt`, or `application` for anything else. The class comes from the MIME type, then from the file extension.
  18. `queueLimit` - Largest number of items in the queue.
  19. `filters` - Your own filters, as `{ name, fn: (file: FileLikeObject, options) => boolean }`.

  `setOptions` merges the given options into the current ones, so pass only what changes (plus `url`, which the type requires). It also resets `item.url` of every queued item to the new `url`. Filters apply to files added afterwards.

### Properties and methods

  - `queue` - the `FileItem`s added to the uploader. Each item has the file's `name`, `size` and `type` in `item.file`, the `File` itself in `item._file`, its `progress` (0 to 100), the state flags `isReady`, `isUploading`, `isUploaded`, `isSuccess`, `isError` and `isCancel`, and `upload()`, `cancel()` and `remove()` methods. `item.url`, `item.method`, `item.headers` and `item.withCredentials` apply to that item's requests.
  - `progress` - progress of the whole queue (0 to 100); `isUploading` - whether a request is in progress.
  - `addToQueue(files)` - adds a `FileList` or an array of `File`s, applying the filters.
  - `uploadAll()` / `cancelAll()` - uploads, or cancels, every item that has not been uploaded. Items upload one at a time; cancelling an item that is waiting for its turn takes it out of the queue without a request.
  - `removeFromQueue(item)` / `clearQueue()` - removes items, cancelling an upload in progress.
  - `response` - an `EventEmitter` with the response text of every request.

### Callbacks

  Assign these to react to the queue. Each is a single property, so put all your handling for an event in one function.

  - `onAfterAddingFile(item)` / `onAfterAddingAll(items)` - after files pass the filters and are added.
  - `onWhenAddingFileFailed(file, filter, options)` - when a file is rejected; `filter.name` is `fileSize`, `mimeType`, `fileType`, `queueLimit` or the name of your own filter.
  - `onBuildItemForm(item, form)` - before a multipart request is sent; append your own fields to the `FormData`.
  - `onBeforeUploadItem(item)` - before an item is uploaded; change `item.url`, `item.method` or `item.headers` here.
  - `onProgressItem(item, progress)` / `onProgressAll(progress)` - upload progress, 0 to 100.
  - `onSuccessItem`, `onErrorItem`, `onCancelItem`, `onCompleteItem` - `(item, response, status, headers)` when an item finishes; `onCompleteItem` follows each of the others. Status `0` means there was no response: a network error, a request blocked by CORS, or an error thrown by a callback before the request was sent.
  - `onCompleteAll()` - when no more items are waiting.

  An error thrown by a callback is rethrown after the item is finished, so the queue still moves on and the error reaches your error handling. An error thrown before the request is sent (e.g. in `onBeforeUploadItem` or `onBuildItemForm`) fails the item with status `0` and is rethrown from the call that started the upload, such as `uploadAll()`, `item.upload()` or `addToQueue()` with `autoUpload`, or, when the item was waiting in the queue, from the response handling of the item before it.

## Chunked uploads

  Use `ChunkedFileUploader` (a `FileUploader` subclass) instead of `FileUploader` to send large files in several requests. It works with the same directives, options and callbacks; without a positive `chunkSize` (missing, 0, negative or `NaN`) it behaves exactly like `FileUploader` and sends each file in one request.

  The demo's "Chunked" tab shows a complete example: retargeting chunks to an upload id, app-side retries with `resumeItem`, and a backend that reassembles the file.

  ```typescript
  uploader = new ChunkedFileUploader({ url: URL, chunkSize: 2 * 1024 * 1024 });
  ```

  Additional options:

  1. `chunkSize` - Bytes per request, rounded down to a whole number and fixed when an upload starts; other options apply to each request. Multipart requests send any fields added in `onBuildItemForm`, then `chunkIndex` and `totalChunks` fields, then the chunk as the file field; with `disableMultipart` the raw chunk is sent with a `Content-Range: bytes <first>-<last>/<file size>` header (inclusive byte positions; `bytes */0` for an empty file) unless you set one (`formatDataFunction` is not used). An empty file is sent as one empty chunk.
  2. `chunkIndexParam` / `totalChunksParam` - Names of those form fields. Default to `chunkIndex` and `totalChunks`.

  Additional callbacks and methods:

  - `onBeforeUploadChunk(item, chunk)` - before each chunk request; change `item.url`, `item.method` or `item.headers` (an array of `{ name, value }`) here to change that request.
  - `onSuccessChunk(item, chunk, response, status, headers)` - after each successful chunk. Change `item.url`, `item.method` or `item.headers` here to target the next chunk, e.g. with an upload id from your server. They stay changed, so reset them before uploading the item from the start again; `setOptions` also resets `item.url` and `item.method` for every queued item.
  - `onErrorChunk(item, chunk, response, status, headers)` - when a chunk fails; the item then fails as usual (`onErrorItem`, `onCompleteItem`) with the same response and no more chunks are sent.
  - `getChunk(item)` - the chunk being sent, or the one `resumeItem` will send next; `undefined` before the item starts and once the file is uploaded.
  - `resumeItem(item)` - uploads a failed or cancelled item again, starting from the chunk that did not complete (an item that never started or was uploaded starts from the beginning). It is ignored while the item is uploading, so call it from `onErrorItem` or later, not from `onErrorChunk`, and keep `removeAfterUpload` off so failed items stay in the queue.
  - `resumeAll()` - like `uploadAll()`, but it also includes failed items (`uploadAll()` skips them), and failed or cancelled items continue from the chunk that did not complete. `item.upload()` and `uploadAll()` always start an item from the first chunk.

  A chunk is `{ index, total, start, end, blob }`: `index` counts from 0 to `total - 1`, and `start` / `end` are byte offsets in the file, `end` exclusive.

  A failed or cancelled item keeps the progress of the chunk it will resume from, i.e. of the chunks the server has confirmed, so a paused upload does not drop back to 0%. When a chunk fails partway, the progress steps back to the start of that chunk without an `onProgressItem` call, so read `item.progress` after `onErrorItem` / `onCancelItem` rather than keeping the last reported value. `uploader.progress` counts such items with the progress they keep.

  A typical setup sends the first chunk to an endpoint that answers with an upload id, sends the rest of the file there, and retries transient failures from the failed chunk with backoff. Assign each callback once, and set `item.url` and `item.method` in `onBeforeUploadChunk` from your own state, so a resumed, restarted or `setOptions`-reset item always goes to the right place:

  ```typescript
  const sessions = new WeakMap<FileItem, string>();
  const retries = new WeakMap<FileItem, number>();

  uploader.onBeforeUploadChunk = (item, chunk) => {
    const id = chunk.index > 0 ? sessions.get(item) : undefined;
    item.url = id ? `/sessions/${ id }` : '/sessions';
    item.method = id ? 'PUT' : 'POST';
  };

  uploader.onSuccessChunk = (item, chunk, response) => {
    retries.delete(item);
    if (chunk.index === 0) {
      sessions.set(item, JSON.parse(response).uploadId);
    }
  };

  uploader.onErrorItem = (item, response, status) => {
    const count = retries.get(item) ?? 0;
    const transient = status === 0 || status === 408 || status === 429 || status >= 500;
    if (transient && count < 5) {
      retries.set(item, count + 1);
      setTimeout(() => uploader.resumeItem(item), 1000 * 2 ** count);
    }
  };
  ```

  `WeakMap`s drop the entries of items removed from the queue, and a restarted upload replaces the old upload id when its first chunk succeeds.

  The retry budget resets after every successful chunk, so a large file is not given up on after a few unrelated failures. Status `0` means no response: a dropped connection or an offline browser, but also a request blocked by CORS or a callback that threw, which fail the same way on every attempt until the budget runs out. If the user can pause an item, clear its pending retry timer at that point, otherwise the timer resumes it; `resumeItem` ignores items removed from the queue.

  Each attempt reports the item again (`onErrorItem`, `onCompleteItem`, and `onCompleteAll` when no other item is waiting) and queues the item behind items that are already waiting. Because `onCompleteAll` also fires while a retry is pending, check the queue (e.g. `uploader.queue.every(item => item.isSuccess)`) before showing the upload as finished.

  `onBuildItemForm` and the `response` emitter fire once per chunk, `onBuildItemForm` after `onBeforeUploadChunk` and only for multipart requests; the other item callbacks fire once per file, and `onSuccessItem` / `onErrorItem` receive the response of the last chunk sent. Chunk requests carry only the chunk fields, so if your server needs to tell files apart, use an upload id as above, add a field in `onBuildItemForm`, or, with `disableMultipart`, add a header in `onBeforeUploadChunk`.

  `item.cancel()` stops the remaining chunks. From `onSuccessChunk` of the last chunk it has no effect (the file is uploaded), and from `onErrorChunk` the item stays failed.

  A chunk callback that throws fails the item with status `0`, without calling `onErrorChunk`, and the error is rethrown, except before the first request, where it is handled like an error in `onBeforeUploadItem`. Resuming resends that chunk, so servers should accept a repeated chunk.

# Troubleshooting

Please follow these guidelines when reporting bugs and feature requests:

1. Use [GitHub Issues](https://github.com/valor-software/ng2-file-upload/issues) board to report bugs and feature requests (not our email address)
2. Please **always** write steps to reproduce the error. That way we can focus on fixing the bug, not scratching our heads trying to reproduce it.

Thanks for understanding!

### License

The MIT License (see the [LICENSE](https://github.com/valor-software/ng2-file-upload/blob/development/LICENSE) file for the full text)
