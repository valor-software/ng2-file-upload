import { NgModule } from '@angular/core';

import { FileSelectDirective } from './file-select.directive';
import { FileDropDirective } from './file-drop.directive';

@NgModule({
  imports: [
    FileSelectDirective,
    FileDropDirective,
  ],
  exports: [
    FileSelectDirective,
    FileDropDirective,
  ],
})
export class FileUploadModule {
}
