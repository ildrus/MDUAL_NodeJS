var express = require('express');
var bodyParser = require('body-parser');
var mongo = require('mongodb').MongoClient;
var mongoClient;
var app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.set('view engine','ejs');

mongo.connect('mongodb://localhost:27017',function(err,_client){
    if(err) throw err;
    mongoClient = _client;
    app.listen(3000, function () {
        console.log('Example app listening on http://localhost:3000 !');
    });
});  

app.get('/form',function(req,res) {
    var db = mongoClient.db("Restaurant");
    var opcions = {};
    var query = {};
    db.collection('Restaurant').find(query,opcions).toArray(function(err,docs){
        if(err) {
            res.render('error',{msg:"error a la query"});
            return;
        }
        res.render('register',{"Restaurant":docs});
    });
});

app.post('/form',function(req, res){
    var db = mongoClient.db("Restaurant");
    var opcions = {};

    var name=req.body.name;
    var address=req.body.address;
    var zipCode=req.body.zipCode;
    var city=req.body.city;
    var phone=req.body.phone;
    var query = {name:name,address:address,zipCode:zipCode,city:city,phone:phone};
    db.collection('Restaurant').save(query);
    var query={};
    showListRestaurant(req,res,db,query,opcions);   
});

app.get('/form1',function(req,res) {
    var db = mongoClient.db("Business");
    var opcions = {};
    var query = {};
    db.collection('Business').find(query,opcions).toArray(function(err,docs){
        if(err) {
            res.render('error',{msg:"error a la query"});
            return;
        }
        res.render('form1',{"Business":docs});
    });
});

app.post('/form1',function(req, res){
    var db = mongoClient.db("Business");
    var opcions = {};

    
    var name=req.body.name;
    var address=req.body.address;
    var zipCode=req.body.zipCode;
    var city=req.body.city;
    var phone=req.body.phone;

    var timetableO= new timetable(req.body.dow,req.body.openTime,req.body.closeTime);
    var timetable=[];
    timetable=[timetableO];

    var categories=[];
    categories=req.body.categories;

    var products

    var query = {name:name,address:address,zipCode:zipCode,city:city,phone:phone,timetable,categories};
 

    db.collection('Business').save(query);
    var query={};
    showListRestaurant(req,res,db,query,opcions);   

});


function timetable(dow,openTime,closeTime){
    this.dow=dow;
    this.openTime=openTime;
    this.closeTime=closeTime;    
};

function products(name,description,category,price,extra,alergen,picture,stock){
    this.name= name;
    this.description=description;
    this.category=category;
    this.price=price;
    this.extra=extra;
    this.alergen=alergen;
    this.picture=picture;
    this.stock=stock;
};



app.get('/result',function(req,res){
    var db = mongoClient.db("Restaurant");
    var opcions = {};
    var query = {};
    showListRestaurant(req,res,db,query,opcions);
}); 






function showListRestaurant(req,res,db,query,opcions){
    db.collection('Restaurant').find(query,opcions).toArray(function(err,docs){
        if(err){
            res.render('error',{msg:"error a la query"});
            return;
        }
        res.render('result',{"restaurant":docs});
    });
};


app.get('/api/movies',function(req,res){
    var db = mongoClient.db("Restaurant");
    var fields = {_id:true,title:true,year:true};
    var query = {};
    var opcions = {limit:4,fields:fields};
    db.collection('movieDetails').find(query,opcions).toArray(function(err,docs){
        if(err){
            res.send(JSON.stringify({status:"error",msg:"error a la query"}));
            return;
        }
        res.send(JSON.stringify(docs));
    });
});