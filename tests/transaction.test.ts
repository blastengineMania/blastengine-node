import Client from '../src/';
import config from './config.json';

describe('Test of transaction', () => {
	let client: Client;
	beforeAll(() => {
		client = new Client(config.userId, config.apiKey);
	});

	describe('Test as successful', () => {
		test('Transaction successful.', async () => {
			const transaction = client.Delivery!.transaction();
			try {
				const res = await transaction
					.setFrom(config.from.email, config.from.name)
					.setSubject('Test subject')
					.setTo(config.to)
					.setText('メールの本文')
					.send();
				expect(`${res.delivery_id}`).toMatch(/[0-9]+/);
			} catch (e) {
				expect(true).toBe(false);
			}
		})
	});
});