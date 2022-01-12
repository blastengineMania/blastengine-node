import request from 'superagent';
import Client from '../../../';

export default class Transaction {
	static client?: Client;
	private fromName = '';
	private fromEmail = '';
	private to = '';
	private subject = '';
	private encode = 'UTF-8';
	private text_part = '';
	private html_part = '';
	private url = 'https://app.engn.jp/api/v1/deliveries/transaction';
	
	setSubject(subject: string): Transaction {
		this.subject = subject;
		return this;
	}

	setFrom(email: string, name = ''): Transaction {
		this.fromEmail = email;
		this.fromName = name;
		return this;
	}

	setTo(email: string | string[]): Transaction {
		if (Array.isArray(email)) {
			email = email.join(',');
		}
		this.to = email;
		return this;
	}

	setEncode(encode: string): Transaction {
		this.encode = encode;
		return this;
	}

	setText(text: string): Transaction {
		this.text_part = text;
		return this;
	}

	setHtml(html: string): Transaction {
		this.html_part = html;
		return this;
	}

	async send() {
		const params = {
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
		const res = await request
			.post(this.url)
			.send(params)
			.set('Authorization', `Bearer ${Transaction.client?.token}`)
			.set('Content-Type', 'application/json');
		return res.body;
	}
}
