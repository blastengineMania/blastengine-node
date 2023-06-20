import BEObject from './object';
import JSZip from 'jszip';
import { SuccessFormat, GetReportResponseFormat } from '../../types/';

export default class Report extends BEObject {
	public jobId?: number;
	public deliveryId: number;
	public percentage: number = 0;
	public status: string = '';
	public mailOpenFileUrl: string = '';
	public totalCount: number = 0;
	public report: any;

	constructor(deliveryId: number) {
		super();
		this.deliveryId = deliveryId;
	}

	async create(): Promise<number> {
		const url = `/deliveries/${this.deliveryId}/analysis/report`
		const res = await Report.request.send('post', url) as SuccessFormat;
		this.jobId = res.job_id!;
		return this.jobId;
	}

	async get(): Promise<void> {
		const path = `/deliveries/-/analysis/report/${this.jobId}`
		const res = await Report.request.send('get', path) as GetReportResponseFormat;
		this.percentage = res.percentage;
		this.status = res.status;
		if (res.total_count) {
			this.totalCount = res.total_count;
		}
		if (res.mail_open_file_url) {
			this.mailOpenFileUrl = res.mail_open_file_url;
		}
	}

	async finished(): Promise<boolean> {
		if (!this.jobId) await this.create();
		await this.get();
		return this.percentage === 100;
	}

	async download(): Promise<any> {
		if (this.report) return this.report;
		if (this.percentage < 100) return null;
		const url = `/deliveries/-/analysis/report/${this.jobId}/download`;
		const buffer = await Report.request.send('get', url) as Buffer;
		const jsZip = await JSZip.loadAsync(buffer);
		const fileName = Object.keys(jsZip.files)[0];
		const zipObject = jsZip.files[fileName];
		this.report = await zipObject.async('text');
		return this.report;
	}
}