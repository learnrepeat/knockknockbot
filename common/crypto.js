const config = require('config');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

function encryptText(plainText) {
	if (!plainText || plainText == "") {
		return;
	}

	let iv = crypto.randomBytes(config.get('crypto.ivLength'));
	let cipher = crypto.createCipheriv(algorithm, new Buffer(config.get('crypto.encryptionKey')), iv);
	
	let encrypted = cipher.update(plainText);
	encrypted = Buffer.concat([encrypted, cipher.final()]);
	return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptText(encryptedText) {
	if (!encryptedText || encryptedText == "") {
		return;
	}
	
	let textParts = encryptedText.split(':');
	let iv = new Buffer(textParts.shift(), 'hex');
	let encryptedValue = new Buffer(textParts.join(':'), 'hex');
	
	let decipher = crypto.createDecipheriv(algorithm, new Buffer(config.get('crypto.encryptionKey')), iv);
	let decrypted = decipher.update(encryptedValue);

	decrypted = Buffer.concat([decrypted, decipher.final()]);
	return decrypted.toString();
}

module.exports = exports = {
	encryptText,
	decryptText
}