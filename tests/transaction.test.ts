import { BlastEngine, Transaction } from '../src/';
import config from './config.json';
import path from 'path';

describe('Test of transaction', () => {
	beforeAll(() => {
		new BlastEngine(config.userId, config.apiKey);
	});

	describe('Test as successful', () => {
		test('Transaction successful.', async () => {
			const transaction = new Transaction;
			try {
				transaction
					.setFrom(config.from.email, config.from.name)
					.setSubject('Test subject')
					.setText('メールの本文');
				transaction.setTo(config.to)
				const res = await transaction.send();
				expect(`${res.delivery_id}`).toMatch(/[0-9]+/);
				expect(`${transaction.deliveryId}`).toMatch(/[0-9]+/);
			} catch (e) {
				expect(true).toBe(false);
			}
		})

		test('Transaction with attachment successful.', async () => {
			const transaction = new Transaction;
			try {
				transaction
					.setFrom(config.from.email, config.from.name)
					.setSubject('Test subject')
					.setText('メールの本文')
					.addAttachment(path.resolve('README.md'))
					.addAttachment(path.resolve('package.json'));
				transaction.setTo(config.to);
				const res = await transaction.send();
				expect(`${res.delivery_id}`).toMatch(/[0-9]+/);
			} catch (e) {
				console.error(e);
				expect(true).toBe(false);
			}
		})
	});
});