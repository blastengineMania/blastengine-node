import BEObject from './object';
import JSZip from 'jszip';
import strftime from 'strftime';
import { GetErrorReportResponseFormat, SuccessFormat,  } from '../../types/';

strftime.timezone(9 * 60);

export default class ErrorReport extends BEObject {
	public jobId?: number;
	public percentage: number = 0;
	public status: string = '';
	public errorFileUrl: string = '';
	public total_count: number = 0;
	public report?: {[key: string]: string | number | Date}[];
	private _errorStart?: string;
	private _errorEnd?: string;
	private _email?: string;
	private _responseCode: number[] = [];

	constructor() {
		super();
	}

	setErrorStart(start: Date): ErrorReport {
		this._errorStart = strftime('%FT%T%z', start).replace('+0900', '+09:00')
		return this;
	}

	setErrorEnd(end: Date): ErrorReport {
		this._errorEnd = strftime('%FT%T%z', end).replace('+0900', '+09:00')
		return this;
	}

	setEmail(email: string): ErrorReport {
		this._email = email;
		return this;
	}

	setResponseCode(code: number[]): ErrorReport {
		this._responseCode = code;
		return this;
	}


	async create(): Promise<number> {
		const url = `/errors/list`;
		const body: {[key: string]: string | number[]} = {};
		if (this._errorStart) body['error_start'] = this._errorStart;
		if (this._errorEnd) body['error_end'] = this._errorEnd;
		if (this._email) body['email'] = this._email;
		if (this._responseCode.length > 0) body['response_code'] = this._responseCode;
		const res = await ErrorReport.request.send('post', url, body) as SuccessFormat;
		this.jobId = res.job_id!;
		return this.jobId!;
	}

	async get(): Promise<void> {
		if (!this.jobId) {
			await this.create();
		}
		const path = `/errors/list/${this.jobId}`
		const res = await ErrorReport.request.send('get', path) as GetErrorReportResponseFormat;
		this.percentage = res.percentage;
		this.status = res.status;
		if (res.total_count) {
			this.total_count = res.total_count;
		}
		if (res.error_file_url) {
			this.errorFileUrl = res.error_file_url;
		}
	}

	async finished(): Promise<boolean> {
		if (!this.jobId) {
			try {
				await this.create();
			} catch (e: unknown) {
				const messages = JSON.parse(e as string);
				if (messages.error_messages &&
					messages.error_messages.main &&
					messages.error_messages.main[0] === 'no data found.') {
					return true;
				}
			}
		}
		await this.get();
		return this.percentage === 100;
	}

	async download(): Promise<any> {
		if (this.report) return this.report;
		if (this.percentage < 100) return [];
		const url = `/errors/list/${this.jobId}/download`;
		const buffer = await ErrorReport.request.send('get', url) as Buffer;
		const jsZip = await JSZip.loadAsync(buffer);
		const fileName = Object.keys(jsZip.files)[0];
		const zipObject = jsZip.files[fileName];
		const text = await zipObject.async('text');
		const lines = text.split(/\r|\n|\r\n/);
		this.report = [];
		for (const line of lines.slice(1)) {
			if (line === '') continue;
			const values = line.split(',').map(v => v.replace(/^"|"$/g, ''));
			this.report.push({
				id: parseInt(values[0]),
				date: new Date(values[1]),
				email: values[2],
				response_code: values[3],
				error_message: values[4],
			});
		}
		return this.report;
	}
}