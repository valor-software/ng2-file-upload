import { Component } from '@angular/core';

let doc = require('html-loader!markdown-loader!../../doc.md');

let tabDesc:Array<any> = [
  {
    heading: 'Simple',
    ts: require('!!raw-loader!./file-upload/simple-demo.ts').default,
    html: require('!!raw-loader!./file-upload/simple-demo.html').default,
    js: require('!!raw-loader!./file-upload/file-catcher.js').default
  }
];

@Component({
  selector: 'file-upload-section',
  templateUrl: './file-upload-section.html'
})
export class FileUploadSectionComponent {
  public name:string = 'File Upload';
  public currentHeading:string = 'Simple';
  public doc:string = doc;
  public tabs:any = tabDesc;

  public select(e:any):void {
    if (e.heading) {
      this.currentHeading = e.heading;
    }
  }
}
