var mongoose = require('mongoose');
var fs = require('fs');

// Bootstrap models
var models_path = __dirname;
fs.readdirSync(models_path).forEach(function (file) {
	if (~file.indexOf('.js')) require(models_path + '/' + file)
});

module.exports = {
	User: mongoose.model('User')
};