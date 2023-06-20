import BEObject from './object';
import { SearchLogCondition, SearchLogResponse, SearchLogResult } from '../../types/';
import qs from 'qs';

export default class Log extends BEObject {
	email?: string;
	maillogId?: number;
	openTime?: Date;
	lastResponseMessage?: string;
	lastResponseCode?: string;
	deliveryId?: number;
	deliveryType?: string;
	status?: string;
	deliveryTime?: Date;
	createdTime?: Date;
	updatedTime?: Date;

	static fromJson(params: SearchLogResult): Log {
		const obj = new Log;
		obj.sets(params);
		return obj;
	}

	set(key: string, value: any): Log {
		switch (key) {
			case 'delivery_id':
				this.deliveryId = value;
				break;
			case 'delivery_type':
				this.deliveryType = value;
				break;
			case 'status':
				this.status = value;
				break;
			case 'delivery_time':
				if (value) this.deliveryTime = new Date(value);
				break;
			case 'last_response_code':
				this.lastResponseCode = value;
				break;
			case 'last_response_message':
				this.lastResponseMessage = value;
				break;
			case 'open_time':
				if (value) this.openTime = new Date(value);
				break;
			case 'created_time':
				if (value) this.createdTime = new Date(value);
				break;
			case 'updated_time':
				if (value) this.updatedTime = new Date(value);
				break;
			case 'maillog_id':
				this.maillogId = value;
				break;
			case 'email':
				this.email = value;
				break;
		}
		return this;
	}			

	static async find(params?: SearchLogCondition): Promise<Log[]> {
		if (params?.delivery_start && params.delivery_start instanceof Date) params.delivery_start = params.delivery_start.toISOString();
		if (params?.delivery_end && params.delivery_end instanceof Date) params.delivery_end = params.delivery_end.toISOString();
		const url = `/logs/mails/results?${params ? qs.stringify(params).replace(/%5B[0-9]?%5D/g, '%5B%5D') : ''}`;
		const res = await Log.request.send('get', url) as SearchLogResponse;
		return res.data.map(params => Log.fromJson(params));
	}
}