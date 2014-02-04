var ErefProcessor = require('eref/erefprocessor');
var expect = require('chai').expect;
var assert = require('chai').assert;
chai.use(require('sinon-chai'));
var sinon = require('sinon');

describe('annotations/adapters/erefprocessor', function () {
    var erefs = ["5Ry307/MTvts8ae/CMJmbvhLvu0rfY7I0uGFu4v8Kxaog/pkvW9ueyMC5JNv6jIEW2Qxu0SDxB19ISeE7Kw5wbfdBkeOOVmwz73d22wUcM4TcKv1+lZDFo6otWjjs70=","4IenF5dFPjxjpuub7ZTBTPTwfPX4DQHzbwG09+sZNEfFRC49WuvJmYreptXbiYOQP7qHAYuMjjb8zZkJllBViKokcbVKp9LiQDCTfOqaYKykoBEoDRaotbdE7y3KiKk="];
    var erefProcessor = new ErefProcessor();
    var keys = ["7072e7b43cefe93d9b632a41525fca8389b13cb2", "cbeee2ca676b7e9641f2c177d880e3ca3ecc295a"];
    var decrypted = '42f87a9c928243be8fa3ec5ab765425b@livefyre.com:0/1bba2be6bac77a8ea642af59089d0c5460cbdc66';

    before(function () {
        erefProcessor.setKeys(keys);
    });

    describe('#handleEncrypted', function () {
        it('should push decryped erefs to a buffer', function () {
            erefProcessor.write(erefs);
            var buffered = erefProcessor._getBuffer();
            expect(buffered[0]).to.equal(decrypted);
        });

        it('should drain the buffer when it reaches the batch size', function (done) {
            var spy = sinon.spy(erefProcessor, 'drainBuffer');
            var fakeBuffer = []
            for (var i = 0; i < ErefProcessor.BATCH_SIZE; i++) {
                fakeBuffer.push(erefs);
            }
            erefProcessor._setBuffer(fakeBuffer);
            erefProcessor.write(erefs, function() {
                assert(spy.called);
                spy.restore();
                done();
            });
        });

        it('should drain the buffer after a timeout', function (done) {
            var spy = sinon.spy(erefProcessor, 'drainBuffer');
            erefProcessor.write(erefs);

            setTimeout(function () {
                assert(spy.called);
                spy.restore();
                done();
            }, 500);
        });
    });

    describe('#drainBuffer', function () {
        it('should clear the buffer', function () {
            erefProcessor.write(erefs);
            erefProcessor.drainBuffer();
            assert(erefProcessor._getBuffer().length === 0);
        });
    });

    describe('#handleDecrypted', function () {
        it('should remove found items from the cache', function () {
            erefProcessor.setKeys([]);  // disable decoding
            erefProcessor.write(erefs);
            erefProcessor.handleDecrypted([erefs]);
            assert(erefProcessor._getCache().length === 0);
        });
    });
});
