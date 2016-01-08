export * from  './components/file-upload/file-select';
export * from  './components/file-upload/file-drop';
export * from  './components/file-upload/file-uploader';

import {FileSelect} from './components/file-upload/file-select';
import {FileDrop} from './components/file-upload/file-drop';

export const FILE_UPLOAD_DIRECTIVES:[any] = [FileSelect, FileDrop];
