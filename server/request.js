
var url     = require('url');
var config  = require('../config');

var nextId = 1000;

// 
// The request handle constructor
// 
// @param {req} the request object
// @param {res} the response object
// 
var Request = module.exports = function(req, res) {
	this.uuid = nextId++;

	this.req = req;
	this.res = res;

	this.url = url.parse(this.req.url);

	this.log('HTTP ' + this.req.method + ' ' + this.req.url + ' (for ' + req.client.remoteAddress + ')');
};

// -------------------------------------------------------------

// 
// Log a message relating to this request
// 
// @param {message} the message to log
// @return void
// 
Request.prototype.log = function(message) {
	if (config.requestLogging) {
		console.log('[' + this.uuid + '] ' + message);
	}
};

// -------------------------------------------------------------

// 
// Test if the request client supports gzip encoding
// 
// @return boolean
// 
Request.prototype.supportsGzip = function() {
	if (this._gzip != null) {
		return this._gzip;
	}

	if (! conf.gzip) {
		return (this._gzip = false);
	}

	var encodings = this.req.headers['accept-encoding'] || '';
	encodings = encodings.split(',');

	for (var i = 0, c = encodings.length; i < c; i++) {
		if (encodings.indexOf('gzip') >= 0) {
			return (this._gzip = true);
		}
	}

	return (this._gzip = false);
};

// -------------------------------------------------------------

// 
// Send a response to the client
// 
// @param {status} the status code
// @param {headers} an object containing headers
// @param {content} the response body
// @return void
// 
Request.prototype.send = function(status, headers, content) {
	this.res.writeHead(status, headers);
	this.res.write(content);
	this.res.end();
};

// 
// Send a 200 OK response to the client
// 
// @param {type} the content type (eg. "text/plain")
// @param {content} the response body
// @return void
// 
Request.prototype.ok = function(type, content) {
	var headers = {
		'content-type': type
	};

	this.send(200, headers, content);
};

// 
// Send a 400 Not Found response to the client
// 
// @return void
// 
Request.prototype.notfound = function() {
	this.send(404, {'content-type': 'application/json'}, JSON.stringify({
		error: 'Not Found'
	}));
};
