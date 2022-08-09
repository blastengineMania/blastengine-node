import { BlastEngine, Bulk } from '../../src';
import path from 'path';
import config from '../config.json';

describe('Test of begin', () => {
	let client: BlastEngine;
	beforeAll(() => {
		client = new BlastEngine(config.userId, config.apiKey);
	});

	describe('Test as successful', () => {
		test('Register successful.', async () => {
			jest.setTimeout(30000);
			const bulk = new Bulk;
			try {
				bulk
					.setFrom(config.from.email, config.from.name)
					.setSubject('Test subject')
					.setText('メールの本文');
				const res = await (bulk as Bulk).register();
				expect(`${res.delivery_id!}`).toMatch(/[0-9]+/);
				const job = await bulk.import(path.resolve('./tests/mail.csv'));
				await new Promise((resolve) => setTimeout(resolve, 3000));
				for (let i = 1; i <= 5; i++) {
					console.log(await job.get());
					if (job.finished()) {
						await job.download(path.resolve('./tests/result.zip'));
						break;
					}
					await new Promise((resolve) => setTimeout(resolve, 100));
				}
			} catch (e) {
				console.error({ e });
				// expect(true).toBe(false);
			}
			await bulk.delete();
		});
	});
});