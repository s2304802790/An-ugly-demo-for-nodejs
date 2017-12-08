var mysql=require('mysql');
var settings=require('./settings');
var connection;

var saferman=module.exports= function saferman(password){
	if(password){
			user_connection=mysql.createPool({
				connectionLimit : 100,
				host : settings.host,
				user : settings.username,
				password : password,
				database : settings.users_database
		});
			file_connection=mysql.createPool({
				connectionLimit : 100,
				connectionLimit : 100,
				host : settings.host,
				user : settings.username,
				password : password,
				database : settings.file_database
			});
	}
	return saferman;
};

saferman.user_sql=function(sql,callback){
	user_connection.query(sql,function(err,results){
		if(err){
			callback(err,null);
		}else{
			if(callback!=undefined){
			callback(null,results);
			}
		}
	});
}

saferman.file_sql=function(sql,callback){
	file_connection.query(sql,function(err,results){
		if(err){
			callback(err,null);
		}else{
			if(callback!=undefined){
			callback(null,results);
			}
		}
	});
}

saferman.format=function(sql,arr){
	var sql_string = mysql.format(sql,arr);
	return sql_string;
}