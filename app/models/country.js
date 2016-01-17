var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var CountrySchema   = new Schema({
    _id :String,
    name: String,
    flag: String,
    isInput:Boolean,
    
});

module.exports = mongoose.model('Country', CountrySchema);