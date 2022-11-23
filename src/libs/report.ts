import BEObject from './object';
import JSZip from 'jszip';

export default class Report extends BEObject {
	public job_id?: number;
	public delivery_id: number;
	public percentage: number = 0;
	public status: string = '';
	public mail_open_file_url: string = '';
	public total_count: number = 0;
	public report: any;

	constructor(delivery_id: number) {
		super();
		this.delivery_id = delivery_id;
	}

	async create(): Promise<number> {
		const url = `/deliveries/${this.delivery_id}/analysis/report`
		const res = await Report.request.send('post', url) as SuccessFormat;
		this.job_id = res.job_id!;
		return this.job_id;
	}

	async get(): Promise<void> {
		const path = `/deliveries/-/analysis/report/${this.job_id}`
		const res = await Report.request.send('get', path) as GetReportResponseFormat;
		this.percentage = res.percentage;
		this.status = res.status;
		if (res.total_count) {
			this.total_count = res.total_count;
		}
		if (res.mail_open_file_url) {
			this.mail_open_file_url = res.mail_open_file_url;
		}
	}

	async finished(): Promise<boolean> {
		if (!this.job_id) await this.create();
		await this.get();
		return this.percentage === 100;
	}

	async download(): Promise<any> {
		if (this.report) return this.report;
		if (this.percentage < 100) return null;
		const url = `/deliveries/-/analysis/report/${this.job_id}/download`;
		const buffer = await Report.request.send('get', url) as Buffer;
		const jsZip = await JSZip.loadAsync(buffer);
		const fileName = Object.keys(jsZip.files)[0];
		const zipObject = jsZip.files[fileName];
		this.report = await zipObject.async('text');
		return this.report;
	}
}