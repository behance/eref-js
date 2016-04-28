require.config({
  baseUrl: '/',
  paths: {
    base64: 'lib/base64/base64',
    sinon: 'lib/sinonjs/sinon',
    'sinon-chai': 'node_modules/sinon-chai/lib/sinon-chai',
    chai: 'node_modules/chai/chai',
    inherits: 'lib/inherits/inherits',
    'event-emitter': 'lib/event-emitter/src/event-emitter'
  },
  packages: [{
    name: 'eref',
    location: 'src'
  }, {
    name: 'eref-tests',
    location: 'tests'
  },{
    name: "stream",
    location: "lib/stream"
  }],
  shim: {
    'sinon': {
      exports: 'sinon'
    }
  }
});
