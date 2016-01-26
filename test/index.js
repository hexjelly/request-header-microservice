var request = require('supertest');
var rewire = require('rewire');
var assert = require('assert');
var server;

// route responses
describe('Routes', function () {
  before(function () {
    server = require('../server').listen(4000);
  });

  after(function () {
    server.close();
  });

  it('/ responds with html', function (done) {
    request(server)
      .get('/')
      .set('Accept', 'text/html')
      .expect('Content-Type', /html/)
      .expect(200, done);
  });

  it('/api responds with json', function (done) {
    request(server)
      .get('/api')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
});

describe('getUserAgentHeaders', function () {
  before(function () {
    var server = rewire('../server');
    getUserAgentHeaders = server.__get__('getUserAgentHeaders');
  });

  it('Gives correct results, test case #1', function () {
    var req = {
      'ip': '192.0.0.1',
      'headers': {
        'user-agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/41.0.2228.0 Safari/537.36',
        'accept-language': 'en-US'
      }
    };
    var given = JSON.stringify(getUserAgentHeaders(req));
    var expected = JSON.stringify({"ip":"192.0.0.1","os":{"name":"Windows","version":"7"},"lang":"en-US"});
    assert.equal(given, expected);
  });

  it('Gives correct results, test case #2', function () {
    var req = {
      'ip': '192.0.0.1',
      'headers': {
        'user-agent': 'Mozilla/5.0 (X11; Linux) KHTML/4.9.1 (like Gecko) Konqueror/4.9',
        'accept-language': 'da,extraneous info here'
      }
    };
    var given = JSON.stringify(getUserAgentHeaders(req));
    var expected = JSON.stringify({"ip":"192.0.0.1","os":{"name":"Linux"},"lang":"da"});
    assert.equal(given, expected);
  });

  it('Gives correct results, test case #3', function () {
    var req = {
      'ip': '192.0.0.1',
      'headers': {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10; rv:33.0) Gecko/20100101 Firefox/33.0',
        'accept-language': ''
      }
    };
    var given = JSON.stringify(getUserAgentHeaders(req));
    var expected = JSON.stringify({"ip":"192.0.0.1","os":{"name":"Mac OS","version":"10.10"},"lang":""});
    assert.equal(given, expected);
  });

  it('Gives correct results, test case #4', function () {
    var req = {
      'ip': '192.0.0.1',
      'headers': {
      }
    };
    var given = JSON.stringify(getUserAgentHeaders(req));
    var expected = JSON.stringify({"ip":"192.0.0.1","os":{},"lang":""});
    assert.equal(given, expected);
  });
});
