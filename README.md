# blastengine SDK form Node.js

blastengine is developer friendly email distribution service.

[blastengine](https://blastengine.jp/)

## Usage

### Initialize

```js
const client = new Client(config.userId, config.apiKey);
```

### Transaction email

#### No attachment email

```js
const transaction = client.Delivery!.transaction();
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
const transaction = client.Delivery!.transaction();
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
const bulk = client.bluk();
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

