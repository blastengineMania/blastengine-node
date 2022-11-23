import BEObject from './object';
export default class Report extends BEObject {
    job_id?: number;
    delivery_id: number;
    percentage: number;
    status: string;
    mail_open_file_url: string;
    total_count: number;
    report: any;
    constructor(delivery_id: number);
    create(): Promise<number>;
    get(): Promise<void>;
    finished(): Promise<boolean>;
    download(): Promise<any>;
}
