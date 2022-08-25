import BEObject from '../../object';
export default class Base extends BEObject {
    fromName: string;
    fromEmail: string;
    subject: string;
    encode: string;
    text_part: string;
    html_part: string;
    url?: string;
    attachments: Attachment[];
    file?: Attachment;
    constructor();
    setSubject(subject: string): BEReturnType;
    setFrom(email: string, name?: string): BEReturnType;
    setEncode(encode: string): BEReturnType;
    setText(text: string): BEReturnType;
    setHtml(html: string): BEReturnType;
    addAttachment(file: Attachment): BEReturnType;
}
