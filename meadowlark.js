var express = require('express');
var app = express();
var path = require('path');
var handlebars = require('express3-handlebars');
var fortune = require('./lib/fortune.js');
var test1 = require('./lib/test-module1.js');
var test2 = require('./lib/test-module2.js');

var hbs = handlebars.create({
	layoutsDir: './views/layouts',
	defaultLayout: 'main',
	extname: '.hbs'
});

app.disable('x-powered-by');
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('view cache', true);

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
	var jsonData = {
		currency: {
			name: 'United States dollars',
			abbrev: 'USD',
		},
		tours: [{
			name: 'Hood River',
			price: '$99.95'
		}, {
			name: 'Oregon Coast',
			price: '$159.95'
		}],
		specialsUrl: '/january-specials',
		currencies: ['USD', 'GBP', 'BTC']
	};
	res.render('home', {
		jsonData: jsonData
	});
});
app.get('/about', function(req, res) {
	res.render('about', {
		fortune: fortune.getfortune(),
		test1: test1(),
		test2: test2.test2()
	});
});
// 定制404 页面
app.use(function(req, res) {
	res.status(404);
	res.render('404', {
		// null 不使用布局 main.hbs,自定义布局
		layout: null 
	});
});
// 定制500 页面
app.use(function(err, req, res, next) {
	console.log(err.stack);
	res.status(500);
	res.render('500');
});
app.listen(app.get('port'), function() {
	console.log('Express started on http://localhost:' +
		app.get('port') + '; press Ctrl-C to terminate.');
});