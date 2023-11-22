import { BlastEngine, ErrorReport } from '../src';
import config from './config.json';

jest.setTimeout(300000);

describe('Test of begin', () => {
	let client: BlastEngine;
	beforeAll(async () => {
		new BlastEngine(config.userId, config.apiKey);
	});

	describe('Get test report', () => {
		test('Getting successful', async () => {
			const report = new ErrorReport;
			report.setErrorStart(new Date('2023-09-01'));
			while (await report.finished() === false) {
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
			const res = await report.download();
		});
	});
});
