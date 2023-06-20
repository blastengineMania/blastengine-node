import Base from "./base";
import Bulk from "./bulk";
import Transaction from "./transaction";
import { MailConfig, SearchCondition, SearchResult, Attachment } from '../../types/';
export default class Mail extends Base {
    params: MailConfig;
    static fromJson(params: SearchResult): Bulk | Transaction;
    static find(params?: SearchCondition): Promise<(Bulk | Transaction)[]>;
    addTo(email: string, insert_code?: {
        [key: string]: string;
    }): Mail;
    setEncode(encode?: string): Mail;
    setFrom(email: string, name?: string): Mail;
    setSubject(subject: string): Mail;
    setText(text: string): Mail;
    setHtml(html: string): Mail;
    addCc(email: string): Mail;
    addBcc(email: string): Mail;
    addAttachment(file: Attachment): Mail;
    send(sendTime?: Date): Promise<boolean>;
    private sendBulk;
    private sendTransaction;
}
