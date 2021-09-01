import { Component } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const doc = require('html-loader!markdown-loader!../../doc.md');

const tabDesc: Array<any> = [
  {
    heading: 'Simple',
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    ts: require('!!raw-loader!./file-upload/simple-demo.ts').default,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    html: require('!!raw-loader!./file-upload/simple-demo.html').default,
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    js: require('!!raw-loader!./file-upload/file-catcher.js').default
  }
];

@Component({
  selector: 'file-upload-section',
  templateUrl: './file-upload-section.html'
})
export class FileUploadSectionComponent {
  name = 'File Upload';
  currentHeading = 'Simple';
  doc = doc;
  tabs: any = tabDesc;

  select(e: any): void {
    if (e.heading) {
      this.currentHeading = e.heading;
    }
  }
}
