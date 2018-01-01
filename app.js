var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer  = require('multer')
var fs = require('fs')
var xlsx = require('xlsx')

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

/*
function WalkDirs(dirPath){
	console.log(dirPath);
	fs.readdir(dirPath,function(err,entries){
		for(var idx in entries){
			var fullPath = Path.join(dirPath,entries[idx]);
			(function(fullPath){
				fs.stat(fullPath,function(err,stats){
					if(stats && stats.isFile()){
						console.log(fullPath);
					}else if(stats && stats.isDirectory()){
						WalkDirs(fullPath);
					}
				});
			})(fullPath);
		}
	});
}
WalkDirs("../public")

*/

//解析需要遍历的文件夹，我这以E盘根目录为例  
var filePath = path.resolve('..\\renew\\upload');  
var arr=[];  
//调用文件遍历方法  
//fileDisplay(filePath);  
  
/** 
 * 文件遍历方法 
 * @param filePath 需要遍历的文件路径 
 */  


function fileDisplay(filePath){  
    //根据文件路径读取文件，返回文件列表  
    
    fs.readdir(filePath,function(err,files){  
        if(err){  
            console.warn(err)  
        }else{  
            //遍历读取到的文件列表  
            files.forEach(function(filename){  
                //获取当前文件的绝对路径  
                var filedir = path.join(filePath,filename);  
                //根据文件路径获取文件信息，返回一个fs.Stats对象  
                fs.stat(filedir,function(eror,stats){  
                    if(eror){  
                        console.warn('获取文件stats失败');  
                    }else{  
                        var isFile = stats.isFile();//是文件  
                        var isDir = stats.isDirectory();//是文件夹  
                        if(isFile){  
                            console.log(filedir);                             
                        }  
                        if(isDir){  
                            fileDisplay(filedir);//递归，如果是文件夹，就继续遍历该文件夹下面的文件  
                        } 

                    }  
                }) 
                arr.push(filedir);
//                console.log(arr); 
            })
             
        }  
    });  
}




var hash=[];
var j={data:hash}
//var url='./upload/Foxconn Scorecard_2015.xls'
//var url = './upload/test.xlsx'
//var range={s:{c:0, r:2}, e:{c:1, r:6}}
//var range={s:{c:0, r:2}, e:{c:0, r:6}}
//var output = output(url,range)
console.log(hash[3])
console.log(j)

setInterval(function(){
var url = './upload/test.xlsx'
//var range={s:{c:0, r:2}, e:{c:1, r:6}}
var range={s:{c:0, r:2}, e:{c:0, r:6}} 
 output(url,range) 
},3000)

var no=JSON.stringify(j);
console.log(no)

//var j='{"name":"johnny","gender":"male"}' 
app.get('/2', function(req, res, next) {
//                      res.render('index', { title: 'Express' });
     fileDisplay(filePath); 

//var range={s:{c:0, r:2}, e:{c:1, r:6}}

//     console.log(arr);
     
 //    res.send('<p>'+hash[0]+'</p>'+'<br>'+'<p>'+hash[1]+'</p>'+'<p>'+hash[2]+'</p>');
//     res.send(hash);
     res.send(j);

     
}); 

/*
var upload = multer({ dest: 'upload/' });

// 单图上传
app.post('/upload', upload.single('logo'), function(req, res, next){
    res.send({ret_code: '0'});
});
*/

//multer
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './upload')
  },
  filename: function (req, file, cb) {
 //   cb(null, file.fieldname + '-' + Date.now())
 //     cb(null, file.originalname + '-' + Date.now())
      cb(null, file.originalname)
  }
})
//multer
var upload = multer({ storage: storage })

app.post('/upload', upload.single('logo'), function(req, res, next){
    res.send({ret_code: '0'});
});



function output(url,range){
  if(typeof require !== 'undefined') XLSX = require('xlsx');
  var workbook = XLSX.readFile(url);
//  console.log(workbook);

  var first_sheet_name = workbook.SheetNames[0];
  var address_of_cell = 'A2';

/* Get worksheet */
  var worksheet = workbook.Sheets[first_sheet_name];
// console.log(worksheet)
/* Find desired cell */
  var desired_cell = worksheet[address_of_cell];

/* Get the value */
  var desired_value = (desired_cell ? desired_cell.v : undefined);
  console.log(desired_value); 
  
/* Get the value */
  
// var hash=[]
   
  for(var R = range.s.r; R <= range.e.r; ++R) {
  for(var C = range.s.c; C <= range.e.c; ++C) {
   var cell_address = {c:C, r:R}; 
   var cell_ref = xlsx.utils.encode_cell(cell_address)
//    console.log(desired_value);
   var desired_cell = worksheet[cell_ref];
   var desired_value = (desired_cell ? desired_cell.v : undefined);
   hash.push(desired_value)
   console.log(desired_value)
//   console.log(hash)
  }
}
}








// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
