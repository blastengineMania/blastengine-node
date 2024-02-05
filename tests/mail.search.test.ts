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

	describe('Find unsubscribe emails', () => {
		test('Search mail', async () => {
			const mails = await Mail.all({ size: 100, list_unsubscribe_mailto: 'mailto:unsubscribe+aaaa@moongift.co.jp' }) as Bulk[];
			console.log(mails);
		});
	});
});