var muilter = require('./multerunit');
var upload=muilter.single('file');
exports.datainput=function(req,res){
	upload(req,res,function(err){
		if(err){
			console.log(err);
		}else{
			console.log(req.body);
		}
	});
}