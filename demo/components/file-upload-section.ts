/// <reference path="../../tsd.d.ts" />

import {Component, View, CORE_DIRECTIVES} from 'angular2/angular2';

import {tabs} from 'ng2-bootstrap';
import {SimpleDemo} from './file-upload/simple-demo';

let name = 'File Upload';
let doc = require('../../components/file-upload/readme.md');

let tabDesc:Array<any> = [
  {
    heading: 'Simple',
    ts: require('!!prismjs?lang=typescript!./file-upload/simple-demo.ts'),
    html: require('!!prismjs?lang=markup!./file-upload/simple-demo.html')
  }
];

let tabsContent:string = ``;
tabDesc.forEach(desc => {
  tabsContent += `
          <tab heading="${desc.heading}" (select)="select($event)">
          <div class="card card-block panel panel-default panel-body">

            <${desc.heading.toLowerCase()}-demo *ng-if="currentHeading === '${desc.heading}'"></${desc.heading.toLowerCase()}-demo>

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
              </tabset>
            </div>
          </div>
        </tab>
  `;
});

@Component({
  selector: 'file-upload-section'
})
@View({
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
  directives: [SimpleDemo, tabs, CORE_DIRECTIVES]
})
export class FileUploadSection {
  private currentHeading:string = 'Simple';

  private select(e) {
    if (e.heading) {
      this.currentHeading = e.heading;
    }
  }
}
