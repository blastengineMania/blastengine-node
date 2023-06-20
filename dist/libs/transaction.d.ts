import Base from './base';
import { BEReturnType, RequestParamsTransaction, SuccessFormat } from '../../types/';
export default class Transaction extends Base {
    to: string;
    cc: string[];
    bcc: string[];
    insert_code: {
        key: string;
        value: string;
    }[];
    setTo(email: string, insert_code?: {
        [key: string]: string;
    }): BEReturnType;
    addCc(email: string): BEReturnType;
    addBcc(email: string): BEReturnType;
    params(): RequestParamsTransaction;
    send(date?: Date): Promise<SuccessFormat>;
}
