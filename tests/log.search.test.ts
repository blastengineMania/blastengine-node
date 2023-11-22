import { BlastEngine, Log } from '../src';
import config from './config.json';

describe('Test of mail', () => {
	beforeAll(() => {
		new BlastEngine(config.userId, config.apiKey);
	});

	describe('Search email log', () => {
		test('Search email by deliveryType', async () => {
			const logs = await Log.find({ delivery_type: ['BULK'] });
			expect(logs[0].deliveryType).toBe('BULK');
		});
	});
});