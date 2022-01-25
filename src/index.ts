import crypto from 'crypto';
import Delivery from './libs/delivery/';
import Transaction from './libs/delivery/transaction';
import Bulk from './libs/delivery/transaction/bulk';
import Base from './libs/delivery/transaction/base';

class BlastEngine {
	userId?: string;
	apiKey?: string;
	token?: string;

	constructor(userId: string, apiKey: string) {
		this.userId = userId;
		this.apiKey = apiKey;
		this.generateToken();
		Delivery.client = this;
		Base.client = this;
	}

	generateToken() {
		if (!this.userId) throw 'There is no userId';
		if (!this.apiKey) throw 'There is no apiKey';
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

export { BlastEngine, Bulk, Transaction };
