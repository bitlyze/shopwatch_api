/**
 * Created by rizki on 9/30/16.
 */

var mongo = require('mongoose'),
    Schema = mongo.Schema;

var product = new Schema({
    name: { type:String, required:true },
    seen: { type:Number, required:true },
    owner_url: { type:String, required:true },
    url: { type:String, required:true },
    desc: { type:String, required:true },
    price: { type:Number, required:true },
    site: { type:String, required:true },
    sold: { type:Number, required:true },
    currency: { type:String, required:true },
    category: { type:String, required:true },
    img_url: { type:String, required:true }
});

module.exports = mongo.model('Product',product);