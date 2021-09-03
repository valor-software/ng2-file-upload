import { Component } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const gettingStarted = require('html-loader!markdown-loader!../getting-started.md');

@Component({
  selector: 'app',
  template: `
  <main class="bd-pageheader">
    <div class="container">
      <h1>ng2-file-upload</h1>
      <p>The Angular2 File Upload directives</p>
      <a class="btn btn-primary" href="https://github.com/valor-software/ng2-file-upload">View on GitHub</a>
      <div class="row d-flex" style="padding-top: 15px">
        <div class="col-lg-1 block_links">
          <a href="https://npmjs.org/ng2-file-upload" style="display: flex">
            <img src="https://img.shields.io/npm/v/ng2-file-upload/latest.svg" alt="npm latest version" >
          </a>
        </div>
        <div class="col-lg-1 block_links">
          <a href="https://npmjs.org/ng2-file-upload" style="display: flex">
            <img src="https://img.shields.io/npm/v/ng2-file-upload/next.svg" alt="npm next version" >
          </a>
        </div>
        <div class="col-lg-1 block_links"><iframe src="https://ghbtns.com/github-btn.html?user=valor-software&repo=ng2-file-upload&type=star&count=true" frameborder="0" scrolling="0" width="100px" height="20px"></iframe></div>
        <div class="col-lg-1 block_links"><iframe src="https://ghbtns.com/github-btn.html?user=valor-software&repo=ng2-file-upload&type=fork&count=true" frameborder="0" scrolling="0" width="100px" height="20px"></iframe></div>
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
