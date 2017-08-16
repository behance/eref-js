require.config({
  baseUrl: '/',
  paths: {
    sinon: 'node_modules/sinon/lib/sinon',
    'sinon-chai': 'node_modules/sinon-chai/lib/sinon-chai',
    chai: 'node_modules/chai/chai',
    inherits: 'node_modules/inherits/inherits',
    'event-emitter': 'node_modules/events-event-emitter/src/event-emitter'
  },
  packages: [{
    name: 'eref',
    location: 'src'
  }, {
    name: 'eref-tests',
    location: 'tests'
  },{
    name: "stream",
    location: "node_modules/stream/src"
  }],
  shim: {
    'sinon': {
      exports: 'sinon'
    }
  }
});
