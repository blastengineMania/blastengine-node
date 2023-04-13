import { BlastEngine, ErrorReport } from '../src';
import config from './config.json';

describe('Test of begin', () => {
	let client: BlastEngine;
	beforeAll(async () => {
		new BlastEngine(config.userId, config.apiKey);
	});

	describe('Get test report', () => {
		test('Getting successful', async () => {
			const report = new ErrorReport;
			try {
				report.setErrorStart(new Date('2023-03-01'));
				while (await report.finished() === false) {
					await new Promise((resolve) => setTimeout(resolve, 100));
				}
				const res = await report.download();
				// expect(res).toBeInstanceOf(Array);
			} catch (e) {
				console.error({ e });
				expect(true).toBe(false);
			}
		});
	});
});
