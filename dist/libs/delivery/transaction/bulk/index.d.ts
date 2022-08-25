import Base from '../base';
import Job from './job';
export default class Bulk extends Base {
    delivery_id?: number;
    to: BulkUpdateTo[];
    date?: Date;
    register(): Promise<SuccessFormat>;
    import(filePath: Attachment): Promise<Job>;
    update(): Promise<SuccessFormat>;
    send(date?: Date): Promise<SuccessFormat>;
    delete(): Promise<SuccessFormat>;
    setTo(email: string, insertCode?: InsertCode[] | InsertCode): Bulk;
    saveParams(): RequestParamsBulkBegin;
    updateParams(): RequestParamsBulkUpdate;
    commitParams(): RequestParamsBulkCommit;
}
