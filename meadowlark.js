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
	extname: '.hbs',
	helpers: {
		section: function(name, options) {
			if (!this._sections) this._sections = {};
			this._sections[name] = options.fn(this);
			return null;
		}
	}
});

app.disable('x-powered-by');
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');
app.set('view cache', true);

app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));

// 中间件套用组件
app.use(function(req, res, next) {
	if (!res.locals.partials) {
		res.locals.partials = {};
	}
	res.locals.partials.weather = getWeatherData();
	next();
});

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

// test hbs section
app.get('/hbs-section', function(req, res) {
	res.render('hbs-section');
})

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

function getWeatherData() {
	return {
		locations: [{
			name: 'Portland',
			forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
			iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
			weather: 'Overcast',
			temp: '54.1 F (12.3 C)',
		}, {
			name: 'Bend',
			forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
			iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
			weather: 'Partly Cloudy',
			temp: '55.0 F (12.8 C)',
		}, {
			name: 'Manzanita',
			forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
			iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
			weather: 'Light Rain',
			temp: '55.0 F (12.8 C)',
		}, ],
	};
}