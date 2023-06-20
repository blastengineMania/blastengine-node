import BEObject from "./object";
import { UsageResponseDataFormat, UsageResponseFormat } from '../../types/';

export default class Usage extends BEObject{
	public month?: number;
	public current?: number;
	public remaining?: number;
	public updateTime?: string;
	public planId?: string;

	constructor(params: UsageResponseDataFormat) {
		super();
		this.setParams(params);
	}

	setParams(params: UsageResponseDataFormat): void {
		this.month = params.month;
		this.current = params.current;
		this.remaining = params.remaining;
		this.updateTime = params.update_time;
		this.planId = params.plan_id;
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