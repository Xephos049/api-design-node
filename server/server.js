var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var fs = require('fs');
var _ = require('lodash');
var morgan = require('morgan');

var cbs = [
morgan,
express.static,
bodyParser.Url,
bodyParser.Json,
// [routes]
]

// app.use(function());

var accessLogStream = fs.createWriteStream(__dirname+'/acess.log',{flags:'a'});

app.use(morgan('dev', {stream: accessLogStream}));
// app.use(morgan);

app.use(express.static('client'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// app.param('id', function(req, res,next,id) {
// 	var lion = _.find(lions,{id, id});
// 	if(lion) {
// 		req.lion = lion;
// 		next();
// 	} else { 
// 		res.setnd();
// 	}
// });

var lions = [];
var id = 0;

// app.get('/lions', function(req, res,next){

// });

app.get('/', function(req, res) {
	res.render('index');
});


app.delete('/lions/:id', function (req, res){
	var delinfo = _.findIndex(lions, {id:req.params.id});
	if (!lions[delinfo]){
		res.send();
	}
	else {
		var deleted = _.pullAt(lions, delinfo)[0];
		res.send(deleted);
	}
});

/// catch 404 and forward to error handler
// app.use(function(req, res, next) {
// 	// console.log(res);
//  	res.status(500).send('Something broke!');

// 	var err = new Error('Not Found');
// 	err.status = 404;
// 	next(err);
// });

app.get('/lions', function(err, req, res, next) {
	next( new Error('oops!'));
});

app.get('/lions', function(req, res){
	res.json(lions);
});

app.get('/lions/:id', function(req, res){
	var lion = _.find(lions, {id: req.params.id});
	res.json(lion || {});
});

app.post('/lions', function(req, res) {
	var lion = req.body;
	id++;
	lion.id = id + '';

	console.log("Pushing");

	lions.push(lion);

	res.json(lion);
});


app.put('/lions/:id', function(req, res) {
	var update = req.body;
	if (update.id) {
		delete update.id
	}

	var lion = _.findIndex(lions, {id: req.params.id});
	if (!lions[lion]) {
		res.send();
	} else {
		var updatedLion = _.assign(lions[lion], update);
		res.json(updatedLion);
	}
});



// app.set('port', (process.env.PORT || 8080));

// app.listen(app.get('port'), function() {
//  console.log("Node app is running at localhost:" + app.get('port'))
// });

var port = Number(process.env.PORT || 3000);

app.listen(port, function () {
	console.log("Listening on " + port);
});