import BEObject from './object';
import JSZip from 'jszip';
import strftime from 'strftime';

strftime.timezone(9 * 60);

export default class ErrorReport extends BEObject {
	public job_id?: number;
	public percentage: number = 0;
	public status: string = '';
	public error_file_url: string = '';
	public total_count: number = 0;
	public report?: {[key: string]: string | number | Date}[];
	private _error_start?: string;
	private _error_end?: string;
	private _email?: string;
	private _response_code: number[] = [];

	constructor() {
		super();
	}

	setErrorStart(start: Date): ErrorReport {
		this._error_start = strftime('%FT%T%z', start).replace('+0900', '+09:00')
		return this;
	}

	setErrorEnd(end: Date): ErrorReport {
		this._error_end = strftime('%FT%T%z', end).replace('+0900', '+09:00')
		return this;
	}

	setEmail(email: string): ErrorReport {
		this._email = email;
		return this;
	}

	setResponseCode(code: number[]): ErrorReport {
		this._response_code = code;
		return this;
	}


	async create(): Promise<number> {
		const url = `/errors/list`;
		const body: {[key: string]: string | number[]} = {};
		if (this._error_start) body['error_start'] = this._error_start;
		if (this._error_end) body['error_end'] = this._error_end;
		if (this._email) body['email'] = this._email;
		if (this._response_code.length > 0) body['response_code'] = this._response_code;
		const res = await ErrorReport.request.send('post', url, body) as SuccessFormat;
		this.job_id = res.job_id!;
		return this.job_id!;
	}

	async get(): Promise<void> {
		if (!this.job_id) {
			await this.create();
		}
		const path = `/errors/list/${this.job_id}`
		const res = await ErrorReport.request.send('get', path) as GetErrorReportResponseFormat;
		this.percentage = res.percentage;
		this.status = res.status;
		if (res.total_count) {
			this.total_count = res.total_count;
		}
		if (res.error_file_url) {
			this.error_file_url = res.error_file_url;
		}
	}

	async finished(): Promise<boolean> {
		if (!this.job_id) {
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
		const url = `/errors/list/${this.job_id}/download`;
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