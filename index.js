var express    = require('express');        
var app        = express();                 
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var uriUtil = require('mongodb-uri');
var Country = require('./app/models/country');
var Icon = require('./app/models/icon');
var Order = require('./app/models/order');
var fs = require('fs');
var cors = require('cors');
var request = require('request');
var icon_map = {}
Icon.find(function(err, icons) {
    if (err)
        res.send(err);
    var data = {}
   	for(c in icons){
   		data[icons[c]._id] = icons[c];
   	}
   	// console.log(Object.keys(data).length)
   	icon_map = data;
   	// console.log(Object.keys(icon_map));
    // res.json(data);

    // res.json(icons);
});
function eliminateDuplicates(arr) {
  var i,
      len=arr.length,
      out=[],
      obj={};
 
  for (i=0;i<len;i++) {
    obj[arr[i]]=0;
  }
  for (i in obj) {
    out.push(i);
  }
  return out;
}
function getProducts(src,dst,cb){
	req = "http://atlas.media.mit.edu/hs07/import/2010.2012/"+src+"/"+dst+"/all";
	// console.log(req);
	icon_keys = Object.keys(icon_map);
	// console.log('here',icon_keys.indexOf('0208'),'0208')
	request(req, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		  		items =  JSON.parse(body)['data']
		  		var icons = [];
		  		var missing = [];
		  		var missing_obj = [];
		  		for (var i = 0; i < items.length; i++) {
		  			console.log(items[i]['hs07_id'])
	  				var hs_code = items[i]['hs07_id'].substring(2,6);
	  				if( icon_keys.indexOf(hs_code) === -1){
	  					if( missing.indexOf(items[i]['hs07_id'].substring(2,6)) === -1){
	  						missing.push(items[i]['hs07_id'].substring(2,6));
	  					}
	  				}	
	  				else{
	  					icons.push(hs_code);
	  				}

		  		};
		  		// console.log( 'missing',missing);
		  		cb.json(eliminateDuplicates(icons));
		  		// cb.json({'icons':eliminateDuplicates(icons),'missing':missing});
		  }
		})
	console.log("here");
}

function getProducts_debug(src,dst,cb){
	req = "http://atlas.media.mit.edu/hs07/import/2000.2012/"+src+"/"+dst+"/all";
	// console.log(req);
	icon_keys = Object.keys(icon_map);
	// console.log('here',icon_keys.indexOf('0208'),'0208')
	request(req, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		  		items =  JSON.parse(body)['data']
		  		var icons = [];
		  		var missing = [];
		  		var missing_obj = [];
		  		for (var i = 0; i < items.length; i++) {
	  				var hs_code = items[i]['hs07_id'].substring(0,4);
	  				if( icon_keys.indexOf(hs_code) === -1){
	  					if( missing.indexOf(items[i]['hs07_id'].substring(0,4)) === -1){
	  						missing.push(items[i]['hs07_id'].substring(0,4));
	  					}
	  				}	
	  				else{
	  					icons.push(hs_code);
	  				}

		  		};
		  		console.log( 'missing',missing);
		  		cb.json(eliminateDuplicates(icons));
		  }
		})

	console.log("here");
}


app.use(cors());
var options ={
	user:"test",
	pass:"test"
}
//process.env.MONGOLAB_URI;//
// need to set this on the local shell
//export MONGOLAB_URI="mongodb://test:test@ds059804.mongolab.com:59804/heroku_0s4s2f6j"

var mongodbUri =process.env.MONGOLAB_URI; // "mongodb://test:test@ds059804.mongolab.com:59804/heroku_0s4s2f6j";
var mongooseUri = uriUtil.formatMongoose(mongodbUri);

mongoose.connect(mongooseUri);


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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
           
            var data = {}
           	for(c in countries){
           		data[countries[c]._id] = countries[c];
           	}
            res.json(data);
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
router.route('/where-countries')
.get(function(req,res){
	// console.log(req);
	var query = Country.find().exists('isInput',true).exec(function(error,data){
		console.log("callback!",data)
		res.json(data);
	})

})

router.route('/from-countries')
.post(function(req,res){
	// console.log(req);
	var icon = new Icon();      // create a new instance of the Bear model
	    icon._id = req.body.where;  // set the bears name (comes from the request)
	    icon.url = req.body.icon;

	// var query = Country.find().exists('isInput',true).exec(function(error,data){
	// 	console.log("callback!",data)
	// 	res.json(data);
	// })

})

//Order
router.route('/order')
	.post(function(req, res) {
	    
	    var order = new Order();      // create a new instance of the Bear model
	    order.name = req.body.name;  // set the bears name (comes from the request)
	    order.from = req.body.from;
	    order.where = req.body.where;
	    order.email = req.body.email;
	    order.phone = req.body.phone;

	    // save the bear and check for errors
	    order.save(function(err) {
	        if (err)
	            res.send(err);

	        res.json({ message: 'order '+ order.name+' created!' });
	    });
	    
	})
   .get(function(req, res) {
        Order.find(function(err, orders) {
            if (err)
                res.send(err);
            res.json(orders);
        });
    });

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
            var data = {}
           	for(c in icons){
           		data[icons[c]._id] = icons[c];
           	}
            res.json(data);

            // res.json(icons);
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
        Icon.findById(req.params.icon_id, function(err, icon) {
            if (err)
                res.send(err);

            icon.sprite = req.body;  // update the bears info
            console.log(icon._id);
            icon.save(function(err) {
                if (err)
                    res.send(err);
                res.json({ message: 'Icon'+ icon._id+' updated!' });
            });

        });
    });
router.route('/products/:src/:dst')
	.get(function(req,res){
	var src = req.params.src;
	var dst = req.params.dst;

	console.log(req.params);	
	var data = getProducts(src,dst,res);	
	// res.json(data);

	})
router.route('/products/debug/:src/:dst')
	.get(function(req,res){
	var src = req.params.src;
	var dst = req.params.dst;

	console.log(req.params);	
	var data = getProducts_debug(src,dst,res);	
	// res.json(data);

	})
app.use('/api', router);

app.listen(app.get('port'),function(){
	console.log('Node app is running on port', app.get('port'));	
});
