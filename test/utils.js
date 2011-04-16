var vows = require('vows'),
		assert = require('assert'),
		utils = require('../utils.js');

vows.describe('utils.isLocal check whether a uri is local').addBatch({
		'when check ordinary http uri': {
			topic: function() { return utils.isLocal('http://example.com/') },

			'it should be false': function (topic) {
				assert.ok(!topic);
			}
		},
		'when check ordinary security http protocol uri': {
		  topic: function() { return utils.isLocal('https://google.com/') },

			'it should be false': function (topic) {
				assert.ok(!topic);
			}
		},
		'when check local uri': {
			topic: function() { return utils.isLocal('/typical.html')},

			'it should be true': function (topic) {
				assert.ok(topic);
			}
		},
		'when the server is listen on server localhost port 8080, then uri http://localhost:8080/': {
			topic: function() { return utils.isLocalOrInContext(
								 'http://localhost:8080/something', 'http://localhost:8080')},

			'it should be true': function (topic) {
				assert.ok(topic);
			}
		}
	}).addBatch({
		'when the uri is postfix with html': {
			topic: function() {return utils.isHtmlResource('/some/path/user.html')},

			'should be recognized as html resource': function (topic) {
				assert.ok(topic);
			}
		}
}).export(module);
