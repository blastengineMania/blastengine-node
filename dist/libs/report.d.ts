import BEObject from './object';
export default class Report extends BEObject {
    jobId?: number;
    deliveryId: number;
    percentage: number;
    status: string;
    mailOpenFileUrl: string;
    totalCount: number;
    report: any;
    constructor(deliveryId: number);
    create(): Promise<number>;
    get(): Promise<void>;
    finished(): Promise<boolean>;
    download(): Promise<any>;
}
