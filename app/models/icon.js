var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var IconSchema   = new Schema({
    _id: String,
    url :String,
    category : String
});

IconSchema.virtual('name').get(function() {
    return this._id;
});
// (texture position?)

module.exports = mongoose.model('Icon', IconSchema);