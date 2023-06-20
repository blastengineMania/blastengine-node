import Base from './base';
import strftime from 'strftime';
import Job from './job';
import Email from './email';
import { file } from 'tmp-promise';
import fs from 'fs';
import { promisify } from 'util';
import { Attachment, BulkUpdateTo, SuccessFormat, RequestParamsBulkBegin, RequestParamsBulkUpdate, RequestParamsBulkCommit } from '../../types/';

export default class Bulk extends Base {
	to: BulkUpdateTo[] = [];

	async register(): Promise<SuccessFormat> {
		const url = '/deliveries/bulk/begin';
		const res = await Bulk.request.send('post', url, this.saveParams());
		this.deliveryId = res.delivery_id;
		return res;
	}
	
	async import(filePath: Attachment): Promise<Job> {
		if (!this.deliveryId) throw 'Delivery id is not found.';
		const url = `/deliveries/${this.deliveryId!}/emails/import`;
		const res = await Bulk.request.send('post', url, {
			file: filePath
		});
		return new Job(res.job_id!);
	}

	async update(): Promise<SuccessFormat> {
		if (!this.deliveryId) throw 'Delivery id is not found.';
		const params = this.updateParams();
		if (params.to && params.to.length > 50) {
			const csv = this.createCsv(params.to);
			const {path, cleanup} = await file({postfix: '.csv'});
			await promisify(fs.writeFile)(path, csv);
			const job = await this.import(path);
			while (job.finished() === false) {
				await new Promise((resolve) => setTimeout(resolve, 1000));
			}
			delete params.to;
		}
		const url =  `/deliveries/bulk/update/${this.deliveryId!}`;
		const res = await Bulk.request.send('put', url, params);
		return res;
	}

	createCsv(to: BulkUpdateTo[]): string {
		// ヘッダーを作る
		const headers = ['email'];
		for (const t of to) {
			const params = t.insert_code?.map((c) => c.key) || [];
			for (const p of params) {
				if (!headers.includes(p)) headers.push(p);
			}
		}
		const lines = [`"${headers.join('","')}"`];
		for (const t of to) {
			// const params = t.insert_code?.map((c) => c.key) || [];
			const values = [t.email];
			for (const h of headers) {
				if (h === 'email') continue;
				const code = t.insert_code?.find((c) => c.key === h);
				values.push(code ? code.value.replace('"', '""') : '');
			}
			lines.push(`"${values.join('","')}"`);
		}
		return lines.join('\n');
	}


	async send(date?: Date): Promise<SuccessFormat> {
		if (!this.deliveryId) throw 'Delivery id is not found.';
		const url = date ? 
			`/deliveries/bulk/commit/${this.deliveryId!}` :
			`/deliveries/bulk/commit/${this.deliveryId}/immediate`;
		const res = await Bulk.request.send('patch', url, this.commitParams(date));
		return res;
	}

	async delete(): Promise<SuccessFormat> {
		if (!this.deliveryId) throw 'Delivery id is not found.';
		const url = `/deliveries/${this.deliveryId!}`;
		const res = await Bulk.request.send('delete', url);
		return res;
	}

	async cancel(): Promise<SuccessFormat> {
		if (!this.deliveryId) throw 'Delivery id is not found.';
		const url = `/deliveries/${this.deliveryId!}/cancel`;
		const res = await Bulk.request.send('patch', url);
		return res;
	}

	email(): Email {
		if (!this.deliveryId) throw 'Delivery id is not found.';
		return new Email(this.deliveryId!);
	}

	addTo(email: string, insertCode?: {[key: string]: string}): Bulk {
		const params: BulkUpdateTo = { email };
		params.insert_code = this.hashToInsertCode(insertCode);
		this.to.push(params);
		return this;
	}

	saveParams(): RequestParamsBulkBegin {
		const params: RequestParamsBulkBegin = {
			from: {
				email: this.fromEmail,
				name: this.fromName
			},
			subject: this.subject,
			encode: this.encode,
			text_part: this.textPart,
			html_part: this.htmlPart,
		};
		if (this.attachments.length > 0) {
			params.attachments = this.attachments;
		}
		return params;
	}

	updateParams(): RequestParamsBulkUpdate {
		return {
			from: {
				email: this.fromEmail,
				name: this.fromName
			},
			subject: this.subject,
			to: this.to,
			text_part: this.textPart,
			html_part: this.htmlPart,
		};
	}

	commitParams(date?: Date): RequestParamsBulkCommit {
		if (!date) return {};
		strftime.timezone(9 * 60);
		return {
			reservation_time: strftime('%FT%T%z', date).replace('+0900', '+09:00')
		}
	}
}