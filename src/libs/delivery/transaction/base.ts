import request, { SuperAgent, SuperAgentRequest } from 'superagent';
import { BlastEngine } from '../../..';
import Bulk from './bulk/';
import { ResponseError } from 'superagent';

export default class Base {
	static client?: BlastEngine;
	public fromName = '';
	public fromEmail = '';
	public subject = '';
	public encode = 'UTF-8';
	public text_part = '';
	public html_part = '';
	public url?: string;
	public attachments: Attachment[] = [];

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

	async req(method: string, url: string, params?: RequestParams): Promise<SuccessFormat> {
		try {
			const request = this.getRequest(method, url);
			request
				.set('Authorization', `Bearer ${Base.client?.token}`);
			if (this.attachments.length > 0) {
				const res = await this.sendAttachment(request, params);
				return res.body as SuccessFormat;
			} else {
				const res = await this.sendJson(request, params);
				return res.body as SuccessFormat;
			}
		} catch (e: any) {
			console.error(e);
			if ('response' in e) {
				throw e.response.text;
			}
			throw e;
		}
	}

	async sendJson(request: SuperAgentRequest, params?: RequestParams): Promise<SuperAgentRequest> {
		return request
			.send(params)
			.set('Content-Type', 'application/json');
	}

	async sendAttachment(request: SuperAgentRequest, params?: RequestParams): Promise<SuperAgentRequest> {
		for (const file of this.attachments) {
			request.attach('file', file);
		}
		if (params) {
			request
				.attach('data', Buffer.from(JSON.stringify(params)), { contentType: 'application/json'});
		}
		return request
			.type('form');
	}
}
