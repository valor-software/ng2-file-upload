/// <reference path="../../../tsd.d.ts" />

import {
  Component, View, EventEmitter,
  CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle
} from 'angular2/angular2';

import {FileSelect, FileDrop, FileUploader} from '../../../components/index';

// webpack html imports
let template = require('./simple-demo.html');

const URL = '/api/';
// const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';

@Component({
  selector: 'simple-demo'
})
@View({
  template: template,
  directives: [FileSelect, FileDrop, NgClass, NgStyle, CORE_DIRECTIVES, FORM_DIRECTIVES]
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
