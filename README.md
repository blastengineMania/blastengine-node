# blastengine SDK form Node.js

blastengine is developer friendly email distribution service.

[blastengine](https://blastengine.jp/)

## Usage

### Install

```
npm i blastengine
```

### Import

```js
import { BlastEngine, Transaction, Bulk } from 'blastengine';
// or
const { BlastEngine, Transaction, Bulk } = require('blastengine');
```

### Initialize

```js
new BlastEngine(config.userId, config.apiKey);
```

### Transaction & Bulk email

```ts
const mail = new Mail;
mail
	.setFrom(config.from.email, config.from.name)
	.setSubject('Test subject')
	// Add to
	.addTo('user1@example.com', {name: 'User1', code: 'code1'})
	.addTo('user2@example.com', {name: 'User2', code: 'code2'})
	// Add cc
	.addCc('cc1@example.com')
	.addCc('cc2@example.com')
	// Add bcc
	.addBcc('bcc1@example.com')
	.addBcc('bcc2@example.com')
	// Add attachment
	.addAttachment('file.png')
	.addAttachment('another.png')
	// Set body
	.setText('Content of email __name__, __code__')
	.setHtml('<h1>Content of email<h1> <p>__name__, __code__</p>');
```

#### Send email immediately

```js
await mail.send();
```

#### Send email later

```js
await mail.send(new Date('2021-08-01 00:00:00'));
```

### Transaction email

#### No attachment email

```js
const transaction = new Transaction;
const res = await transaction
	.setFrom(config.from.email, config.from.name)
	.setSubject('Test subject')
	.setTo(config.to)
	.setText('Content of email')
	.setHtml('<h1>Content of email')
	.send();
console.log(res);
// { delivery_id: 22 }
```

#### With attachment email

```js
const transaction = new Transaction;
const res = await transaction
	.setFrom(config.from.email, config.from.name)
	.setSubject('Test subject')
	.setTo(config.to)
	.addAttachment('file.png')
	.addAttachment('another.png')
	.setText('Content of email')
	.setHtml('<h1>Content of email')
	.send();
console.log(res);
// { delivery_id: 22 }
```

### Bulk email

#### Create bulk email

```js
const bulk = new Bluk;
bulk
	.setFrom(config.from.email, config.from.name)
	.setSubject('Test subject')
	.setText('メールの本文 __code1__');
const res = await bulk.register();
console.log(res);
// { delivery_id: 22 }
```

#### Update & add delivery address to bulk

```js
bulk.addTo('test1@example.jp', {key: '__code1__', value: 'value!'});
bulk.addTo('test2@example.jp', {key: '__code1__', value: 'value2!'});
const updateRes = await bulk.update();
console.log(updateRes);
// { delivery_id: 22 }
```

#### Upload delivery addresses by CSV file

```js
const job = await bulk.import(path.resolve('./path/to/csv.csv'));
```

##### Waiting CSV uploaded

```js
while (job.finished()) {
	await job.get();
	await new Promise((resolve) => setTimeout(resolve, 1000));
}
```

##### Download CSV import report

```js
const zipBlob = await job.download();
// or
await job.download(path.resolve('./tests/result.zip'));
```

#### Send bulk email

```js
const sendRes = await bulk.send();
console.log(sendRes);
// { delivery_id: 22 }
```

#### Delete bulk email

```js
const deleteRes = await bulk.delete();
// { delivery_id: 22 }
```

### Usage

#### Get multiple usages

```ts
const usages = await Usage.get(3);
const usage = usages[0];
usage.month // -> 202208
usage.current // ->  44
usage.remaining // ->  9956
usage.update_time // ->  undefined
usage.plan_id // ->  'be-plan-10000
```

#### Get usage detail

```ts
const usages = await Usage.get(3);
const usage = usages[0];
await usage.get();
```

#### Get latest usage

```ts
const usage = await Usage.getLatest();
```

### ChangeLog

#### 2.3.0

Change from Superagent to node-fetch.

### License

MIT.

