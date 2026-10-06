// jsdom has no DataTransfer to build a FileList from, so fill one in by hand
export function createFileList(...files: File[]): FileList {
  const list = Object.create(FileList.prototype);
  files.forEach((file, index) => Object.defineProperty(list, index, { value: file, enumerable: true }));
  Object.defineProperty(list, 'length', { value: files.length });
  Object.defineProperty(list, 'item', { value: (index: number) => files[ index ] ?? null });

  return list;
}
