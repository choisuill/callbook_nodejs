var express = require('express');
var mongoose = require('mongoose');
var ejs = require('ejs');
var bodyparser = require('body-parser');
var methodOverride = require('method-override');
var app = express();

mongoose.set('useNewUrlParser', true);    // mongoose setting
mongoose.set('useFindAndModify', false);  // mongoose setting
mongoose.set('useCreateIndex', true);     // mongoose setting
mongoose.set('useUnifiedTopology', true); // mongoose setting
mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.once('open',function(){
  console.log('db connected');
});
db.on('error',function(err){
  console.log(err);
});
app.use(express.static(__dirname + '/public'));   // css setting
app.set('view engine','ejs');                     // ejs setting
app.use(bodyparser.json());                       // bodyparser setting
app.use(bodyparser.urlencoded({extended:true}));  // bodyparser setting
app.use(methodOverride('_method'));               // methodOverride setting

var callbookSchema = mongoose.Schema({            // Skchema setting
  name: {type:String,unicode:true,required:true},
  call:{type:String,required:true},
  address:{type:String},
  age:{type:String}
});
var Callbook = mongoose.model('callbook',callbookSchema);   // Callbook model Create
// index page
app.get('/',function(req,res){
  Callbook.find({},function(err,callbook){
    if(err) return res.json(err);
    res.render('ejsFile',{callbook:callbook});
  });
});
// show page
app.get('/ejsFile/show/:id',function(req,res){
    Callbook.findOne({_id:req.params.id},function(err,callbook){
    if(err) return res.json(err);
    res.render('ejsFile/show',{callbook:callbook});
  });
});
// create page
app.get('/ejsFile/create',function(req,res){
  res.render('ejsFile/create');
});
// create
app.post('/create',function(req,res){
  Callbook.create(req.body,function(err,callbook){
    if(err) return res.json(err);
    res.redirect('/');
  });
});
// update page
app.get('/ejsFile/update/:id',function(req,res){
  Callbook.findOne({_id:req.params.id},function(err,callbook){
    res.render('ejsFile/update',{callbook:callbook});
  });
});
// delete
app.delete('/ejsFile/show/:id',function(req,res){
  Callbook.deleteOne({_id:req.params.id},function(err){
    if(err) return res.json(err);
    res.redirect('/');
  });
});
app.put('/ejsFile/update/:id',function(req,res){
  Callbook.findOneAndUpdate({_id:req.params.id},req.body,function(err,callbook){
      res.redirect('/ejsFile/show/'+req.params.id);
  });
});

//port create
var port = 3001;
app.listen(port,function(){
  console.log(port+'server is on!');
});
