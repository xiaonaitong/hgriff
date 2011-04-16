function isLocal (uri) {
	var http_protocol = /^https?\:\/\/.*/i;
	return !http_protocol.test(uri);
}
function isLocalOrInContext(uri, context) {
	return isLocal(uri) || uri.indexOf(context) == 0;
}
function isHtmlResource(uri) {
	return /\.html$/i.test(uri) || /^[^.]*$/i.test(uri);
}
function isFavicon(uri) {
	return uri === '/favicon.ico';
}

exports.isLocal =isLocal;
exports.isLocalOrInContext = isLocalOrInContext;
exports.isHtmlResource = isHtmlResource;
exports.isFavicon = isFavicon;
