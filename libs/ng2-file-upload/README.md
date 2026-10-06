# ng2-file-upload [![npm version](https://badge.fury.io/js/ng2-file-upload.svg)](http://badge.fury.io/js/ng2-file-upload) [![npm downloads](https://img.shields.io/npm/dm/ng2-file-upload.svg)](https://npmjs.org/ng2-file-upload)
Easy to use Angular2 directives for files upload ([demo](http://valor-software.github.io/ng2-file-upload/))

[![Angular 2 Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://github.com/mgechev/angular2-style-guide)
[![Build Status](https://travis-ci.org/valor-software/ng2-file-upload.svg?branch=development)](https://travis-ci.org/valor-software/ng2-file-upload)

## Quick start

1. A recommended way to install ***ng2-file-upload*** is through [npm](https://www.npmjs.com/search?q=ng2-file-upload) package manager using the following command:

  `npm i ng2-file-upload`

  Alternatively, you can [download it in a ZIP file](https://github.com/valor-software/ng2-file-upload/archive/master.zip).

2. Currently `ng2-file-upload` contains two directives: `ng2-file-select` and `ng2-file-drop`. `ng2-file-select` is used for 'file-input' field of form and
  `ng2-file-drop` is used for area that will be used for dropping of file or files.

3. More information regarding using of ***ng2-file-upload*** is located in
  [demo](http://valor-software.github.io/ng2-file-upload/) and [demo sources](https://github.com/valor-software/ng2-file-upload/tree/master/demo).

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

2. Import `FileUploadModule` into the module that declares the component using ***ng2-file-upload***:

```import { FileUploadModule } from 'ng2-file-upload';```

3. Add it to `[imports]` under `@NgModule`:

```imports: [ ... FileUploadModule, ... ]```

4. Import `FileUploader` into the component:

```import {  FileUploader } from 'ng2-file-upload';```

5. Create a variable for the API url:

```const URL = 'path_to_api';```

6. Initialize it:

```public uploader:FileUploader = new FileUploader({url: URL}); ```

The uploader updates items and progress from XHR callbacks. Apps without zone.js (zoneless change detection, the default for new Angular apps) are not re-rendered by those updates: add `provideZoneChangeDetection()` to the app providers, or call `ChangeDetectorRef.markForCheck()` (or update a signal) from the callbacks you display, e.g. `onProgressItem` and `onCompleteItem`.

Requests are sent with `withCredentials` on, so a server on another origin must answer with that exact origin in `Access-Control-Allow-Origin` and with `Access-Control-Allow-Credentials: true`. To send requests without credentials, set `item.withCredentials = false` in `onAfterAddingFile`.

## API for `ng2FileSelect`

### Properties

  - `uploader` - (`FileUploader`) - uploader object. See using in [demo](https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.ts)

### Events
 - `onFileSelected` - fires when files are selected and added to the uploader queue

## API for `ng2FileDrop`

### Properties

  - `uploader` - (`FileUploader`) - uploader object. See using in [demo](https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.ts)

  Parameters supported by this object:

  1. `url` - URL of File Uploader's route
  2. `authToken` - Auth token that will be applied as 'Authorization' header during file send.
  3. `disableMultipart` - If 'true', disable using a multipart form for file upload and instead stream the file. Some APIs (e.g. Amazon S3) may expect the file to be streamed rather than sent via a form. Defaults to false.
  4. `itemAlias` - item alias (form name redefinition)
  5. `formatDataFunction` - Function to modify the request body. 'DisableMultipart' must be 'true' for this function to be called.
  6. `formatDataFunctionIsAsync` - Informs if the function sent in 'formatDataFunction' is asynchronous. Defaults to false.
  7. `parametersBeforeFiles` - States if additional parameters should be appended before or after the file. Defaults to false.

### Events

  - `fileOver` - it fires during 'over' and 'out' events for Drop Area; returns `boolean`: `true` if file is over Drop Area, `false` in case of out.
  See using in [ts demo](https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.ts) and
  [html demo](https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.html)
  - `onFileDrop` - it fires after a file has been dropped on a Drop Area; you can pass in `$event` to get the list of files that were dropped. i.e. `(onFileDrop)="dropped($event)"`

## Chunked uploads

  Use `ChunkedFileUploader` (a `FileUploader` subclass) instead of `FileUploader` to send large files in several requests. It works with the same directives, options and callbacks; without `chunkSize` it behaves exactly like `FileUploader`.

  The demo's "Chunked" tab shows a complete example: retargeting chunks to an upload id, app-side retries with `resumeItem`, and a backend that reassembles the file.

  ```typescript
  uploader = new ChunkedFileUploader({ url: URL, chunkSize: 2 * 1024 * 1024 });
  ```

  Additional options:

  1. `chunkSize` - Bytes per request, fixed when an upload starts; other options apply to each request. Multipart requests send the chunk as the file field, preceded by `chunkIndex` and `totalChunks` fields; with `disableMultipart` the raw chunk is sent with a `Content-Range: bytes <first>-<last>/<file size>` header (inclusive byte positions; `bytes */0` for an empty file) unless you set one (`formatDataFunction` is not used). An empty file is sent as one empty chunk.
  2. `chunkIndexParam` / `totalChunksParam` - Names of those form fields. Default to `chunkIndex` and `totalChunks`.

  Additional callbacks and methods:

  - `onBeforeUploadChunk(item, chunk)` - before each chunk request; change `item.url`, `item.method` or `item.headers` (an array of `{ name, value }`) here to change that request.
  - `onSuccessChunk(item, chunk, response, status, headers)` - after each successful chunk. Change `item.url`, `item.method` or `item.headers` here to target the next chunk, e.g. with an upload id from your server. They stay changed, so reset them before uploading the item from the start again; `setOptions` also resets `item.url` and `item.method` for every queued item.
  - `onErrorChunk(item, chunk, response, status, headers)` - when a chunk fails; the item then fails as usual (`onErrorItem`, `onCompleteItem`) with the same response and no more chunks are sent.
  - `getChunk(item)` - the chunk being sent, or the one `resumeItem` will send next; `undefined` before the item starts and once the file is uploaded.
  - `resumeItem(item)` - uploads a failed or cancelled item again, starting from the chunk that did not complete (an uploaded item starts over). It is ignored while the item is uploading, so call it from `onErrorItem` or later, not from `onErrorChunk`, and keep `removeAfterUpload` off so failed items stay in the queue.
  - `resumeAll()` - like `uploadAll()`, but it also includes failed items (`uploadAll()` skips them), and failed or cancelled items continue from the chunk that did not complete. `item.upload()` and `uploadAll()` always start an item from the first chunk.

  A chunk is `{ index, total, start, end, blob }`: `index` counts from 0 to `total - 1`, and `start` / `end` are byte offsets in the file, `end` exclusive.

  A failed or cancelled item keeps the progress of the chunk it will resume from, i.e. of the chunks the server has confirmed, so a paused upload does not drop back to 0%. When a chunk fails partway, the progress steps back to the start of that chunk without an `onProgressItem` call, so read `item.progress` after `onErrorItem` / `onCancelItem` rather than keeping the last reported value.

  A typical setup sends the first chunk to an endpoint that answers with an upload id, sends the rest of the file there, and retries transient failures from the failed chunk with backoff. Assign each callback once, and set `item.url` and `item.method` in `onBeforeUploadChunk` from your own state, so a resumed, restarted or `setOptions`-reset item always goes to the right place:

  ```typescript
  const sessions = new Map<FileItem, string>();
  const retries = new Map<FileItem, number>();

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

  The retry budget resets after every successful chunk, so a large file is not given up on after a few unrelated failures. Status `0` means no response: a dropped connection or an offline browser, but also a request blocked by CORS or a callback that threw before the first request, which fail the same way on every attempt until the budget runs out. If the user can pause an item, clear its pending retry timer at that point, otherwise the timer resumes it; `resumeItem` ignores items removed from the queue.

  Each attempt reports the item again (`onErrorItem`, `onCompleteItem`, and `onCompleteAll` when no other item is waiting) and queues the item behind items that are already waiting. Because `onCompleteAll` also fires while a retry is pending, check the queue (e.g. `uploader.queue.every(item => item.isSuccess)`) before showing the upload as finished.

  `onBuildItemForm` and the `response` emitter fire once per chunk, `onBuildItemForm` after `onBeforeUploadChunk` and only for multipart requests; the other item callbacks fire once per file, and `onSuccessItem` / `onErrorItem` receive the response of the last chunk sent. Chunk requests carry only the chunk fields, so if your server needs to tell files apart, use an upload id as above, add a field in `onBuildItemForm`, or, with `disableMultipart`, add a header in `onBeforeUploadChunk`.

  `item.cancel()` stops the remaining chunks. From `onSuccessChunk` of the last chunk it has no effect (the file is uploaded), and from `onErrorChunk` the item stays failed.

  A chunk callback that throws fails the item and the error is rethrown, except before the first request, where it is handled like an error in `onBeforeUploadItem`. Resuming resends that chunk, so servers should accept a repeated chunk.

# Troubleshooting

Please follow these guidelines when reporting bugs and feature requests:

1. Use [GitHub Issues](https://github.com/valor-software/ng2-file-upload/issues) board to report bugs and feature requests (not our email address)
2. Please **always** write steps to reproduce the error. That way we can focus on fixing the bug, not scratching our heads trying to reproduce it.

Thanks for understanding!

### License

The MIT License (see the [LICENSE](https://github.com/valor-software/ng2-file-upload/blob/master/LICENSE) file for the full text)
