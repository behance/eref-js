# eref-js

## Background
### What is an eref?
An eref is an [ARC4][1] encrypted reference that contains an encrypted contentId in the Livefyre system.

## Install
```npm install```

## Test
To run in phantomjs: ```npm test```
To run in the browser, ```npm start``` and navigate to http://localhost:{port}/tests/runner.html

## API
### `decryptErefs(arrayOfErefs, arrayOfKeys)`

Given an array of erefs and an array of possible keys to decode the erefs, this function will return the first contentId of an eref it is able to decode, or undefined if none are correctly decoded.

###`decryptEref(eref, arrayOfKeys)`

Given an single eref and an array of keys, attempts to decrypt the eref and return a contentId. If it is not possible, will return undefined.


  [1]: http://en.wikipedia.org/wiki/RC4
