import { BlastEngine } from "../..";
import BERequest from "../request";
import BEObject from "../object";
export default class Usage extends BEObject{
	public month?: number;
	public current?: number;
	public remaining?: number;
	public update_time?: string;
	public plan_id?: string;

	constructor(params: UsageResponseDataFormat) {
		super();
		this.setParams(params);
	}

	setParams(params: UsageResponseDataFormat): void {
		this.month = params.month;
		this.current = params.current;
		this.remaining = params.remaining;
		this.update_time = params.update_time;
		this.plan_id = params.plan_id;
	}

	static async get(month_ago: number = 1): Promise<Usage[]> {
		const url = `/usages`;
		const res = await Usage.request.send('get', url, { month_ago }) as UsageResponseFormat;
		return res.data.map(d => new Usage(d));
	}

	static async getLatest(): Promise<Usage> {
		const url = `/usages/latest`;
		const res = await Usage.request.send('get', url) as UsageResponseDataFormat;
		return new Usage(res);
	}

	async get(): Promise<Usage> {
		const url = `/usages/${this.month!}`;
		const res = await Usage.request.send('get', url) as UsageResponseDataFormat;
		this.setParams(res);
		return this;
	}
}