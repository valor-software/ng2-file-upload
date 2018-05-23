# ng2-chunk-file-upload [![npm version](https://badge.fury.io/js/ng2-chunk-file-upload.svg)](http://badge.fury.io/js/ng2-chunk-file-upload) [![npm downloads](https://img.shields.io/npm/dm/ng2-chunk-file-upload.svg)](https://npmjs.org/ng2-chunk-file-upload)[![slack](https://ngx-slack.herokuapp.com/badge.svg)](https://ngx-slack.herokuapp.com)
Easy to use Angular2 directives for files upload ([demo](http://valor-software.github.io/ng2-chunk-file-upload/))

[![Angular 2 Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://github.com/mgechev/angular2-style-guide)
[![Build Status](https://travis-ci.org/valor-software/ng2-chunk-file-upload.svg?branch=development)](https://travis-ci.org/valor-software/ng2-chunk-file-upload)
[![Dependency Status](https://david-dm.org/valor-software/ng2-chunk-file-upload.svg)](https://david-dm.org/valor-software/ng2-chunk-file-upload)

## Quick start

1. A recommended way to install ***ng2-chunk-file-upload*** is through [npm](https://www.npmjs.com/search?q=ng2-chunk-file-upload) package manager using the following command:

  `npm i ng2-chunk-file-upload --save`

  Alternatively, you can [download it in a ZIP file](https://github.com/valor-software/ng2-chunk-file-upload/archive/master.zip).

2. Currently `ng2-chunk-file-upload` contains two directives: `ng2-file-select` and `ng2-file-drop`. `ng2-file-select` is used for 'file-input' field of form and
  `ng2-file-drop` is used for area that will be used for dropping of file or files.

3. More information regarding using of ***ng2-chunk-file-upload*** is located in
  [demo](http://valor-software.github.io/ng2-chunk-file-upload/) and [demo sources](https://github.com/valor-software/ng2-chunk-file-upload/tree/master/demo).
  
## Using ***ng2-chunk-file-upload*** in a project

1. Install as shown in the above section.

2. Import `FileUploadModule` into the module that declares the component using ***ng2-chunk-file-upload***:

```import { FileUploadModule } from 'ng2-chunk-file-upload';```

3. Add it to `[imports]` under `@NgModule`:

```imports: [ ... FileUploadModule, ... ]```

4. Import `FileUploader` into the component:

```import {  FileUploader } from 'ng2-chunk-file-upload';```

5. Create a variable for the API url:

```const URL = 'path_to_api';```

6. Initialize it:

```public uploader:FileUploader = new FileUploader({url: URL}); ```

## API for `ng2FileSelect`

### Properties

  - `uploader` - (`FileUploader`) - uploader object. See using in [demo](https://github.com/valor-software/ng2-chunk-file-upload/blob/master/demo/components/file-upload/simple-demo.ts)

### Events
 - `onFileSelected` - fires when files are selected and added to the uploader queue

## API for `ng2FileDrop`

### Properties

  - `uploader` - (`FileUploader`) - uploader object. See using in [demo](https://github.com/valor-software/ng2-chunk-file-upload/blob/master/demo/components/file-upload/simple-demo.ts)

  Parameters supported by this object:

  1. `url` - URL of File Uploader's route
  2. `authToken` - Auth token that will be applied as 'Authorization' header during file send.
  3. `disableMultipart` - If 'true', disable using a multipart form for file upload and instead stream the file. Some APIs (e.g. Amazon S3) may expect the file to be streamed rather than sent via a form. Defaults to false.
  4. `itemAlias` - item alias (form name redefenition)
  5. `formatDataFunction` - Function to modify the request body. 'DisableMultipart' must be 'true' for this function to be called.
  6. `formatDataFunctionIsAsync` - Informs if the function sent in 'formatDataFunction' is asynchronous. Defaults to false.
  7. `parametersBeforeFiles` - States if additional parameters should be appended before or after the file. Defaults to false.
  8. `chunkSize` - The Size of each chunk in Bytes, if this parameter is set the file chunk upload functionality will run. Defaults to Null.
  9. `currentChunkParam` - Parameter Sent with the chunk request, the current chunk number of the file. Defaults to 'current_chunk'.
  10. `totalChunkParam` - Parameter Sent with the chunk request, the total number of chunks of the file. Defaults to 'total_chunks'.
  11. `chunkMethod` - After the first chunk, this method is set. Defaults to 'PUT' because is the standard for update.
  

### Events

  - `fileOver` - it fires during 'over' and 'out' events for Drop Area; returns `boolean`: `true` if file is over Drop Area, `false` in case of out.
  See using in [ts demo](https://github.com/valor-software/ng2-chunk-file-upload/blob/master/demo/components/file-upload/simple-demo.ts) and
  [html demo](https://github.com/valor-software/ng2-chunk-file-upload/blob/master/demo/components/file-upload/simple-demo.html)
  - `onFileDrop` - it fires after a file has been dropped on a Drop Area; you can pass in `$event` to get the list of files that were dropped. i.e. `(onFileDrop)="dropped($event)"`

# Troubleshooting

Please follow this guidelines when reporting bugs and feature requests:

1. Use [GitHub Issues](https://github.com/valor-software/ng2-chunk-file-upload/issues) board to report bugs and feature requests (not our email address)
2. Please **always** write steps to reproduce the error. That way we can focus on fixing the bug, not scratching our heads trying to reproduce it.

Thanks for understanding!

## Using/Sending Chunk Files Feature
  
  If you want to send the files chunked you can just set the chunk paramets on the uploader object

  If your chunk request changes the link after the first request you should use this code
  ```typescript
  this.uploader.onCompleteChunk = (item,response,status,headers)=>{
        response = JSON.parse(response);
        if(response['id']){
            item.url = YOUR_NEW_URL+response['id']+'/';
        }
    }
  ```

### Code snippet on how to use the Chunk File Feature on your code
  ```typescript
    ...
    import { FileUploader } from 'ng2-chunk-file-upload';
    ...
    export class SimpleDemoComponent {
      ...
      uploader:FileUploader;
      ...
      constructor () {
        ...
          this.uploader = new FileUploader({
            url: URL,
            disableMultipart : false,
            isHTML5: true,
            chunkSize: (1024*1024), // 2MB
            currentChunkParam: 'current_chunk',
            totalChunkParam: 'total_chunks',
            chunkMethod: 'PUT',
            //authToken = 'JWT '+TOKEN,
          });
          this.uploader.onBeforeUploadItem = (item) => {
              // If you use credentials this might help you with the "Access-Control-Allow-Origin" error
              item.withCredentials = false;
          };
          this.uploader.onCompleteChunk = (item, response, status, headers) => {
            //Insert the Logic here to start uploading next chunks
            // Example, setting the ID of the File uploaded and chaning the link for the next request
            // In my Case the API is using a put method with the link containing the PK of the object
            response = JSON.parse(response);
            if (response['id']) {
                item.setId(response['id']);
                item.url = this.media_url + item.getId() + '/';
            }
          };
          this.uploader.onErrorItem = (item, response, status, headers) => {
             // Treat the error on the upload
             // On the chunk method we try to upload a chunk for 10 times before triggering this error
          };
          this.uploader.onRemoveItem = (item) => {
             // Treat the file removal from the server
          };
        ...
      }
  ```


### License

The MIT License (see the [LICENSE](https://github.com/valor-software/ng2-chunk-file-upload/blob/master/LICENSE) file for the full text)
