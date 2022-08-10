import { BlastEngine, Bulk } from '../../src';
import config from '../config.json';

describe('Test of begin', () => {
	let client: BlastEngine;
	beforeAll(async () => {
		client = new BlastEngine(config.userId, config.apiKey);
		/*
		for (let i = 300; i <= 350; i++) {
			const bulk = new Bulk;
			bulk.delivery_id = i;
			try {
				await bulk.delete();
				console.log(`Delete bulk delivery_id: ${i}`);
			} catch (e) {
			}
		}
		*/
	});

	describe('Test as successful', () => {
		test('Register successful.', async () => {
			const bulk = new Bulk;
			try {
				bulk
					.setFrom(config.from.email, config.from.name)
					.setSubject('Test subject')
					.setText('メールの本文');
				const res = await (bulk as Bulk).register();
				expect(`${res.delivery_id!}`).toMatch(/[0-9]+/);
				await bulk.delete();
			} catch (e) {
				console.error({ e });
				expect(true).toBe(false);
			}
		})
		test('Update successful.', async () => {
			const bulk = new Bulk;
			try {
				bulk
					.setFrom(config.from.email, config.from.name)
					.setSubject('Test subject')
					.setText('メールの本文 __code1__');
				const res = await (bulk as Bulk).register();
				expect(`${res.delivery_id}`).toMatch(/[0-9]+/);
				bulk.setTo(config.to, {key: '__code1__', value: '値'});
				const updateRes = await bulk.update();
				expect(updateRes.delivery_id! === bulk.delivery_id!);
				await bulk.delete();
			} catch (e) {
				console.error({ e });
				expect(true).toBe(false);
			}
		});
		test('Send bulk email', async () => {
			const bulk = new Bulk;
			try {
				bulk
					.setFrom(config.from.email, config.from.name)
					.setSubject('Test subject')
					.setText('メールの本文 __code1__');
				const res = await (bulk as Bulk).register();
				expect(`${res.delivery_id!}`).toMatch(/[0-9]+/);
				bulk.setTo(config.to, {key: '__code1__', value: '値'});
				bulk.setTo('test@moongift.jp', {key: '__code1__', value: '値2'});
				const updateRes = await bulk.update();
				expect(updateRes.delivery_id! === bulk.delivery_id!);
				const sendRes = await bulk.send();
				expect(sendRes.delivery_id! === bulk.delivery_id!);
			} catch (e) {
				console.error({ e });
				expect(true).toBe(false);
			}
		});
	});
});
