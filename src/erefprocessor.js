/**
 * @fileoverview
 * The eref processor is responsible for hyrdating erefs by fetching ref batches from bootstrap.
 */
var eref = require('eref/main');
var inherits = require('inherits');
var Transform = require('stream/transform');

/**
 * @constructor
 * @extends {Transform}
 */
function ErefProcessor(opts) {
    /**
     * @type {Array}
     * The keys used for decrytion.
     */
    this._keys = [];
    Transform.call(this, opts);
}
inherits(ErefProcessor, Transform);

/**
 * How many decrypted erefs to request in one batch.
 * @type {number}
 */
ErefProcessor.BATCH_SIZE = 20;

/**
 * The timeout to use when decrypting erefs before making a batch request.
 * @type {number}
 */
ErefProcessor.TIMEOUT = 300;

/**
 * The set of all erefs that have not been decoded
 * @type {Object}
 * @private
 */
var encryptedSet = {};  // (erefs joined to one string)

/**
 * The list of all erefs that have not been decoded
 * @type {Array}
 * @private
 */
var encrypted = [];

/**
 * The list of decoded erefs that have not yet been requested from the server.
 * @type {Array}
 * @private
 */
var buffered = [];

/**
 * The callback to call to make requests if new decoded erefs have not been added since the
 * timeout.
 * @type {?function}
 * @private
 */
var drainAfterWait = null;

function map(arr, func) {
    var mapped = [];
    for (var i = 0; i < arr.length; i++) {
        mapped.push(func(arr[i]));
    };
    return mapped;
}

/**
 * Set the keys for decrypting erefs.
 * @param {Array.<string>} The user's secret keys
 */
ErefProcessor.prototype.setKeys = function (keys) {
    // TODO(jj): not sure whose bug this really is
    var validKeys = [];
    for (var i = 0; i < keys.length; i++) {
        (keys[i] !== undefined) && validKeys.push(keys[i]);
    };
    this._keys = validKeys;
};

/**
 * Get the keys for decrypting erefs.
 * @returns {Array.<string>} The user's secret keys
 */
ErefProcessor.prototype.getKeys = function () {
    return this._keys;
};

/** @override */
ErefProcessor.prototype._transform = function (erefs, done) {
    this.handleEncrypted(erefs);
    done();
};

ErefProcessor.prototype.drainBuffer = function () {
    while (buffered.length) {
        this.push(buffered.slice(0, ErefProcessor.BATCH_SIZE));
        buffered = buffered.slice(ErefProcessor.BATCH_SIZE);
    }
};

/**
 * Remove the decrypted content ids from the processor's list of decrypted content.
 * Really bad times here algorithm-wise.
 * @param {Array.<Array>} decrypted The erefs that have been successfully decrypted.
 */
ErefProcessor.prototype.handleDecrypted = function (erefs) {
    var compCache = map(encrypted, function (arr) { return arr.join(); });
    var compDecrypted = map(erefs, function (arr) { return arr.join(); });
    var idx;
    var currDecrypted;

    for (var i = 0; i < compDecrypted.length; i++) {
        currDecrypted = compDecrypted[i];
        if (!encryptedSet[currDecrypted]) {
            continue;
        }
        idx = compCache.indexOf(currDecrypted);
        encrypted.pop(idx);
        encryptedSet[currDecrypted] = null;
    }
};

/**
 * @param {Array.<Array>} erefs
 */
ErefProcessor.prototype.handleEncrypted = function (erefs) {
    var refs = this.maybeDecrypt(erefs);
    if (!refs) {
        return;
    }
    buffered.push.apply(buffered, refs);
    if (buffered.length >= ErefProcessor.BATCH_SIZE) {
        this.drainBuffer();
    }
    var self = this;
    drainAfterWait && clearTimeout(drainAfterWait);
    drainAfterWait = setTimeout(function () {
        self.drainBuffer();
    }, ErefProcessor.TIMEOUT);
};

/**
 * Try to decrypt these erefs using the current user's keys.
 * @param {Array.<Array>} erefs
 */
ErefProcessor.prototype.maybeDecrypt = function (erefs) {
    var decryptedValue;
    var keys = this.getKeys();
    var refs = [];

    decryptedValue = eref.decryptErefs(erefs, keys);
    if (decryptedValue) {
        refs.push(decryptedValue);
        return refs;
    }
    // If we cannot decrypt it now, maybe we can decrypt it later.
    if (!encryptedSet[erefs.join()]) {
        encrypted.push(erefs);
        encryptedSet[erefs.join()] = true;
    }
};

/**
 * Scans all the eref'd content in storage to see if it can be decrypted
 */
ErefProcessor.prototype.processStorage = function () {
    for (var i = 0; i < encrypted.length; i++) {
        this.write(encrypted[i]);
    }
};

// Do not use these functions except when testing
ErefProcessor.prototype._getBuffer = function () {
    return buffered;
};

ErefProcessor.prototype._setBuffer = function (arr) {
    buffered = arr;
};

ErefProcessor.prototype._getCache = function () {
    return encrypted;
};

ErefProcessor.prototype._setCache = function (arr) {
    encrypted = arr;
};

// TODO(jj): One day, toggle back to the decrypted state on user logout or w/e

module.exports = ErefProcessor;
