import BEObject from './object';
export default class ErrorReport extends BEObject {
    jobId?: number;
    percentage: number;
    status: string;
    errorFileUrl: string;
    total_count: number;
    report?: {
        [key: string]: string | number | Date;
    }[];
    private _errorStart?;
    private _errorEnd?;
    private _email?;
    private _responseCode;
    constructor();
    setErrorStart(start: Date): ErrorReport;
    setErrorEnd(end: Date): ErrorReport;
    setEmail(email: string): ErrorReport;
    setResponseCode(code: number[]): ErrorReport;
    create(): Promise<number>;
    get(): Promise<void>;
    finished(): Promise<boolean>;
    download(): Promise<any>;
}
