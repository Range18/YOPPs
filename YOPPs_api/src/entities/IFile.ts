export interface IFile {
    fieldName: string
    originalName?: string;
    type?: string;
    mimetype?: string;
    payload?: Buffer;
    destination?: string;
    path?: string;
    size?: number;
}