import crypto from 'crypto';
import Transaction from './libs/delivery/transaction';
import Bulk from './libs/delivery/transaction/bulk';
import Base from './libs/delivery/transaction/base';
import Job from './libs/delivery/transaction/bulk/job';
import Usage from './libs/usage';
import BERequest from './libs/request';

class BlastEngine {
	userId?: string;
	apiKey?: string;
	token?: string;

	constructor(userId: string, apiKey: string) {
		this.userId = userId;
		this.apiKey = apiKey;
		this.generateToken();
		const request = new BERequest(this.token!);
		Base.request = request;
		Job.request = request;
		Usage.request = request;
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

export { BlastEngine, Bulk, Transaction, Usage };
