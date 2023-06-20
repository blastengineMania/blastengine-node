import BEObject from './object';
import Report from './report';
import { Attachment, BEReturnType, InsertCode } from '../../types/';
export default class Base extends BEObject {
    deliveryId?: number;
    fromName: string;
    fromEmail: string;
    subject: string;
    encode: string;
    textPart: string;
    htmlPart: string;
    url?: string;
    attachments: Attachment[];
    file?: Attachment;
    deliveryType?: string;
    status?: string;
    totalCount?: number;
    sentCount?: number;
    dropCount?: number;
    hardErrorCount?: number;
    softErrorCount?: number;
    openCount?: number;
    deliveryTime?: Date;
    reservationTime?: Date;
    createdTime?: Date;
    updatedTime?: Date;
    constructor();
    sets(params: {
        [key: string]: any;
    }): Base;
    set(key: string, value: any): Base;
    setSubject(subject: string): BEReturnType;
    setFrom(email: string, name?: string): BEReturnType;
    setEncode(encode: string): BEReturnType;
    setText(text: string): BEReturnType;
    setHtml(html: string): BEReturnType;
    addAttachment(file: Attachment): BEReturnType;
    get(): Promise<void>;
    report(): Report;
    hashToInsertCode(hash?: {
        [key: string]: string;
    }): InsertCode[];
}
