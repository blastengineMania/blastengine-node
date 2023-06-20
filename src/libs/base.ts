// import Transaction from './transaction';
import BEObject from './object';
import Report from './report';
import ErrorReport from './error_report';
// import Bulk from './bulk';
import { Attachment, BEReturnType, GetResponseFormat, InsertCode } from '../../types/';

export default class Base extends BEObject {
	deliveryId?: number;
	public fromName = '';
	public fromEmail = '';
	public subject = '';
	public encode = 'UTF-8';
	public textPart = '';
	public htmlPart = '';
	public url?: string;
	public attachments: Attachment[] = [];
	public file?: Attachment;

	// From get() method:
	public deliveryType?: string;
	public status?: string;
	public totalCount?: number;
	public sentCount?: number;
	public dropCount?: number;
	public hardErrorCount?: number;
	public softErrorCount?: number;
	public openCount?: number;
	public deliveryTime?: Date;
	public reservationTime?: Date;
	public createdTime?: Date;
	public updatedTime?: Date;

	constructor() {
		super();
	}

	set(key: string, value: any): Base {
		switch (key) {
			case 'delivery_id':
				this.deliveryId = value;
				break;
			case 'text_part':
				this.textPart = value;
				break;
			case 'html_part':
				this.htmlPart = value;
				break;
			case 'total_count':
				this.totalCount = value;
				break;
			case 'sent_count':
				this.sentCount = value;
				break;
			case 'drop_count':
				this.dropCount = value;
				break;
			case 'hard_error_count':
				this.hardErrorCount = value;
				break;
			case 'soft_error_count':
				this.softErrorCount = value;
				break;
			case 'open_count':
				this.openCount = value;
				break;
			case 'from':
				if (value.name)	this.fromName = value.name;
				if (value.email) this.fromEmail = value.email;
				break;
			case 'subject':
				this.subject = value;
				break;
			case 'status':
				this.status = value;
				break;
			case 'delivery_time':
				if (value) this.deliveryTime = new Date(value);
				break;
			case 'reservation_time':
				if (value) this.reservationTime = new Date(value);
				break;
			case 'created_time':
				this.createdTime = new Date(value);
				break;
			case 'updated_time':
				this.updatedTime = new Date(value);
				break;
			case 'delivery_type':
				this.deliveryType = value;
				break;
		}
		return this;
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
		this.textPart = text;
		return this;
	}

	setHtml(html: string): BEReturnType {
		this.htmlPart = html;
		return this;
	}

	addAttachment(file: Attachment): BEReturnType {
		this.attachments.push(file);
		return this;
	}

	async get(): Promise<void> {
		if (!this.deliveryId) throw 'Delivery id is not found.';
		const url = `/deliveries/${this.deliveryId!}`;
		const res = await Base.request.send('get', url) as GetResponseFormat;
		this.sets(res);
	}

	report(): Report {
		return new Report(this.deliveryId!);
	}

	hashToInsertCode(hash?: {[key: string]: string}): InsertCode[] {
		if (!hash) return [];
		return Object.keys(hash).map(key => {
			return {
				key: `__${key}__`,
				value: hash[key],
			};
		});
	}
}
