import { BlastEngine, Usage } from '../src';
import path from 'path';
import config from './config.json';
import { userInfo } from 'os';

describe('Test of begin', () => {
	let client: BlastEngine;
	beforeAll(() => {
		client = new BlastEngine(config.userId, config.apiKey);
	});

	describe('Test as successful', () => {
		test('Get 1 usage', async () => {
			const usages = await Usage.get();
			const date = new Date();
			const month = ('00' + (date.getMonth() + 1)).slice( -2 );
			const year = date.getFullYear();
			expect(usages.length).toBe(1);
			expect(usages[0].month).toBe(parseInt(`${year}${month}`));
		});
		test('Get 3 usage', async () => {
			const usages = await Usage.get(3);
			const date = new Date();
			const month = ('00' + (date.getMonth() + 1)).slice( -2 );
			const year = date.getFullYear();
			date.setMonth(date.getMonth() - 1);
			const lastMonth  = ('00' + (date.getMonth() + 1)).slice( -2 );
			expect(usages.length).toBe(3);
			expect(usages[0].month).toBe(parseInt(`${year}${month}`));
			expect(usages[1].month).toBe(parseInt(`${year}${lastMonth}`));
		});

		test('Get usage detail', async () => {
			const usages = await Usage.get();
			expect(usages.length).toBe(1);
			const usage = usages[0];
			const date = new Date();
			const month = ('00' + (date.getMonth() + 1)).slice( -2 );
			const year = date.getFullYear();
			expect(usage.month).toBe(parseInt(`${year}${month}`));
			await usage.get();
		});

		test('Get usage detail', async () => {
			const usages = await Usage.get();
			expect(usages.length).toBe(1);
			const usage = usages[0];
			const latestUsage = await Usage.getLatest();
			expect(usage.month).toBe(latestUsage.month);
			expect(usage.current).toBe(latestUsage.current);
		});
	});
});