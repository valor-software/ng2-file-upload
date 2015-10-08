/// <reference path="../../tsd.d.ts" />

import {
  Component, View,
  Directive, LifecycleEvent,
  EventEmitter, ElementRef, Renderer,
  CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass
} from 'angular2/angular2';

@Directive({
  selector: '[ng2-file-select]',
  properties: ['config: ng2FileSelect']
})
export class FileSelect {
  public config:any = {};

  constructor(private element:ElementRef, private renderer:Renderer) {
    console.log('it works!');
  }
}

export const fileUpload:Array<any> = [FileSelect];
