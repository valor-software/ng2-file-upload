### Usage
```typescript
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload/ng2-file-upload';
```

### Annotations
```typescript
// class FileSelectDirective
@Directive({ selector: '[ng2FileSelect]' })
```

```typescript
// class FileDropDirective
@Directive({ selector: '[ng2FileDrop]' })
```

## FileSelect API

### Properties

  - `uploader` - (`FileUploader`) - uploader object. See using in [demo](https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.ts)

  Parameters supported by this object:

  1. `url` - URL of File Uploader's route
  2. `authToken` - auth token that will be applied as 'Authorization' header during file send.
  3. `disableMultipart` - If 'true', disable using a multipart form for file upload and instead stream the file. Some APIs (e.g. Amazon S3) may expect the file to be streamed rather than sent via a form. Defaults to false.
  4. `itemAlias` - item alias (form name redefenition)
  5. `formatDataFunction` - Function to modify the request body. 'DisableMultipart' must be 'true' for this function to be called.
  6. `formatDataFunctionIsAsync` - Informs if the function sent in 'formatDataFunction' is asynchronous. Defaults to false.
  7. `parametersBeforeFiles` - States if additional parameters should be appended before or after the file. Defaults to false.

### Events
 - `onFileSelected` - fires when files are selected and added to the uploader queue

## FileDrop API

### Properties

  - `uploader` - (`FileUploader`) - uploader object. See using in [demo](https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.ts)

### Events

  - `fileOver` - it fires during 'over' and 'out' events for Drop Area; returns `boolean`: `true` if file is over Drop Area, `false` in case of out.
  See using in [ts demo](https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.ts) and
  [html demo](https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.html)
  - `onFileDrop` - it fires after a file has been dropped on a Drop Area; you can pass in `$event` to get the list of files that were dropped. i.e. `(onFileDrop)="dropped($event)"`

## Chunked uploads

  Use `ChunkedFileUploader` (a `FileUploader` subclass) instead of `FileUploader` to send large files in several requests. It works with the same directives, options and callbacks; without `chunkSize` it behaves exactly like `FileUploader`.

  ```typescript
  uploader = new ChunkedFileUploader({ url: URL, chunkSize: 2 * 1024 * 1024 });
  ```

  Additional options:

  1. `chunkSize` - Bytes per request, fixed when an upload starts; other options apply to each request. Multipart requests send the chunk as the file field, preceded by `chunkIndex` and `totalChunks` fields; with `disableMultipart` the raw chunk is sent with a `Content-Range` header unless you set one (`formatDataFunction` is not used).
  2. `chunkIndexParam` / `totalChunksParam` - Names of those form fields. Default to `chunkIndex` and `totalChunks`.

  Additional callbacks and methods:

  - `onBeforeUploadChunk(item, chunk)` - before each chunk request; change `item.url`, `item.method` or `item.headers` here to change that request.
  - `onSuccessChunk(item, chunk, response, status, headers)` - after each successful chunk. Change `item.url`, `item.method` or `item.headers` here to target the next chunk, e.g. with an upload id from your server. They stay changed, so reset them before uploading the item from the start again; `setOptions` also resets `item.url` for every queued item.
  - `onErrorChunk(item, chunk, response, status, headers)` - when a chunk fails; the item then fails as usual (`onErrorItem`, `onCompleteItem`) with the same response and no more chunks are sent.
  - `getChunk(item)` - the chunk being sent, or the one `resumeItem` will send next; `undefined` once the file is uploaded.
  - `resumeItem(item)` - uploads a failed or cancelled item again, starting from the chunk that did not complete (an uploaded item starts over). It is ignored while the item is uploading, so call it from `onErrorItem` or later, not from `onErrorChunk`, and keep `removeAfterUpload` off so failed items stay in the queue:

  ```typescript
  const retries = new Map<FileItem, number>();
  uploader.onErrorItem = (item, response, status) => {
    const count = retries.get(item) ?? 0;
    if (status >= 500 && count < 3) {
      retries.set(item, count + 1);
      setTimeout(() => uploader.resumeItem(item), 1000);
    }
  };
  ```

  Each attempt reports the item again (`onErrorItem`, `onCompleteItem`, and `onCompleteAll` when no other item is waiting), restarts its progress, and queues the item behind items that are already waiting.

  `onBuildItemForm` and the `response` emitter fire once per chunk; the other item callbacks once per file.

  `item.cancel()` stops the remaining chunks. From `onSuccessChunk` of the last chunk it has no effect (the file is uploaded), and from `onErrorChunk` the item stays failed.

  A chunk callback that throws fails the item and the error is rethrown, except before the first request, where it is handled like an error in `onBeforeUploadItem`. Resuming resends that chunk, so servers should accept a repeated chunk.
