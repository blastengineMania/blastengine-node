import { BlastEngine, Mail, Bulk } from '../src';
import config from './config.json';

describe('Test of mail', () => {
	beforeAll(() => {
		new BlastEngine(config.userId, config.apiKey);
	});

	describe('Delete editing bulk', () => {
		test('Search mail', async () => {
			const mails = await Mail.find({ size: 100, delivery_type: ['BULK'], status: ['EDIT'] }) as Bulk[];
			for (const bulk of mails) {
				await bulk.delete();
			}
		});
	});
});