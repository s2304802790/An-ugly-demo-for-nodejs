var express = require('express');
var fs = require('fs');
var multer = require('multer');
var saferman = require('../database/saferman')('---------');
var upload = multer({dest:'upload/'});
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.route('/register')
.get(function(req,res){
	res.render('register',{title: '用户注册'});
})
.post(function(req,res){
	if(req.body.username==null||req.body.password==null){
		res.redirect('/register');
	}
	var sql=saferman.format('insert into users(username,password) values(?,?)',[req.body.username,req.body.password]);
	saferman.user_sql(sql);
	res.redirect('/login');
});

router.route('/upload')
.get(function(req,res){
	res.render('upload', {title: '上传文件'});
})

router.route('/login')
.get(function(req, res) {
    res.render('login', { title: '用户登录' });
})
.post(function(req, res) {
	var sql=saferman.format('select password from users where username = ?',[req.body.username]);
	saferman.user_sql(sql,function(err,results){
		if(err!=null){
			console.log(err);
			console.log(err.stack);
		}else{
			if(results[0]!=null){
				if(results[0].password==req.body.password){
					req.session.user=req.body.username;
					res.redirect('/home');
				}else{
					console.log('password error!');
					res.redirect('/login');
				}
			}else{
				console.log('username not found!');
				res.redirect('/login');
			}
		}
	});
});

router.get('/logout', function(req, res) {
	req.session.user=null;
    res.redirect('/');
});

router.get('/home', function(req, res) {
	authentication(req, res);
    res.render('home', { title: 'Home',user:req.session.user});
});

function authentication(req, res) {
    if (!req.session.user) {
        return res.redirect('/login');
    }
}
module.exports = router;
