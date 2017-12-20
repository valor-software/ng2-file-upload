# ng2-file-upload [![npm version](https://badge.fury.io/js/ng2-file-upload.svg)](http://badge.fury.io/js/ng2-file-upload) [![npm downloads](https://img.shields.io/npm/dm/ng2-file-upload.svg)](https://npmjs.org/ng2-file-upload)[![slack](https://ngx-slack.herokuapp.com/badge.svg)](https://ngx-slack.herokuapp.com)
Easy to use Angular2 directives for files upload ([demo](http://valor-software.github.io/ng2-file-upload/))

[![Angular 2 Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://github.com/mgechev/angular2-style-guide)
[![Build Status](https://travis-ci.org/valor-software/ng2-file-upload.svg?branch=development)](https://travis-ci.org/valor-software/ng2-file-upload)
[![Dependency Status](https://david-dm.org/valor-software/ng2-file-upload.svg)](https://david-dm.org/valor-software/ng2-file-upload)

## Quick start

1. A recommended way to install ***ng2-file-upload*** is through [npm](https://www.npmjs.com/search?q=ng2-file-upload) package manager using the following command:

  `npm i ng2-file-upload --save`

  Alternatively, you can [download it in a ZIP file](https://github.com/valor-software/ng2-file-upload/archive/master.zip).

2. Currently `ng2-file-upload` contains two directives: `ng2-file-select` and `ng2-file-drop`. `ng2-file-select` is used for 'file-input' field of form and
  `ng2-file-drop` is used for area that will be used for dropping of file or files.

3. More information regarding using of ***ng2-file-upload*** is located in
  [demo](http://valor-software.github.io/ng2-file-upload/) and [demo sources](https://github.com/valor-software/ng2-file-upload/tree/master/demo).
  
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

## Using ***ng2-file-upload*** with multiple uploads and other parameters
To add extra information (i.e. title, description) when uploading multiple files:

In your template:
```
<tr *ngFor="let item of uploader.queue">
                            <td><strong>{{ item?.file?.name }}</strong></td>

                            **<td><input type="text" [(ngModel)]="item.formData['title']" placeholder="Title of File"></td>**
                            **<td><input type="text" [(ngModel)]="item.formData['description']" placeholder="File Description"></td>**
                            <td nowrap>{{ item?.file?.size/1024/1024 | number:'.2' }} MB</td>
                            <td >
                                <div class="progress" style="margin-bottom: 0;">
                                    <div class="progress-bar" role="progressbar" [ngStyle]="{ 'width': item.progress + '%' }"></div>
                                </div>
                            </td>
                            <td class="text-center">
                                <span *ngIf="item.isSuccess"><i class="glyphicon glyphicon-ok"></i></span>
                                <span *ngIf="item.isCancel"><i class="glyphicon glyphicon-ban-circle"></i></span>
                                <span *ngIf="item.isError"><i class="glyphicon glyphicon-remove"></i></span>
                            </td>
                            <td nowrap>
                                <button type="button" class="btn btn-success btn-xs"
                                        (click)="item.upload()" [disabled]="item.isReady || item.isUploading || item.isSuccess">
                                    <span class="glyphicon glyphicon-upload"></span> Upload
                                </button>
                                <button type="button" class="btn btn-warning btn-xs"
                                        (click)="item.cancel()" [disabled]="!item.isUploading">
                                    <span class="glyphicon glyphicon-ban-circle"></span> Cancel
                                </button>
                                <button type="button" class="btn btn-danger btn-xs"
                                        (click)="item.remove()">
                                    <span class="glyphicon glyphicon-trash"></span> Remove
                                </button>
                            </td>

                        </tr>
```
You can add inputs outside of a form, and use ```[(ngModel)]``` to add keys to the ```item``` object.

```
                            **<td><input type="text" [(ngModel)]="item.formData['title']" placeholder="Title of File"></td>**
                            **<td><input type="text" [(ngModel)]="item.formData['description']" placeholder="File Description"></td>**
```
Inside your upload component, add the following:

```
    this.uploader.onBuildItemForm = (item, form) => {
      form.append('title', item.formData.title);
      form.append('description', item.formData.description);
      console.log(item);
    };

```
If you are using `Node.js` with `multer`, the extra information will not show up in the `req.files` object. You will have to pull the data from the `req.body` object.


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
  4. `itemAlias` - item alias (form name redefenition)
  5. `formatDataFunction` - Function to modify the request body. 'DisableMultipart' must be 'true' for this function to be called.
  6. `formatDataFunctionIsAsync` - Informs if the function sent in 'formatDataFunction' is asynchronous. Defaults to false.
  7. `parametersBeforeFiles` - States if additional parameters should be appended before or after the file. Defaults to false.

### Events

  - `fileOver` - it fires during 'over' and 'out' events for Drop Area; returns `boolean`: `true` if file is over Drop Area, `false` in case of out.
  See using in [ts demo](https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.ts) and
  [html demo](https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.html)
  - `onFileDrop` - it fires after a file has been dropped on a Drop Area; you can pass in `$event` to get the list of files that were dropped. i.e. `(onFileDrop)="dropped($event)"`

# Troubleshooting

Please follow this guidelines when reporting bugs and feature requests:

1. Use [GitHub Issues](https://github.com/valor-software/ng2-file-upload/issues) board to report bugs and feature requests (not our email address)
2. Please **always** write steps to reproduce the error. That way we can focus on fixing the bug, not scratching our heads trying to reproduce it.

Thanks for understanding!

### License

The MIT License (see the [LICENSE](https://github.com/valor-software/ng2-file-upload/blob/master/LICENSE) file for the full text)
