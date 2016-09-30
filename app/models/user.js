/**
 * Created by rizki on 9/29/16.
 */

var mongo = require('mongoose'),
    Schema = mongo.Schema,
    bcrypt = require('bcrypt'),
    salt_factor = 10;

var validator = require('validator');

var user_account = new Schema({
    username: {
        type:String,
        required:true,
        index:{
            unique:true
        }
    },
    password: {
        type:String,
        required:true },
    date_joined: {
        type:Date,
        default:Date.now()
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true ,
        validate: {
            validator: function (v) {
                return validator.isEmail(v);
            },
            message: 'not valid email'
        }
    }
});

user_account.pre('save', function (next) {
    var user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(salt_factor,function (err,salt) {
            if(err) return next(err);
            bcrypt.hash(user.password,salt,function (err,hash) {
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else return next();
});

user_account.methods.comparePassword = function (pass,cb) {
    bcrypt.compare(pass, this.password, function (err,isMatch) {
        if(err) return cb(err);
        cb(null,isMatch);
    });
};


module.exports = mongo.model('User',user_account);