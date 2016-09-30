/**
 * Created by rizki on 9/29/16.
 */

/** SETUP **/
// required packages
var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    morgan = require('morgan');

var User = require('./app/models/user');
var Product = require('./app/models/product');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

var mongo = require('mongoose');
mongo.connect('mongodb://srv01.bitlyze.net:27017/shopwatch');

// API port
var port = 8080;

/** ROUTER API**/
var router = express.Router();

router.get('/',function (req,res) {
    res.json({message:"Welcome to Shopwatch API!"});
});

// USERS
router.route('/users')
    .post(function (req,res) {
        var user = new User();
        user.username = req.body.username;
        user.password = req.body.password;
        user.name = req.body.name;
        user.email = req.body.email;
        user.date_joined = Date.now();
        user.save(function (err) {
            if(err) { res.send(err) }
            else res.json({message:'new user created'});
        });
    })
    .get(function (req,res) {
        User.find(function (err,users) {
            if(err) {res.send(err)}
            else res.json(users);
        });
    });

router.route('/user/:username')
    .get(function (req,res) {
        User.find({"username":req.params.username},function (err,user) {
            if(err) {res.send(err)}
            else res.json(user);
        });
    });

router.route('/user/:username/reset_pass')
    .put(function (req,res) {
        User.findOne({"username":req.params.username},function (err,user) {
            if(err) {res.send(err)}
            else{
                user.password = req.body.password;
                user.save(function (err) {
                    if(err) {res.send(err)}
                    else res.json({message: "password updated"})
                });
            }
        });
    });



// PRODUCT
router.route('/products')
    .get(function (req,res) {
        Product.find(function (err,products) {
            if(err) {res.send(err)}
            else res.json(products);
        });
    });

router.route('/products/:owner_url')
    .get(function (req,res) {
        Product.find({"owner_url": {"$regex":req.params.owner_url}},function (err,product) {
            if(err) {res.send(err)}
            else res.json(product);
        })
    });

router.route('/products/:site/:owner_url')
    .get(function (req,res) {
        Product.find({"site":req.params.site,"owner_url": {"$regex":req.params.owner_url}},function (err,product) {
            if(err) {res.send(err)}
            else res.json(product);
        })
    });



// ROUTES REGISTER
app.use('/api',router);
app.use(morgan('combined'));

/** SERVER SECTION **/
app.listen(port);
console.log('Services started at : ' + port);