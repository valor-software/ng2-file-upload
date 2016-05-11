function isElement(node:any):boolean {
  return !!(node && (node.nodeName || node.prop && node.attr && node.find));
}

export class FileLikeObject {
  public lastModifiedDate:any;
  public size:any;
  public type:string;
  public name:string;

  public constructor(fileOrInput:any) {
    let isInput = isElement(fileOrInput);
    let fakePathOrObject = isInput ? fileOrInput.value : fileOrInput;
    let postfix = typeof fakePathOrObject === 'string' ? 'FakePath' : 'Object';
    let method = '_createFrom' + postfix;
    (this as any)[method](fakePathOrObject);
  }

  public _createFromFakePath(path:string):void {
    this.lastModifiedDate = void 0;
    this.size = void 0;
    this.type = 'like/' + path.slice(path.lastIndexOf('.') + 1).toLowerCase();
    this.name = path.slice(path.lastIndexOf('/') + path.lastIndexOf('\\') + 2);
  }

  public _createFromObject(object:{size: number, type: string, name: string}):void {
    // this.lastModifiedDate = copy(object.lastModifiedDate);
    this.size = object.size;
    this.type = object.type;
    this.name = object.name;
  }
}
