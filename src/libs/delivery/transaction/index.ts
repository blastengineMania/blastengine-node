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
			subject: this.subject,
			encode: this.encode,
			text_part: this.text_part,
			html_part: this.html_part,
		};
	}

	async send(url?: string, requestParams?: RequestParams): Promise<SuccessFormat> {
		return Transaction.request.send('post', this.url, this.params());
	}
}
