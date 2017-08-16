var Arc4 = require('eref/arc4');

function arrayClone(object) {
	var length = object.length;

	// If length is not a number the following it false. This case is kept for
	// backwards compatibility since there are callers that pass objects that are
	// not array like.
	if (length > 0) {
		var rv = new Array(length);
		for (var i = 0; i < length; i++) {
			rv[i] = object[i];
		}
		return rv;
	}
	return [];
}

describe('Arc4 tests', function() {
	it('test encryption and decryption', function() {
		var key = [0x25, 0x26, 0x27, 0x28];
		var startArray = [0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67];
		var byteArray = [0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67];

		var arc4 = new Arc4();
		arc4.setKey(key);
		arc4.crypt(byteArray);

		chai.assert.deepEqual(byteArray, [0x51, 0xBB, 0xDD, 0x95, 0x9B, 0x42, 0x34]);

		// The same key and crypt call should unencrypt the data back to its original
		// state
		arc4 = new Arc4();
		arc4.setKey(key);
		arc4.crypt(byteArray);
		chai.assert.deepEqual(byteArray, startArray);
	});


	it('test discard bytes', function() {
		var key = [0x25, 0x26, 0x27, 0x28];
		var data = [0x61, 0x62, 0x63, 0x64, 0x65, 0x66, 0x67];

		var arc4 = new Arc4();
		arc4.setKey(key);
		arc4.discard(256);
		var withDiscard = arrayClone(data);
		arc4.crypt(withDiscard);

		// First encrypting a dummy array should give the same result as
		// discarding.
		arc4 = new Arc4();
		arc4.setKey(key);
		var withCrypt = arrayClone(data);
		arc4.crypt(new Array(256));
		arc4.crypt(withCrypt);
		chai.assert.deepEqual(withDiscard, withCrypt);
	});
});