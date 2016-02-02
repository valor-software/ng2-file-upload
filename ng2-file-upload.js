function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
__export(require('./components/file-upload/file-select'));
__export(require('./components/file-upload/file-drop'));
__export(require('./components/file-upload/file-uploader'));
var file_select_2 = require('./components/file-upload/file-select');
var file_drop_2 = require('./components/file-upload/file-drop');
exports.FILE_UPLOAD_DIRECTIVES = [file_select_2.FileSelect, file_drop_2.FileDrop];
//# sourceMappingURL=ng2-file-upload.js.map