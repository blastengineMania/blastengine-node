import { BlastEngine } from '../../../..';
import BERequest from '../../../request';
import fs from 'fs';
import { promisify } from 'util';
import BEObject from '../../../object';

export default class Job extends BEObject {
	public id: number;
	public total_count?: number;
  public percentage?: number;
  public success_count?: number;
  public failed_count?: number;
  public status?: string;

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

	async download(filePath?: string): Promise<Buffer> {
		if (!this.id) throw 'Job id is not found.';
		const url = `/deliveries/-/emails/import/${this.id}/errorinfo/download`;
		const buffer = await Job.request.send('get', url) as Buffer;
		if (filePath) {
			await promisify(fs.writeFile)(filePath, buffer);
		}
		return buffer;
	}

	finished(): boolean {
		return this.percentage === 100;
	}
}