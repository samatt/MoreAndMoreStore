var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrderSchema   = new Schema({
    from: String,
    where: String,
    prodcut:String,
    name:String,
    email:String,
    phone:String,
    prodcut:String
    
});

module.exports = mongoose.model('Order', OrderSchema);