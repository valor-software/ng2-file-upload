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
  8. `chunkSize` - Upload files in chunks of this many bytes, one request per chunk. Disabled by default. In multipart mode each chunk is sent as the file field together with `chunkIndex` and `totalChunks` fields (and any `additionalParameter`); with `disableMultipart` the raw chunk is sent with a `Content-Range` header unless you set that header yourself (`formatDataFunction` is not used for chunks).
  9. `chunkRetries` - How many times a failed chunk is retried before the item fails. Only network errors and 408, 429 and 5xx (except 501 and 505) responses are retried. Defaults to 0.
  10. `chunkRetryDelay` - Milliseconds to wait before the first retry, doubled for every further retry and capped at 30 seconds. A `Retry-After` response header takes precedence (cross-origin servers must list it in `Access-Control-Expose-Headers`). Defaults to 1000; 0 retries immediately.
  11. `chunkIndexParam` / `totalChunksParam` - Form field names for the chunk index and total chunk count. Default to `chunkIndex` and `totalChunks`.

  Chunk callbacks on `FileUploader`: `onBeforeUploadChunk(item, chunk)` runs before every chunk request (retries included, with `chunk.retry` increased) and `onSuccessChunk(item, chunk, response, status, headers)` after every successful one. Change `item.url`, `item.method` or `item.headers` in them to target the next chunk request, e.g. with an upload id returned by your server; uploading the item again starts from the values it had before. Callbacks are synchronous, so protocol steps that need their own requests (creating or completing an S3 multipart upload, committing Azure blocks) belong before `upload()` and in `onSuccessItem`. `item.cancel()` stops the remaining chunks, also when called from any callback or while waiting to retry. Chunking needs `isHTML5` (the default).

  With `chunkSize` set, `onBuildItemForm` and the `response` emitter fire once per chunk request (retries included), while `onSuccessItem`, `onErrorItem` and `onCompleteItem` fire once per file. `item.chunk` holds the current chunk, so `onBuildItemForm` can add per-chunk fields, e.g. a file id, byte offset or total size if your server needs to tell parallel uploads apart.

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
