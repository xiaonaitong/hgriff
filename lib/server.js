var http = require('http'),
    url = require('url'),
    fs = require('fs'),
    path = require('path'),
    socket = require('socket.io'),
    utils = require('./utils.js'),
    server;

var Fixture = require('./fixture.js').Fixture,
		fixture = new Fixture();

server = http.createServer(function (req, res) {
		var uri = url.parse(req.url).pathname,
			  filename = path.join(process.cwd(), uri);

		if( utils.isFavicon(uri) ) {
			error404(res);
			return;
		}

		if( uri.indexOf('/__src__') == 0) {	
			var resource = uri.substring('/__src__'.length);
			serveStatic(resource, res);
			return;
		}else if(!utils.isHtmlResource(uri)) {
			serveStatic(uri, res);
		}else if(path.existsSync(filename)) {
			fixture.setup(uri, function (body) {
				res.writeHead(200,{'Cache-Control':'no-cache'});
				res.end(body);
				return;
			});
		}else {
			error404(res);
			return;
		}
});

function serveStatic(resource, res) {
			if( /jquery\.js$/i.test(resource))
				var filename = __dirname + '/jquery.js';
			else
				var filename = path.join(process.cwd(), resource);

			res.writeHead(200,{'Cache-Control':'no-cache'});
			res.end( fs.readFileSync(filename) );
			return;
}
function error404(res) {
            res.writeHead(404, {'content-type': 'text/plain'});
            res.end('404 not Found\n');
            return;
}

server.listen(8080);
socket.listen(server).on('connection', function (client) {
	client.on('message', function (message) {
		var uri = message,
				file = path.join(process.cwd(), uri);
		fixture.addClient(client);
	});

	client.on('disconnect', function () {
		fixture.rmClient(client);
	});
});

