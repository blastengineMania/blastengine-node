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

### License

MIT.

