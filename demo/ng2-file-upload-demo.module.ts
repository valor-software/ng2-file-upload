import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { Ng2BootstrapModule } from 'ng2-bootstrap/ng2-bootstrap';
import { FileUploadModule } from '../components/file-upload/file-upload.module';
import { DemoComponent } from './app.component.ts';
import { FileUploadSectionComponent } from './components/file-upload-section';
import { SimpleDemoComponent } from './components/file-upload/simple-demo';

@NgModule({
  imports: [BrowserModule, CommonModule, FileUploadModule, Ng2BootstrapModule, FormsModule],
  declarations: [DemoComponent, FileUploadSectionComponent, SimpleDemoComponent],
  bootstrap: [DemoComponent]
})
export class NgFileUploadDemo {
}
