/// <reference path="../tsd.d.ts" />
import {Component, View, bootstrap, NgClass} from 'angular2/angular2';

import {FileUploadSection} from './components/file-upload-section';

let gettingStarted = require('./getting-started.md');

@Component({
  selector: 'app'
})
@View({
  template: `
  <main class="bd-pageheader">
    <div class="container">
      <h1>ng2-file-upload</h1>
      <p>The Angular2 File Upload directives</p>
      <div class="row">
        <div class="col-lg-2"><a class="btn btn-primary" href="https://github.com/valor-software/ng2-file-upload">View on GitHub</a></div>
        <!--<div class="col-lg-1 btn"><iframe src="https://ghbtns.com/github-btn.html?user=valor-software&repo=ng2-handsontable&type=star&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe></div>
        <div class="col-lg-1 btn"><iframe src="https://ghbtns.com/github-btn.html?user=valor-software&repo=ng2-handsontable&type=fork&count=true" frameborder="0" scrolling="0" width="170px" height="20px"></iframe></div>-->
      </div>
    </div>
  </main>

  <div class="container">
    <section id="getting-started">${gettingStarted}</section>

    <file-upload-section class="col-md-12"></file-upload-section>
  </div>

  <footer class="footer">
    <div class="container">
      <p class="text-muted text-center"><a href="https://github.com/valor-software/ng2-file-upload">ng2-file-upload</a> is maintained by <a href="https://github.com/valor-software">valor-software</a>.</p>
    </div>
  </footer>
  `,
  directives: [
    NgClass,
    FileUploadSection
  ]
})
export class Demo {
}

bootstrap(Demo);
