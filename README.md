# blastengine SDK form Node.js

## Usage

### Initialize

```js
const client = new Client(config.userId, config.apiKey);
```

### Transaction email

```js
const transaction = client.Delivery!.transaction();
const res = await transaction
	.setFrom(config.from.email, config.from.name)
	.setSubject('Test subject')
	.setTo(config.to)
	.setText('メールの本文')
	.send();
console.log(res);
// { delivery_id: 22 }
```

### Bulk email

```js
const bulk = client.bluk();
bulk
	.setFrom(config.from.email, config.from.name)
	.setSubject('Test subject')
	.setText('メールの本文 __code1__');
const res = await bulk.register();
console.log(res);
// { delivery_id: 22 }
bulk.setTo('test1@example.jp', {key: '__code1__', value: 'value!'});
bulk.setTo('test2@example.jp', {key: '__code1__', value: 'value2!'});
const updateRes = await bulk.update();
console.log(updateRes);
// { delivery_id: 22 }
const sendRes = await bulk.send();
console.log(sendRes);
// { delivery_id: 22 }
```

### License

MIT.

