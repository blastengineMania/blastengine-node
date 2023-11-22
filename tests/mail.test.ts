import { BlastEngine, Mail } from '../src/';
import config from './config.json';
import path from 'path';

jest.setTimeout(30000);

describe('Test of mail', () => {
	beforeAll(() => {
		new BlastEngine(config.userId, config.apiKey);
	});

	describe('Test as successful', () => {
		test('Mail (transaction) successful.', async () => {
			const mail = new Mail;
			mail
				.setFrom(config.from.email, config.from.name)
				.setSubject('Test subject')
				.addTo(config.to)
				.setText('メールの本文');
			await mail.send();
			expect(typeof mail.deliveryId).toBe('number');
		});
		
		test('Mail (transaction) w/ insert code successful.', async () => {
			const mail = new Mail;
			mail
				.setFrom(config.from.email, config.from.name)
				.setSubject('Test subject')
				.addTo(config.to, { name1: 'No 1' })
				.setText('メールの本文 __name1__');
			await mail.send();
			expect(typeof mail.deliveryId).toBe('number');
		});

		test('Mail (Transaction) with attachment successful.', async () => {
			const mail = new Mail;
			mail
				.setFrom(config.from.email, config.from.name)
				.setSubject('Test subject')
				.addTo(config.to)
				.setText('メールの本文')
				.addAttachment(path.resolve('README.md'))
				.addAttachment(path.resolve('package.json'));
			await mail.send();
			expect(typeof mail.deliveryId).toBe('number');
		});

		test('Mail (transaction) with cc successful.', async () => {
			const mail = new Mail;
			mail
				.setFrom(config.from.email, config.from.name)
				.setSubject('Test subject')
				.addTo(config.to)
				.addCc(config.cc1)
				.addCc(config.cc2)
				.addBcc(config.bcc1)
				.addBcc(config.bcc2)
				.setText('メールの本文');
			await mail.send();
			expect(typeof mail.deliveryId).toBe('number');
		});

		test('Mail (bulk) successful.', async () => {
			const mail = new Mail;
			mail
				.setFrom(config.from.email, config.from.name)
				.setSubject('Test subject')
				.addTo(config.to, { name1: 'No 1' })
				.addTo(config.cc1, { name1: 'No 2' })
				.setText('メールの本文 __name1__');
			await mail.send();
			expect(typeof mail.deliveryId).toBe('number');
		});

		test('Mail (bulk) with attachments successful.', async () => {
			const mail = new Mail;
			mail
				.setFrom(config.from.email, config.from.name)
				.setSubject('Test subject')
				.addTo(config.to, { name1: 'No 1' })
				.addTo(config.cc1, { name1: 'No 2' })
				.addAttachment(path.resolve('README.md'))
				.setText('メールの本文 __name1__');
			await mail.send();
			expect(typeof mail.deliveryId).toBe('number');
		});

		test('Mail (bulk) with 50+ recipients successful.', async () => {
			const mail = new Mail;
			mail
				.setFrom(config.from.email, config.from.name)
				.setSubject('Test subject')
				.setText('メールの本文 __name1__');
			for (const i of Array(51).keys()) {
				mail.addTo(`atsushi+${1}@moongift.co.jp`, { name1: `No ${i}` });
			}
			await mail.send();
			expect(typeof mail.deliveryId).toBe('number');
		});
	});
});