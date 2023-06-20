import Base from './base';
import { BEReturnType, RequestParamsTransaction, SuccessFormat} from '../../types/';

export default class Transaction extends Base {
	public to = '';
	public cc: string[] = [];
	public bcc: string[] = [];

	public insert_code: {key: string, value: string}[] = [];

	setTo(email: string, insert_code?: {[key: string]: string}): BEReturnType {
		this.to = email;
		this.insert_code = this.hashToInsertCode(insert_code);
		return this;
	}

	addCc(email: string): BEReturnType {
		if (this.cc.length >= 10) throw new Error('Cc is limited to 10.');
		this.cc.push(email);
		return this;
	}

	addBcc(email: string): BEReturnType {
		if (this.bcc.length >= 10) throw new Error('Bcc is limited to 10.');
		this.bcc.push(email);
		return this;
	}

	params(): RequestParamsTransaction {
		const params: RequestParamsTransaction = {
			from: {
				email: this.fromEmail,
				name: this.fromName
			},
			to: this.to,
			subject: this.subject,
			text_part: this.textPart,
		};
		if (this.insert_code.length > 0) {
			params.insert_code = this.insert_code;
		}
		if (this.cc.length > 0) {
			params.cc = this.cc;
		}
		if (this.bcc.length > 0) {
			params.bcc = this.bcc;
		}
		if (this.htmlPart) {
			params.html_part = this.htmlPart;
		}
		if (this.attachments.length > 0) {
			params.attachments = this.attachments;
		}
		return params;
	}

	async send(date?: Date): Promise<SuccessFormat> {
		const url = '/deliveries/transaction';
		const res = await Transaction.request.send('post', url, this.params());
		this.deliveryId = res.delivery_id;
		return res;
	}
}
