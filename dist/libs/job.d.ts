import BEObject from './object';
import { JobResponseFormat } from '../../types/';
export default class Job extends BEObject {
    id: number;
    totalCount?: number;
    percentage?: number;
    successCount?: number;
    failedCount?: number;
    status?: string;
    report?: string;
    constructor(id: number);
    get(): Promise<JobResponseFormat>;
    isError(): Promise<boolean>;
    download(): Promise<string>;
    finished(): boolean;
}
