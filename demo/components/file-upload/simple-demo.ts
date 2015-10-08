/// <reference path="../../../tsd.d.ts" />

import {
  Component, View, EventEmitter,
  CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass
} from 'angular2/angular2';

import {fileUpload} from '../../../components/index';

// webpack html imports
let template = require('./simple-demo.html');

@Component({
  selector: 'simple-demo'
})
@View({
  template: template,
  directives: [fileUpload, NgClass, CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class SimpleDemo {
}
