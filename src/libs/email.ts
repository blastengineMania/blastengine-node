import BEObject from './object';

export default class Email extends BEObject {
	public delivery_id: number;
	public email_id?: number;
	public address?: string;
	public insert_code: {[key: string]: string} = {};
	public created_time?: Date;
	public updated_time?: Date;

	constructor(delivery_id: number) {
		super();
		this.delivery_id = delivery_id;
	}

	async get(): Promise<number> {
		if (!this.email_id) throw 'Email id is not found.';
		const url = `/deliveries/-/emails/${this.email_id}`;
		const res = await Email.request.send('get', url) as GetEmailResponseFormat;
		this.email_id = res.email_id;
		res.insert_code.forEach(params => {
			this.insert_code[params.key.replace(/__/, '')] = params.value;
		});
		this.address = res.email;
		this.created_time = new Date(res.created_time);
		this.updated_time = new Date(res.updated_time);
		return res.email_id;
	}

	async save(): Promise<number> {
		if (!this.email_id) {
			return this.create();
		} else {
			return this.update();
		}
	}

	async create(): Promise<number> {
		if (!this.delivery_id) throw 'Delivery id is not found.';
		const url = `/deliveries/${this.delivery_id}/emails`
		const res = await Email.request.send('post', url, this.getParams()) as CreateEmailResponseFormat;
		this.email_id = res.email_id;
		return res.email_id;
	}

	async update(): Promise<number> {
		if (!this.email_id) throw 'Email id is not found.';
		const url = `/deliveries/-/emails/${this.email_id}`
		const res = await Email.request.send('put', url, this.getParams()) as CreateEmailResponseFormat;
		this.email_id = res.email_id;
		return this.email_id;
	}

	async delete(): Promise<boolean> {
		if (!this.email_id) throw 'Email id is not found.';
		const url = `/deliveries/-/emails/${this.email_id}`
		const res = await Email.request.send('delete', url) as CreateEmailResponseFormat;
		return true;
	}

	getParams(): RequestParamsEmailCreate {
		return {
			email: this.address!,
			insert_code: Object.keys(this.insert_code).map(key => {
				return { key: `__${key}__`, value: this.insert_code[key] };
			}),
		};
	}
}