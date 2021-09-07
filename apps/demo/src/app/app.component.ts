import { Component } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const gettingStarted = require('html-loader!markdown-loader!../getting-started.md');

@Component({
  selector: 'app',
  template: `
  <main class="bd-pageheader">
    <div class="container">
      <div class="row">
        <h1>ng2-file-upload</h1>
        <p>The Angular2 File Upload directives</p>
        <p>
          <a class="btn btn-light w-auto" href="https://github.com/valor-software/ng2-file-upload">View on GitHub</a>
        </p>
      </div>
      <div class="row" style="padding-top: 15px">
        <div class="d-flex flex-wrap">
          <a href="https://npmjs.org/ng2-file-upload" class="me-2 d-flex mb-2">
            <img src="https://img.shields.io/npm/v/ng2-file-upload/latest.svg" alt="npm latest version" >
          </a>
          <a href="https://npmjs.org/ng2-file-upload" class="me-2 d-flex mb-2">
            <img src="https://img.shields.io/npm/v/ng2-file-upload/next.svg" alt="npm next version" >
          </a>
          <iframe src="https://ghbtns.com/github-btn.html?user=valor-software&repo=ng2-file-upload&type=star&count=true" frameborder="0" scrolling="0" width="100px" height="20px" class="me-2 mb-2"></iframe>
          <iframe src="https://ghbtns.com/github-btn.html?user=valor-software&repo=ng2-file-upload&type=fork&count=true" frameborder="0" scrolling="0" width="100px" height="20px" class="mb-2"></iframe>
        </div>
      </div>
    </div>
  </main>

  <div class="container">
    <section id="getting-started" [innerHtml]="gettingStarted"></section>

    <file-upload-section class="col-md-12"></file-upload-section>
  </div>

  <footer class="footer">
    <div class="container">
      <p class="text-muted text-center"><a href="https://github.com/valor-software/ng2-file-upload">ng2-file-upload</a> is maintained by <a href="https://github.com/valor-software">valor-software</a>.</p>
    </div>
  </footer>
  `
})
export class AppComponent {
  public gettingStarted:string = gettingStarted;
  public ngAfterContentInit(): any {
    setTimeout(()=>{
      if (typeof PR !== 'undefined') {
        // google code-prettify
        PR.prettyPrint();
      }
    }, 150);
  }
}
