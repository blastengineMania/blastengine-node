import { BlastEngine } from '../';
import request, { SuperAgent, SuperAgentRequest, ResponseError } from 'superagent';

export default class BERequest {
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

	hasAttachment(params?: RequestParams): [Attachment] | undefined {
		if (!params) return undefined;
		if (!('attachments' in params)) return undefined;
		if (params!.attachments!.length > 0) {
			return params.attachments;
		}
		return undefined;
	}

	async send(token: string, method: string, path: string, params?: RequestParams): Promise<SuccessFormat> {
		try {
			const request = this.getRequest(method, `https://app.engn.jp/api/v1${path}`);
			request
				.set('Authorization', `Bearer ${token}`);
			const attachments = this.hasAttachment(params);
			if (attachments) {
				const res = await this.sendAttachment(request, params as RequestParamsTransaction);
				return res.body as SuccessFormat;
			}

			if (params && 'file' in params) {
				// Upload Email
				const res = await this.sendFile(request, params!.file!);
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

	async sendAttachment(request: SuperAgentRequest, params: RequestParamsTransaction): Promise<SuperAgentRequest> {
		for (const file of params.attachments!) {
			request.attach('file', file);
		}
		delete params.attachments;
		if (params) {
			request
				.attach('data', Buffer.from(JSON.stringify(params)), { contentType: 'application/json'});
		}
		return request
			.type('form');
	}

	async sendFile(request: SuperAgentRequest, file: Attachment): Promise<SuperAgentRequest> {
		request.attach('file', file!, { contentType: 'text/csv'});
		return request
			.type('form');
	}
}