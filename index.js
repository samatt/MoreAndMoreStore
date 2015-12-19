var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var Country = require('./app/models/country');
var Icon = require('./app/models/icon');
var fs = require('fs');
var cors = require('cors');
// var utils = require('./mmutils');

app.use(cors());
var options ={
	user:"test",
	pass:"test"
}
var mongodbUri = process.env.MONGOLAB_URI;//"mongodb://test:test@ds059804.mongolab.com:59804/heroku_0s4s2f6j";
var mongooseUri = uriUtil.formatMongoose(mongodbUri);
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

// Country
router.route('/country')
	.post(function(req, res) {
	    
	    var country = new Country();      // create a new instance of the Bear model
	    country.name = req.body.name;  // set the bears name (comes from the request)
	    country._id = req.body.id;
	    country.flag = req.body.flag;
	    if(req.body.isInput) country.isInput = req.body.isInput;
	    // save the bear and check for errors
	    country.save(function(err) {
	        if (err)
	            res.send(err);

	        res.json({ message: 'Country '+ country.name+' created!' });
	    });
	    
	})
   .get(function(req, res) {
        Country.find(function(err, countries) {
            if (err)
                res.send(err);

            res.json(countries);
        });
    });
router.route('/country/:country_id')
	.get(function(req,res){
		Country.findById(req.params.country_id,function(err,country){
			if(err)
				res.send(err);
			res.json(country);	
		})
	})
	.put(function(req, res) {

        // use our bear model to find the bear we want
        Country.findById(req.params.country_id, function(err, country) {
            if (err)
                res.send(err);

            country.name = req.body.name;  // update the bears info

            // save the bear
            country.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Country updated!' });
            });

        });
    });
router.route('/source-countries')
.get(function(req,res){
	// console.log(req);
	var query = Country.find().exists('isInput',true).exec(function(error,data){
		console.log("callback!",data)
		res.json(data);
	})

})
// Thing.where('name').exists(true)
//Icon

router.route('/icon')
	.post(function(req, res) {
	    
	    var icon = new Icon();      // create a new instance of the Bear model
	    icon._id = req.body.id;  // set the bears name (comes from the request)
	    icon.url = req.body.url;
	    icon.category = req.body.category;
	    // save the bear and check for errors
	    icon.save(function(err) {
	        if (err)
	            res.send(err);

	        res.json({ message: 'Icon '+ icon._id+ ' created!' });
	    });
	    
	})
   .get(function(req, res) {
        Icon.find(function(err, icons) {
            if (err)
                res.send(err);

            res.json(icons);
        });
    });

router.route('/icon/:icon_id')
	.get(function(req,res){
		Icon.findById(req.params.icon_id,function(err,country){
			if(err)
				res.send(err);
			res.json(country);	
		})
	})
	.put(function(req, res) {

        // use our bear model to find the bear we want
        Icon.findById(req.params.icon_id, function(err, country) {
            if (err)
                res.send(err);

            country.name = req.body.name;  // update the bears info

            // save the bear
            country.save(function(err) {
                if (err)
                    res.send(err);

                res.json({ message: 'Country updated!' });
            });

        });
    });
app.use('/api', router);

app.listen(app.get('port'),function(){
	console.log('Node app is running on port', app.get('port'));	
});
