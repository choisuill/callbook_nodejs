var express = require('express');
var mongoose = require('mongoose');
var ejs = require('ejs');
var bodyparser = require('body-parser');
var app = express();

mongoose.set('useNewUrlParser', true);    // 1
mongoose.set('useFindAndModify', false);  // 1
mongoose.set('useCreateIndex', true);     // 1
mongoose.set('useUnifiedTopology', true); // 1
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once('open',function(){
  console.log('db is connected');
});
db.on('error',function(err){
  console.log(err);
});
app.use(express.static(__dirname + '/public'));
app.set('view engine','ejs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

var callbookSchema = mongoose.Schema({
  name: {type:String,unicode:true,required:true},
  call:{type:String,required:true},
  address:{type:String},
  age:{type:String}
});
var Callbook = mongoose.model('callbook',callbookSchema);

app.get('/',function(req,res){
  Callbook.find({},function(err,callbooks){
    if(err) return res.json(err);
    res.render('ejsFile',{callbooks:callbooks});
  });
});
app.get('/ejsFile/show/:id',function(req,res){
    Callbook.findOne({_id:req.params.id},function(err,callbook){
    if(err) return res.json(err);
    res.render('ejsFile/show',{callbook:callbook});
  });
});
app.get('/ejsFile/create',function(req,res){
  res.render('ejsFile/create');
});

app.post('/create',function(req,res){
  Callbook.create(req.body,function(err,callbooks){
    if(err) return res.json(err);
    res.redirect('/');
  });
});

var port = 3001;
app.listen(port,function(){
  console.log(port+'server is on!');
});
