/// <reference path="../../../tsd.d.ts" />

import {Component} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle} from 'angular2/common';
import {FILE_UPLOAD_DIRECTIVES, FileUploader} from '../../../ng2-file-upload';

// webpack html imports
let template = require('./simple-demo.html');

// const URL = '/api/';
const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'simple-demo',
  template: template,
  directives: [FILE_UPLOAD_DIRECTIVES, NgClass, NgStyle, CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class SimpleDemo {
  private uploader:FileUploader = new FileUploader({url: URL});
  private hasBaseDropZoneOver:boolean = false;
  private hasAnotherDropZoneOver:boolean = false;

  private fileOverBase(e:any) {
    this.hasBaseDropZoneOver = e;
  }

  private fileOverAnother(e:any) {
    this.hasAnotherDropZoneOver = e;
  }
}
