import request, { SuperAgentRequest } from 'superagent';
import Client from '../../../';
import Bulk from './bulk/';
import { ResponseError } from 'superagent';

export default class Base {
	static client?: Client;
	public fromName = '';
	public fromEmail = '';
	public subject = '';
	public encode = 'UTF-8';
	public text_part = '';
	public html_part = '';
	public url?: string;
	
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

	getRequest(method: string, url: string): SuperAgentRequest {
		switch (method.toUpperCase()) {
			case 'GET':
				return request.get(url);
			case 'POST':
				return request.post(url);
			case 'PUT':
				return request.put(url);
			case 'DELETE':
				return request.delete(url);
			case 'PATCH':
				return request.patch(url);
			default:
				throw `${method} is not support.`;
		}
	}

	async req(method: string, url: string, params: RequestParams): Promise<SuccessFormat> {
		try {
			const request = this.getRequest(method, url)
			const res = await request
				.send(params)
				.set('Authorization', `Bearer ${Base.client?.token}`)
				.set('Content-Type', 'application/json');
			return res.body as SuccessFormat;
		} catch (e: any) {
			if ('response' in e) {
				throw e.response.text;
			}
			throw e;
		}
	}
}
