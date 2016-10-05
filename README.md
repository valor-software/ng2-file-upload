# ng2-file-upload [![npm version](https://badge.fury.io/js/ng2-file-upload.svg)](http://badge.fury.io/js/ng2-file-upload)
Easy to use Angular2 directives for files upload ([demo](http://valor-software.github.io/ng2-file-upload/))

Follow me [![twitter](https://img.shields.io/twitter/follow/valorkin.svg?style=social&label=%20valorkin)](https://twitter.com/valorkin) to be notified about new releases.

[![Angular 2 Style Guide](https://mgechev.github.io/angular2-style-guide/images/badge.svg)](https://github.com/mgechev/angular2-style-guide)
[![Build Status](https://travis-ci.org/valor-software/ng2-file-upload.svg?branch=master)](https://travis-ci.org/valor-software/ng2-file-upload)
[![Code Climate](https://codeclimate.com/github/valor-software/ng2-file-upload/badges/gpa.svg)](https://codeclimate.com/github/valor-software/ng2-file-upload)
[![Join the chat at https://gitter.im/valor-software/ng2-bootstrap](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/valor-software/ng2-bootstrap?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![Dependency Status](https://david-dm.org/valor-software/ng2-file-upload.svg)](https://david-dm.org/valor-software/ng2-file-upload)
[![devDependency Status](https://david-dm.org/valor-software/ng2-file-upload/dev-status.svg)](https://david-dm.org/valor-software/ng2-file-upload#info=devDependencies)
[![Throughput Graph](https://graphs.waffle.io/valor-software/ng2-file-upload/throughput.svg)](https://waffle.io/valor-software/ng2-file-upload/metrics)

## Quick start

1. A recommended way to install ***ng2-file-upload*** is through [npm](https://www.npmjs.com/search?q=ng2-file-upload) package manager using the following command:

  `npm i ng2-file-upload --save`

  Alternatively, you can [download it in a ZIP file](https://github.com/valor-software/ng2-file-upload/archive/master.zip).

2. Currently `ng2-file-upload` contains two directives: `ng2-file-select` and `ng2-file-drop`. `ng2-file-select` is used for 'file-input' field of form and
  `ng2-file-drop` is used for area that will be used for dropping of file or files.

3. More information regarding using of ***ng2-file-upload*** is located in
  [demo](http://valor-software.github.io/ng2-file-upload/) and [demo sources](https://github.com/valor-software/ng2-file-upload/tree/master/demo).

## API for `ng2FileSelect`

### Properties

  - `uploader` - (`FileUploader`) - uploader object. See using in [demo](https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.ts)

## API for `ng2FileDrop`

### Properties

  - `uploader` - (`FileUploader`) - uploader object. See using in [demo](https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.ts)

  Parameters supported by this object:

  1. `url` - URL of File Uploader's route
  2. `authToken` - Auth token that will be applied as 'Authorization' header during file send.
  3. `disableMultipart` - If 'true', disable using a multipart form for file upload and instead stream the file. Some APIs (e.g. Amazon S3) may expect the file to be streamed rather than sent via a form. Defaults to false.
  4. `itemAlias` - item alias (form name redefenition)

### Events

  - `fileOver` - it fires during 'over' and 'out' events for Drop Area; returns `boolean`: `true` if file is over Drop Area, `false` in case of out.
  See using in [ts demo](https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.ts) and
  [html demo](https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.html)

# Troubleshooting

Please follow this guidelines when reporting bugs and feature requests:

1. Use [GitHub Issues](https://github.com/valor-software/ng2-file-upload/issues) board to report bugs and feature requests (not our email address)
2. Please **always** write steps to reproduce the error. That way we can focus on fixing the bug, not scratching our heads trying to reproduce it.

Thanks for understanding!

### License

The MIT License (see the [LICENSE](https://github.com/valor-software/ng2-file-upload/blob/master/LICENSE) file for the full text)
