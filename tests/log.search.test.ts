import { BlastEngine, Log } from '../src';
import config from './config.json';

describe('Test of mail', () => {
	beforeAll(() => {
		new BlastEngine(config.userId, config.apiKey);
	});

	describe('Delete editing bulk', () => {
		test('Search mail', async () => {
			const logs = await Log.find({ delivery_type: ['SMTP'] });
			expect(logs[0].deliveryType).toBe('SMTP');
		});
	});
});