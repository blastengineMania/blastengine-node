import request from 'superagent';
import Client from '../../../';
import Bulk from './bulk/';
import Base from './base';

export default class Transaction extends Base {
	public to = '';
	public url = 'https://app.engn.jp/api/v1/deliveries/transaction';
	
	setTo(email: string | string[]): BEReturnType {
		if (Array.isArray(email)) {
			email = email.join(',');
		}
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
		return super.req('post', this.url, this.params());
	}
}
