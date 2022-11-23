import { BlastEngine } from '..';
import { promisify } from 'util';
import BEObject from './object';
import JSZip from 'jszip';

export default class Job extends BEObject {
	public id: number;
	public total_count?: number;
  public percentage?: number;
  public success_count?: number;
  public failed_count?: number;
  public status?: string;
	public report?: string;

	constructor(id: number) {
		super();
		this.id = id;
	}

	async get(): Promise<JobResponseFormat> {
		if (!this.id) throw 'Job id is not found.';
		const url = `/deliveries/-/emails/import/${this.id}`;
		const res = await Job.request.send('get', url) as JobResponseFormat;
		this.total_count = res.total_count;
		this.percentage = res.percentage;
		this.success_count = res.success_count;
		this.failed_count = res.failed_count;
		this.status = res.status;
		return res;
	}

	async isError(): Promise<boolean> {
		const report = await this.download();
		return report !== '';
	}
	
	async download(): Promise<string> {
		if (!this.id) throw 'Job id is not found.';
		if (this.report) return this.report;
		const url = `/deliveries/-/emails/import/${this.id}/errorinfo/download`;
		try {
			const buffer = await Job.request.send('get', url) as Buffer;
			const jsZip = await JSZip.loadAsync(buffer);
			const fileName = Object.keys(jsZip.files)[0];
			const zipObject = jsZip.files[fileName];
			this.report = await zipObject.async('text');
			return this.report;
		} catch (e) {
			const error = JSON.parse(e as string);
			if (error &&
					error.error_messages &&
					error.error_messages.main &&
					error.error_messages.main[0] === 'no data found.'
				) {
				return '';
			}
			throw e;
		}
	}

	finished(): boolean {
		return this.percentage === 100;
	}
}