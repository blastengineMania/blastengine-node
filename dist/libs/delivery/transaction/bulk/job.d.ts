/// <reference types="node" />
import BEObject from '../../../object';
export default class Job extends BEObject {
    id: number;
    total_count?: number;
    percentage?: number;
    success_count?: number;
    failed_count?: number;
    status?: string;
    constructor(id: number);
    get(): Promise<JobResponseFormat>;
    download(filePath?: string): Promise<Buffer>;
    finished(): boolean;
}
