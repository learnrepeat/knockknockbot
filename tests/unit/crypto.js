const crypto = require('common/crypto');
const should = require('should');

describe('encrypt and decrypt text', function() {
	const plainText = "derp";
	let encryptedText;

	it('should encrypt text', async function() {
		encryptedText = await crypto.encryptText(plainText);
		should.notEqual(plainText, encryptedText)
	});

	it('should decrypt text', async function() {
		const decryptedText = await crypto.decryptText(encryptedText);
		should.equal(plainText, decryptedText)
	});

	it('should have a unique iv and encrypted text every time', async function() {
		const encryptedIVs = {}
		const encryptedValues = {}

		for(var i=0; i<3; i++) {
			const encrypted = await crypto.encryptText(plainText);
			const encryptedIV = encrypted.split(':')[0];
			const encryptedValue = encrypted.split(':')[1];
			should.not.exist(encryptedIVs[encryptedIV]);
			should.not.exist(encryptedValues[encryptedValue]);

			encryptedIVs[encryptedIV] = 1;
			encryptedValues[encryptedValue] = 1;
		}
	});	
});