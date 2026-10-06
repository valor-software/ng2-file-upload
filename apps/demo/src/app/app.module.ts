import { CommonModule } from '@angular/common';
import { NgModule, provideZoneChangeDetection } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { FileUploadModule } from 'ng2-file-upload';

import { AppComponent } from './app.component';
import { FileUploadSectionComponent } from './components/file-upload-section';
import { SimpleDemoComponent } from './components/file-upload/simple-demo';
import { ChunkedDemoComponent } from './components/file-upload/chunked-demo';

@NgModule({
  imports: [BrowserModule, CommonModule, FileUploadModule, TabsModule, FormsModule],
  declarations: [AppComponent, FileUploadSectionComponent, SimpleDemoComponent, ChunkedDemoComponent],
  bootstrap: [AppComponent],
  providers: [provideZoneChangeDetection()]
})
export class AppModule {
}
