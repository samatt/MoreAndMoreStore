var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema   = new Schema({
    from: String,
    where: String,
    product:String,
    name:String,
    email:String,
    phone:String,
    prodcut:String,
    sentEmail:Boolean
    
});

module.exports = mongoose.model('Order', OrderSchema);