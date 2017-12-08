var express = require('express');
var path = require('path');
var fs = require('fs');
var multer = require('multer');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var mysqlstore = require('express-mysql-session');
var settings = require('./database/settings');
var saferman = require('./database/saferman');
var upload_image = multer({dest: 'uploads/image/' });
var upload_markdown = multer({dest: 'uploads/markdown/'});
var saferman = require('./database/saferman')('3300978abc');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();
//post
app.post('/upload_image',upload_image.single('file'),function(req,res,next){
	if(req.file==undefined){
		res.send("Please submit your image!");
		return;
	}
	var file=req.file;
	console.log(file.originalname);
	console.log(file.mimetype);
	name=file.originalname;
    nameArray=name.split('');
    var nameMime=[];
    l=nameArray.pop();
    nameMime.unshift(l);
    while(nameArray.length!=0&&l!='.'){
    l=nameArray.pop();
    nameMime.unshift(l);
	}
	Mime=nameMime.join('');
    console.log(Mime);
	res.send("done");
	fs.renameSync('./uploads/image/'+file.filename,'./uploads/image/'+name);
	var sql=saferman.format('insert into file_image(filename,user,path)values(?,?,?)',[name,'test','/upload/image/']);
	saferman.file_sql(sql,function(err,results){
		if(err){
			console.log(err);
		}
	}); 
	sql=saferman.format('update file_count set sum = sum+1 where type= ?',['image']);
	saferman.file_sql(sql,function(err,results){
		if(err){
			console.log(err);
		}
	}); 
});
app.post('/upload_markdown',upload_markdown.single('file'),function(req,res,next){
	if(req.file==undefined){
		res.send("Please submit your markdown!");
		return;
	}
	var file=req.file;
	console.log(file.originalname);
	console.log(file.mimetype);
	name=file.originalname;
    nameArray=name.split('');
    var nameMime=[];
    l=nameArray.pop();
    nameMime.unshift(l);
    while(nameArray.length!=0&&l!='.'){
    l=nameArray.pop();
    nameMime.unshift(l);
	}
	Mime=nameMime.join('');
    console.log(Mime);
    res.send("done");
	fs.renameSync('./uploads/markdown/'+file.filename,'./uploads/markdown/'+name);
	var sql=saferman.format('insert into file_markdown(filename,user,path)values(?,?,?)',[name,'test','/upload/image/']);
	saferman.file_sql(sql,function(err,results){
		if(err){
			console.log(err);
		}
	}); 
	sql=saferman.format('update file_count set sum = sum+1 where type= ?',['markdown']);
	saferman.file_sql(sql,function(err,results){
		if(err){
			console.log(err);
		}
	}); 
});
// view engine setup
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
app.engine('html',require('ejs').renderFile);
app.set('view engine','html');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded()); 
app.use(cookieParser());
//session settings
app.use(session({
	cookie: {maxAge: 600000},
	resave:false,
	saveUninitialized: true,
	secret: settings.cookie_secret,
	store: new mysqlstore({
		user : settings.username,
		password : settings.password,
		host:settings.server,
		port:"3306",
		database:settings.session_database
	})
}))
app.use(function(req,res,next){
	res.locals.user=req.session.user;
	next();
})

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/login',routes);
app.use('/logout',routes);
app.use('/home',routes);
app.use('/upload',routes);



/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
