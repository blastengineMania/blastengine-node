import Base from './base';
import Job from './job';
import Email from './email';
export default class Bulk extends Base {
    to: BulkUpdateTo[];
    date?: Date;
    register(): Promise<SuccessFormat>;
    import(filePath: Attachment): Promise<Job>;
    update(): Promise<SuccessFormat>;
    createCsv(to: BulkUpdateTo[]): string;
    send(date?: Date): Promise<SuccessFormat>;
    delete(): Promise<SuccessFormat>;
    cancel(): Promise<SuccessFormat>;
    email(): Email;
    addTo(email: string, insertCode?: {
        [key: string]: string;
    } | {
        [key: string]: string;
    }[]): Bulk;
    saveParams(): RequestParamsBulkBegin;
    updateParams(): RequestParamsBulkUpdate;
    commitParams(): RequestParamsBulkCommit;
}
