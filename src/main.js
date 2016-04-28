var Arc4 = require('./arc4');
var base64 = require('base64');

/**
 * Turns a string into an array of bytes; a "byte" being a JS number in the
 * range 0-255.
 * @param {string} str String value to arrify.
 * @return {!Array.<number>} Array of numbers corresponding to the
 *         UCS character codes of each character in str.
 */
function stringToByteArray(str) {
    var output = [], p = 0, c;
    for (var i = 0; i < str.length; i++) {
        c = str.charCodeAt(i);
        while (c > 0xff) {
            output[p++] = c & 0xff;
            c >>= 8;
        }
        output[p++] = c;
    }
    return output;
}

/**
 * Turns an array of numbers into the string given by the concatenation of the
 * characters to which the numbers correspond.
 * @param {Array} array Array of numbers representing characters.
 * @return {string} Stringification of the array.
 */
function byteArrayToString(array) {
    return String.fromCharCode.apply(null, array);
}

function arc4Decrypt(key, data) {
    var arc4 = new Arc4();
    key = stringToByteArray(key);
    data = base64.atob(data);

    data = stringToByteArray(data);
    arc4.setKey(key);
    arc4.crypt(data);
    return byteArrayToString(data);
}

var EREF_REGEX = /^eref:\/\/([^:\/]+:[^:\/]+\/[^:\/]+)$/;

/**
 * @param {string} rawEref
 * @param {string} key
 * @return {?string}
 */
function decryptEref(rawEref, key) {
    var decryptedEref = arc4Decrypt(key, rawEref);
    var match = decryptedEref.match(EREF_REGEX);
    if (match) {
        return match[1];
    }
    return null;
}

var eref = {};

/**
 * @param {string} rawEref
 * @param {Array.<string>} keys
 * @return {string|undefined}
 */
eref.decryptEref = function(rawEref, keys) {
    var decryptedEref;
    for (var i=0, l=keys.length; i<l; i++) {
        decryptedEref = decryptEref(rawEref, keys[i]);
        if (decryptedEref) {
            return decryptedEref;
        }
    }
    return null;
};

/**
 * @param {Array.<string>} rawErefs
 * @param {Array.<string>} keys
 * @return {string|undefined}
 */
eref.decryptErefs = function(rawErefs, keys) {
    var raw, decryptedEref;
    for (var i=0, l=rawErefs.length; i<l; i++) {
        raw = rawErefs[i];
        decryptedEref = eref.decryptEref(raw, keys);
        if (decryptedEref) {
            return decryptedEref;
        }
    }
};

module.exports = eref;
