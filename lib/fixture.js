var jsdom = require('jsdom'),
    path = require('path'),
    util = require('util'),
    fs = require('fs'),
    utils = require('./utils.js');

exports.Fixture = Fixture;

function Fixture () {
	this.resources = {};
	this.clients = [];
};


function removeHttpParam (href) {
	var pos = href.indexOf('?');
	return pos == -1 ? href : href.substring(0, pos);
}

Fixture.prototype.addClient = function addClient (client) {
		this.clients.push(client);
};

Fixture.prototype.rmClient = function rmClient (client) {
		this.clients.splice(this.clients.indexOf(client), 1);
};

Fixture.prototype.addResource = function addResource (uris) {
	var self = this;
	uris.forEach(function (uri) {
		if( !self.resources[uri]) {
				self.resources[uri] = 0;
				self.watch(uri);
		}
		self.resources[uri] += 1;
	});
};

Fixture.prototype.watch = function watch (uri) {
	var self = this,
			file = path.join(process.cwd(), uri);
	fs.watchFile(file, function(current, prev) {
		if( new(Date)(prev.mtime).valueOf() == 
				new(Date)(current.mtime).valueOf()) { return}
		self.notifyClient();
	});
};

Fixture.prototype.notifyClient = function notifyClient () {
	for(i in this.clients) {
			this.clients[i].send('changed');
	}
};

Fixture.prototype.setup = function (uri, processor) {
	var self = this;

	jsdom.env(__dirname + '/iframe.html', ['jquery.js'],
			function( errors, window) {
				var internalPath = '/__src__' + uri,
					localPath = path.join(process.cwd(), uri);
                window.$('#iframe').attr('src', internalPath);
				getDependResource(localPath, function (links) {
					self.addResource(links);
				});
				self.addResource([uri]);
				var injected = window.document.outerHTML;
				processor( injected );
			}
	);
};

function getDependResource(path, callback) {
	var links = [];
	jsdom.env(path, [__dirname + '/jquery.js'],
			function(errors, window) {
				window.$('link[rel="stylesheet"][href]').each(function () {
							links.push(window.$(this).attr('href'));
					});
				window.$('link[type="text/javascript"][src]').each(function () {
							links.push(window.$(this).attr('src'));
					});
				 links = links.filter(utils.isLocal).map(removeHttpParam);
				 callback(links);
			}
	);
}
