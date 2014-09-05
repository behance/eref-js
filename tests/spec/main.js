var eref = require('eref/main');

var goodKey = 'ac7788c617bdf3c358d6386b5bc87c061741e9c1';
var goodEref = '/okUOT9YFD06uv1urerkRaud8azC1OfLsIIvTsRV/TYG8z5M2XgEllhrl/ktPaE5o3/xSi8iFRCmug==';

describe('Eref js', function() {
    it('decrypt single eref', function() {
        var keys = [goodKey, 'abcd'];
        var contentId = eref.decryptEref(goodEref, keys);
        chai.assert.equal(contentId, '55625958:0/a4d48b98f3df86b392637ce970bf2b498a79b83e');
    });

    it('decrypt eref array', function() {
        var erefs = [goodEref, '/abcde=='];
        var keys = ['abcd', goodKey];
        var contentId = eref.decryptErefs(erefs, keys);
        chai.assert.equal(contentId, '55625958:0/a4d48b98f3df86b392637ce970bf2b498a79b83e');
    });
});
