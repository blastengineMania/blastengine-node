import Base from './base';

export default class Transaction extends Base {
	public to = '';
	public url = '/deliveries/transaction';
	
	setTo(email: string): BEReturnType {
		this.to = email;
		return this;
	}

	params(): RequestParamsTransaction {
		return {
			from: {
				email: this.fromEmail,
				name: this.fromName
			},
			to: this.to,
			cc: this.cc,
			bcc: this.bcc,
			subject: this.subject,
			encode: this.encode,
			text_part: this.text_part,
			html_part: this.html_part,
		};
	}

	async send(url?: string, requestParams?: RequestParams): Promise<SuccessFormat> {
		const res = await Transaction.request.send('post', this.url, this.params());
		this.delivery_id = res.delivery_id;
		return res;
	}
}
