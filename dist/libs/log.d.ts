import BEObject from './object';
import { SearchLogCondition, SearchLogResult } from '../../types/';
export default class Log extends BEObject {
    email?: string;
    maillogId?: number;
    openTime?: Date;
    lastResponseMessage?: string;
    lastResponseCode?: string;
    deliveryId?: number;
    deliveryType?: string;
    status?: string;
    deliveryTime?: Date;
    createdTime?: Date;
    updatedTime?: Date;
    static fromJson(params: SearchLogResult): Log;
    set(key: string, value: any): Log;
    static find(params?: SearchLogCondition): Promise<Log[]>;
}
