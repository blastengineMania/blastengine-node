import BEObject from './object';
import { CreateEmailResponseFormat, GetEmailResponseFormat, RequestParamsEmailCreate } from '../../types/';

export default class Email extends BEObject {
	public deliveryId: number;
	public emailId?: number;
	public address?: string;
	public insertCode: {[key: string]: string} = {};
	public createdTime?: Date;
	public updatedTime?: Date;

	constructor(delivery_id: number) {
		super();
		this.deliveryId = delivery_id;
	}

	async get(): Promise<number> {
		if (!this.emailId) throw 'Email id is not found.';
		const url = `/deliveries/-/emails/${this.emailId}`;
		const res = await Email.request.send('get', url) as GetEmailResponseFormat;
		res.insert_code.forEach(params => {
			this.insertCode[params.key.replace(/__/, '')] = params.value;
		});
		this.address = res.email;
		this.createdTime = new Date(res.created_time);
		this.updatedTime = new Date(res.updated_time);
		return this.emailId;
	}

	async save(): Promise<number> {
		if (!this.emailId) {
			return this.create();
		} else {
			return this.update();
		}
	}

	async create(): Promise<number> {
		if (!this.deliveryId) throw 'Delivery id is not found.';
		const url = `/deliveries/${this.deliveryId}/emails`
		const res = await Email.request.send('post', url, this.getParams()) as CreateEmailResponseFormat;
		this.emailId = res.email_id;
		return this.emailId;
	}

	async update(): Promise<number> {
		if (!this.emailId) throw 'Email id is not found.';
		const url = `/deliveries/-/emails/${this.emailId}`
		const res = await Email.request.send('put', url, this.getParams()) as CreateEmailResponseFormat;
		return this.emailId;
	}

	async delete(): Promise<boolean> {
		if (!this.emailId) throw 'Email id is not found.';
		const url = `/deliveries/-/emails/${this.emailId}`
		const res = await Email.request.send('delete', url) as CreateEmailResponseFormat;
		return true;
	}

	getParams(): RequestParamsEmailCreate {
		return {
			email: this.address!,
			insert_code: Object.keys(this.insertCode).map(key => {
				return { key: `__${key}__`, value: this.insertCode[key] };
			}),
		};
	}
}