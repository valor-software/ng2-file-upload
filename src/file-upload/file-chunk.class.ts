import { FileItem } from './file-item.class';

export class ChunkFileUpload {

  public blob: any;
  public fileSize: any;
  public maxChunkSize: any;
  public slice: any;
  public uploaders: any;
  public file: any;
  public successCallback: any;
  public errorCallback: any;

  constructor(obj: any) {
    this.file = obj.item;
    this.blob = obj.item._file;
    this.fileSize = obj.item.file.size;
    console.log(this.blob, this.fileSize);

    this.successCallback = obj.success;
    this.errorCallback = obj.fail;

    this.uploaders = [];

    var BYTES_PER_CHUNK = 1024,
        NUM_CHUNKS,
        start,
        end;

    var SIZE = this.blob.size;

    NUM_CHUNKS = Math.max(Math.ceil(SIZE / BYTES_PER_CHUNK), 1);
    start = 0;
    end = BYTES_PER_CHUNK;

    while(start < SIZE) {
      this.upload(this.blob.slice(start, end));
      start = end;
      end = start + BYTES_PER_CHUNK;
    }



  }

  upload(blob: any) {

    var xhr = new XMLHttpRequest();
    var that = this;

    // TODO: ADD proper URL here
    xhr.open(this.file.method,this.file.url, true);

    xhr.onloadend = function (e) {
      that.uploaders.pop();
      if(!that.uploaders.length) {
        console.log(e);
        that.successCallback(that.file)

      }
    };

    this.uploaders.push(xhr);
    xhr.send(blob);


  }

}
