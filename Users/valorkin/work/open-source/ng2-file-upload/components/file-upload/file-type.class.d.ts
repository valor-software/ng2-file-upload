export declare class FileType {
    static mime_doc: string[];
    static mime_xsl: string[];
    static mime_ppt: string[];
    static mime_psd: string[];
    static mime_compress: string[];
    static getMimeClass(file: any): string;
    static fileTypeDetection(inputFilename: string): string;
}
