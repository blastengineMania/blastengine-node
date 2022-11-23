import Base from './base';
import Job from './job';
import Email from './email';
export default class Bulk extends Base {
    to: BulkUpdateTo[];
    date?: Date;
    register(): Promise<SuccessFormat>;
    import(filePath: Attachment): Promise<Job>;
    update(): Promise<SuccessFormat>;
    send(date?: Date): Promise<SuccessFormat>;
    delete(): Promise<SuccessFormat>;
    cancel(): Promise<SuccessFormat>;
    email(): Email;
    setTo(email: string, insertCode?: InsertCode[] | InsertCode): Bulk;
    saveParams(): RequestParamsBulkBegin;
    updateParams(): RequestParamsBulkUpdate;
    commitParams(): RequestParamsBulkCommit;
}
