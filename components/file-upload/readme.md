### Usage
```typescript
import {FileSelect, FileDrop, FileUploader} from 'ng2-file-upload';
```

### Annotations
```typescript
// class FileSelect
@Directive({
  selector: '[ng2-file-select]',
  properties: ['uploader'],
  host: {
    '(change)': 'onChange()'
  }
})
```

```typescript
// class FileDrop
@Directive({
  selector: '[ng2-file-drop]',
  properties: ['uploader'],
  events: ['fileOver'],
  host: {
    '(drop)': 'onDrop($event)',
    '(dragover)': 'onDragOver($event)',
    '(dragleave)': 'onDragLeave($event)'
  }
})
```

## FileSelect API

### Properties

  - `uploader` - (`FileUploader`) - uploader object. See using in [demo](https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.ts)

  Parameters that supported by this object:

  1. `url` - URL of File Uploader's route
  2. `authToken` - auth token that will be applied as 'Authorization' header during file send.

## FileDrop API

### Properties

  - `uploader` - (`FileUploader`) - uploader object. See using in [demo](https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.ts)

### Events

  - `file-over` - it fires during 'over' and 'out' events for Drop Area; returns `boolean`: `true` if file is over Drop Area, `false` in case of out.
  See using in [ts demo](https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.ts) and
  [html demo](https://github.com/valor-software/ng2-file-upload/blob/master/demo/components/file-upload/simple-demo.html)
