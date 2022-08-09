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
bulk.setTo('test1@example.jp', {key: '__code1__', value: 'value!'});
bulk.setTo('test2@example.jp', {key: '__code1__', value: 'value2!'});
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

### License

MIT.

