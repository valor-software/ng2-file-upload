import {Component} from '@angular/core';
import {CORE_DIRECTIVES} from '@angular/common';

import {TAB_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import {SimpleDemoComponent} from './file-upload/simple-demo';

let name = 'File Upload';
let doc = require('../../components/file-upload/readme.md');

let tabDesc:Array<any> = [
  {
    heading: 'Simple',
    ts: require('!!prismjs?lang=typescript!./file-upload/simple-demo.ts'),
    html: require('!!prismjs?lang=markup!./file-upload/simple-demo.html'),
    js: require('!!prismjs?lang=javascript!./file-upload/file-catcher.js')
  }
];

let tabsContent:string = ``;
tabDesc.forEach((desc:any) => {
  tabsContent += `
          <tab heading="${desc.heading}" (select)="select($event)">
          <div class="card card-block panel panel-default panel-body">

            <${desc.heading.toLowerCase()}-demo *ngIf="currentHeading === '${desc.heading}'"></${desc.heading.toLowerCase()}-demo>

            <br>

            <div class="row" style="margin: 0px;">
              <tabset>
                <tab heading="Markup">
                  <div class="card card-block panel panel-default panel-body">
                    <pre class="language-html"><code class="language-html" ng-non-bindable>${desc.html}</code></pre>
                  </div>
                </tab>
                <tab heading="TypeScript">
                  <div class="card card-block panel panel-default panel-body">
                    <pre class="language-typescript"><code class="language-typescript" ng-non-bindable>${desc.ts}</code></pre>
                  </div>
                </tab>
                <tab heading="Backend Demo">
                  <div class="card card-block panel panel-default panel-body">
                    <pre class="language-javascript"><code class="language-javascript" ng-non-bindable>${desc.js}</code></pre>
                  </div>
                </tab>
              </tabset>
            </div>
          </div>
        </tab>
  `;
});

@Component({
  selector: 'file-upload-section',
  template: `
  <section id="${name.toLowerCase()}">
    <div class="row">
      <tabset>

        ${tabsContent}

      </tabset>
    </div>

    <div class="row">
      <h2>API</h2>
      <div class="card card-block panel panel-default panel-body">${doc}</div>
    </div>
  </section>
  `,
  directives: [SimpleDemoComponent, TAB_DIRECTIVES, CORE_DIRECTIVES]
})
export class FileUploadSectionComponent {
  public currentHeading:string = 'Simple';

  public select(e:any):void {
    if (e.heading) {
      this.currentHeading = e.heading;
    }
  }
}
