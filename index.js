var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');

console.log(process.env.MONGOLAB_URI)
var options ={
	user:"heroku_0s4s2f6j",
	pass:"m0re&m0rest0re"
}
var mongodbUri = "mongodb://heroku_0s4s2f6j:m0re&m0rest0re@ds059804.mongolab.com:59804/heroku_0s4s2f6j";
var mongooseUri = uriUtil.formatMongoose(mongodbUri,options);
console.log(mongooseUri)
mongoose.connect(mongooseUri);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());




// mongodb://heroku_0s4s2f6j:m0re&m0rest0re@ds059804.mongolab.com:59804/heroku_0s4s2f6j
app.set('port',(process.env.PORT || 5000));

app.use(express.static(__dirname+'/public'));




var router = express.Router(); 
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

app.use('/api', router);

app.listen(app.get('port'),function(){
	console.log('Node app is running on port', app.get('port'));	
});
