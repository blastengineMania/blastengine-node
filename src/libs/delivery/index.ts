import Client from '../../';
import Transaction from './transaction';
import Base from './transaction/base';

export default class Delivery {
	static client?: Client;

	constructor() {
		Base.client = Delivery.client;
	}

	transaction(): Transaction {
		return new Transaction;
	}
}