import Base from '../base';
import strftime from 'strftime';
import Job from './job';

export default class Bulk extends Base {
	delivery_id?: number;
	to: BulkUpdateTo[] = [];
	date?: Date;

	async register(): Promise<SuccessFormat> {
		const url = '/deliveries/bulk/begin';
		const res = await Bulk.request.send('post', url, this.saveParams());
		this.delivery_id = res.delivery_id;
		return res;
	}

	async import(filePath: Attachment): Promise<Job> {
		if (!this.delivery_id) throw 'Delivery id is not found.';
		const url = `/deliveries/${this.delivery_id!}/emails/import`;
		const res = await Bulk.request.send('post', url, {
			file: filePath
		});
		return new Job(res.job_id!);
	}

	async update(): Promise<SuccessFormat> {
		if (!this.delivery_id) throw 'Delivery id is not found.';
		const url = `/deliveries/bulk/update/${this.delivery_id!}`;
		const res = await Bulk.request.send('put', url, this.updateParams());
		return res;
	}

	async send(date?: Date): Promise<SuccessFormat> {
		if (!this.delivery_id) throw 'Delivery id is not found.';
		const url = date ? 
			`/deliveries/bulk/commit/${this.delivery_id!}` :
			`/deliveries/bulk/commit/${this.delivery_id}/immediate`;
		this.date = date;
		const res = await Bulk.request.send('patch', url, this.commitParams());
		return res;
	}

	async delete(): Promise<SuccessFormat> {
		if (!this.delivery_id) throw 'Delivery id is not found.';
		const url = `/deliveries/${this.delivery_id!}`;
		const res = await Bulk.request.send('delete', url);
		return res;
	}

	setTo(email: string, insertCode?: InsertCode[] | InsertCode): Bulk {
		const params: BulkUpdateTo = { email };
		if (insertCode) {
			if (Array.isArray(insertCode)) {
				params.insert_code = insertCode;
			} else {
				params.insert_code = [insertCode];
			}
		}
		this.to.push(params);
		return this;
	}

	saveParams(): RequestParamsBulkBegin {
		return {
			from: {
				email: this.fromEmail,
				name: this.fromName
			},
			subject: this.subject,
			encode: this.encode,
			text_part: this.text_part,
			html_part: this.html_part,
		};
	}

	updateParams(): RequestParamsBulkUpdate {
		return {
			from: {
				email: this.fromEmail,
				name: this.fromName
			},
			subject: this.subject,
			to: this.to,
			text_part: this.text_part,
			html_part: this.html_part,
		};
	}

	commitParams(): RequestParamsBulkCommit {
		if (!this.date) return {};
		strftime.timezone(9 * 60)
		return {
			reservation_time: strftime('%FT%T%z', this.date!).replace('+0900', '+09:00')
		}
	}
}