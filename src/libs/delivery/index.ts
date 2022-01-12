import Client from '../../';
import Transaction from './transaction';

export default class Delivery {
	static client?: Client;

	constructor() {
		Transaction.client = Delivery.client;
	}

	transaction(): Transaction {
		return new Transaction;
	}
}