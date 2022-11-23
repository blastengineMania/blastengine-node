import Transaction from './transaction';
import BEObject from './object';
import Report from './report';

export default class Base extends BEObject {
	delivery_id?: number;
	public fromName = '';
	public fromEmail = '';
	public subject = '';
	public encode = 'UTF-8';
	public text_part = '';
	public html_part = '';
	public url?: string;
	public attachments: Attachment[] = [];
	public file?: Attachment;

	// From get() method:
	public delivery_type?: string;
	public status?: string;
	public total_count?: number;
	public sent_count?: number;
	public drop_count?: number;
	public hard_error_count?: number;
	public soft_error_count?: number;
	public open_count?: number;
	public delivery_time?: Date;
	public reservation_time?: Date;
	public created_time?: Date;
	public updated_time?: Date;

	constructor() {
		super();
	}
	
	setSubject(subject: string): BEReturnType {
		this.subject = subject;
		return this;
	}

	setFrom(email: string, name = ''): BEReturnType {
		this.fromEmail = email;
		this.fromName = name;
		return this;
	}

	setEncode(encode: string): BEReturnType {
		this.encode = encode;
		return this;
	}

	setText(text: string): BEReturnType {
		this.text_part = text;
		return this;
	}

	setHtml(html: string): BEReturnType {
		this.html_part = html;
		return this;
	}

	addAttachment(file: Attachment): BEReturnType {
		this.attachments.push(file);
		return this;
	}

	async get(): Promise<void> {
		if (!this.delivery_id) throw 'Delivery id is not found.';
		const url = `/deliveries/${this.delivery_id!}`;
		const res = await Transaction.request.send('get', url) as GetResponseFormat;
		this.delivery_id = res.delivery_id;
		this.fromEmail = res.from.email;
		this.fromName = res.from.name;
		this.subject = res.subject;
		this.text_part = res.text_part;
		this.html_part = res.html_part;
		this.total_count = res.total_count;
		this.sent_count = res.sent_count;
		this.drop_count = res.drop_count;
		this.hard_error_count = res.hard_error_count;
		this.soft_error_count = res.soft_error_count;
		this.open_count = res.open_count;
		this.delivery_time = res.delivery_time ? new Date(res.delivery_time) : undefined;
		this.reservation_time = res.reservation_time ? new Date(res.reservation_time) : undefined;
		this.created_time = new Date(res.created_time);
		this.updated_time = new Date(res.updated_time);
		this.status = res.status;
		this.delivery_type = res.delivery_type;
	}

	report(): Report {
		return new Report(this.delivery_id!);
	}
}
