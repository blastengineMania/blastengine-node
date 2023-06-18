import Base from "./base";
export default class Mail extends Base {
    params: MailConfig;
    addTo(to: string): Mail;
    setFrom(email: string, name?: string): Mail;
    setSubject(subject: string): this;
    setText(text: string): this;
    setHtml(html: string): this;
    addCc(email: string): this;
    addBcc(email: string): this;
}
