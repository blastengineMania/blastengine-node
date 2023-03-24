import BEObject from './object';
export default class ErrorReport extends BEObject {
    job_id?: number;
    percentage: number;
    status: string;
    error_file_url: string;
    total_count: number;
    report?: {
        [key: string]: string | number | Date;
    }[];
    private _error_start?;
    private _error_end?;
    private _email?;
    private _response_code;
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
