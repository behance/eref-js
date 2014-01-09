require.config({
  baseUrl: '/',
  paths: {
  	base64: 'lib/base64/base64'
  },
  packages: [{
    name: 'eref',
    location: 'src'
  }, {
    name: 'eref-tests',
    location: 'tests'
  }],
  shim: {}
});