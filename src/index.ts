import crypto from 'crypto';
import Delivery from './libs/delivery/';
import Bulk from './libs/delivery/transaction/bulk';

export default class Client {
	userId = '';
	apiKey = '';
	token = '';

	Delivery?: Delivery;
	Bulk?: Bulk;

	constructor(userId: string, apiKey: string) {
		this.userId = userId;
		this.apiKey = apiKey;
		this.generateToken();
		Delivery.client = this;
		Bulk.client = this;
		this.Delivery = new Delivery;
		this.Bulk = new Bulk;
	}

	bluk(): Bulk {
		return new Bulk;
	}

	generateToken() {
		const str = `${this.userId}${this.apiKey}`;
		const hashHex = crypto
				.createHash('sha256')
				.update(str, 'utf8')
				.digest('hex');
		this.token = Buffer
				.from(hashHex.toLowerCase())
				.toString('base64');
	}
}
