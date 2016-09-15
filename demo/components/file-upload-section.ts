import { Component } from '@angular/core';

let doc = require('../../components/file-upload/readme.md');

let tabDesc:Array<any> = [
  {
    heading: 'Simple',
    ts: require('!!prismjs?lang=typescript!./file-upload/simple-demo.ts'),
    html: require('!!prismjs?lang=markup!./file-upload/simple-demo.html'),
    js: require('!!prismjs?lang=javascript!./file-upload/file-catcher.js')
  }
];

@Component({
  selector: 'file-upload-section',
  template: `
  <section [id]="name.toLowerCase()">
    <div class="row">
      <tabset>
         <tab *ngFor="let desc of tabs" heading="{{desc.heading}}" (select)="select($event)">
          <div class="card card-block panel panel-default panel-body">

            <simple-demo></simple-demo>

            <br>

            <div class="row" style="margin: 0px;">
              <tabset>
                <tab heading="Markup">
                  <div class="card card-block panel panel-default panel-body">
                    <pre class="language-html"><code class="language-html" ng-non-bindable [innerHTML]="desc.html"></code></pre>
                  </div>
                </tab>
                <tab heading="TypeScript">
                  <div class="card card-block panel panel-default panel-body">
                    <pre class="language-typescript"><code class="language-typescript" ng-non-bindable [innerHTML]="desc.ts"></code></pre>
                  </div>
                </tab>
                <tab heading="Backend Demo">
                  <div class="card card-block panel panel-default panel-body">
                    <pre class="language-javascript"><code class="language-javascript" ng-non-bindable [innerHTML]="desc.js"></code></pre>
                  </div>
                </tab>
              </tabset>
            </div>
          </div>
        </tab>
      </tabset>
    </div>

    <div class="row">
      <h2>API</h2>
      <div class="card card-block panel panel-default panel-body" [innerHTML]="doc"></div>
    </div>
  </section>
  `
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
