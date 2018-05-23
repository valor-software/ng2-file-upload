import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { TabsModule } from 'ngx-bootstrap/tabs';
import { FileUploadModule } from '../../../src/file-upload/file-upload.module';

import { AppComponent } from './app.component';

import { FileUploadSectionComponent } from './components/file-upload-section';
import { SimpleDemoComponent } from './components/file-upload/simple-demo';
import { HttpModule } from '@angular/http';

@NgModule({
	imports: [
		HttpModule,
		BrowserModule,
		CommonModule,
		FileUploadModule,
		TabsModule.forRoot(),
		FormsModule,
	],
	declarations: [AppComponent, FileUploadSectionComponent, SimpleDemoComponent],
	bootstrap: [AppComponent],
})
export class AppModule {}
