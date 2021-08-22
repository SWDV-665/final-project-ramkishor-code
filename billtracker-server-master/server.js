// Set up
var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var cors = require('cors');

// Configuration
//mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/billtracker");
mongoose.connect("mongodb+srv://ramkishor:ramkishor123@groceries.6exdy.mongodb.net/billtracker?retryWrites=true&w=majority");
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());
app.use(express.json())

app.use(cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'DELETE, POST, PUT');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



var users = mongoose.model('users', {
    email: String,
    name: String,
    password: String

});
var billingitems = mongoose.model('billingitems', {
    userid: String,
    name: String,
    amount: Number,
    due_day: Number,
    status:Number

});

var billstacks = mongoose.model('billstacks', {
    userid: String,
    billid:String,
    name: String,
    amount: Number,
    due_day: Number,
    status: Number,
    month: Number
}
);

app.post('/api/bill/add', function (req, res) {

    console.log("add bill...");

    billingitems.create({
        userid: req.body.userid,
        name: req.body.name,
        amount: req.body.amount,
        due_day: req.body.due_day,
        done: false,
        status:1

    }, function (err, billingitem) {
        if (err) {
            res.send(err);
        }
        //  res.status(200).json("1")
        billingitems.find({ _id: billingitem._id }, function (err, data) {
            if (err)
                res.send(err);
                  

                var d = new Date();

                var date = d.getDate();
                var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
                var year = d.getFullYear();
               res.json(data);
            console.log("here comes new concept:"+ data[0]._id);
                billstacks.create({
                    userid: data[0].userid,
                    billid:data[0]._id,
                    name: data[0].name,
                    month:month,
                    amount: data[0].amount,
                    due_day: data[0].due_day,
                    status:1
                }, function(err, doc) {    });


           // res.json(billingitems);
        });


    });

});




app.post('/api/user/create', function (req, res) {

    console.log("Creating user...");

    users.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        done: false
    }, function (err, user) {
        if (err) {
            res.send(err);
        }

        // create
        users.find({ _id: user._id }, function (err, users2) {
            if (err)
                res.send(err);
            res.json(users2);
        });
    });

});


app.post('/api/user/login', function (req, res) {

    console.log("login in user...");
    console.log(req);

    users.findOne({
        email: req.body.email,
        password: req.body.password
    }, function (err, users) {
        if (err)
            res.send(err);
        res.json(users);
    });



});



app.get('/api/bill/:id', function (req, res) {

    console.log("Listing  items...");

    // use mongoose to get all groceries in the database
    billingitems.find({ userid: req.params.id }, function (err, items) {
        if (err) {
            res.send(err);
        }
          res.json(items); // return all groceries in JSON format
    });
});

app.get('/api/upcomingbill/:id', function (req, res) {

    var d = new Date();

    var date = d.getDate();
    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    var year = d.getFullYear();

    var dateStr = date + "/" + month + "/" + year;
    console.log("Listing  items...");

    // use mongoose to get all groceries in the database
    billstacks.find({ userid: req.params.id,status:1 ,due_day: { $gt: Number(date)}}, function (err, items) {

        //  if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }


        res.json(items); // return all groceries in JSON format
    });
});

app.get('/api/pendingbill/:id', function (req, res) {

    var d = new Date();

    var date = d.getDate();
    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    var year = d.getFullYear();

    var dateStr = date + "/" + month + "/" + year;
    console.log("Listing  items...");

    // use mongoose to get all groceries in the database
    billstacks.find({ userid: req.params.id,status:1, due_day: { $lte: Number(date)}   }, function (err, items) {

        //  if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err) {
            res.send(err);
        }


        res.json(items); // return all groceries in JSON format
    });
});


app.put('/api/bill/edit/:id', function (req, res) {
    const billingitem = {
        name: req.body.name,
        amount: req.body.amount,
        due_day: req.body.due_day
    };
    console.log("Updating item - ", req.params.id);
    billingitems.update({ _id: req.params.id }, billingitem, function (err, raw) {
        if (err) {
            res.send(err);
        }
        res.send(raw);
    });
});
app.put('/api/bill/paid/:id', function (req, res) {
    const bill = {
        status: 0,
    };
    console.log("Updating item - ", req.params.id);
    billstacks.update({ _id: req.params.id }, bill, function (err, raw) {
        if (err) {
            res.send(err);
        }
        res.send(raw);
    });
});


// // Delete a grocery Item
app.delete('/api/remove/:id', function (req, res) {
    billingitems.findOneAndRemove({
        _id: req.params.id
    }, function (err, billingitem) {
        if (err) {
            console.error("Error ", err);
        }
        else {
            res.json(billingitem);
            // billingitems.find({ _id: billingitem._id }, function (err, billingitem) {
            //     if (err) {
            //         res.send(err);
            //     }
            //     else {
            //         res.json(billingitem);
            //     }
            // });
        }
    });
});


app.get('/api/stack', function (req, res) {

    console.log("stacking");
    var d = new Date();

    var date = d.getDate();
    var month = d.getMonth() + 1; // Since getMonth() returns month from 0-11 not 1-12
    var year = d.getFullYear();

    var dateStr = date + "/" + month + "/" + year;
    //res.json(date);
 
    
    billingitems.find({}, function (err, billingitem) {
        if (err) {
            res.send(err);
        }
        else {
        
            for (var i = 0; i < billingitem.length; i++) {
                //console.log(billingitem[i].name)
                
                        console.log("stack add");
                        // billstacks.create({
                        //     userid: billingitem[i].userid,
                        //     billid:billingitem[i]._id,
                        //     name: billingitem[i].name,
                        //     month:month,
                        //     amount: billingitem[i].amount,
                        //     due_day: billingitem[i].due_day,
                        //     status: 1
                        // }, function (err, billstack) {
                        
                        // });
                        //res.send(err);
                      
                                value={
                                    "userid": billingitem[i].userid,
                                    "billid":billingitem[i]._id,
                                    "name": billingitem[i].name,
                                    "month":month,
                                    "amount": billingitem[i].amount,
                                    "due_day": billingitem[i].due_day,
                                    
                                }
                                key={
                                    "billid":billingitem[i]._id,
                                    "month":month,
                                
                                }
                                billstacks.findOneAndUpdate(key, value,{upsert: true}, function(err, doc) {
                                    if (err){
        
                                    }
                                   // return res.send('Succesfully saved.');
                                });
                            }
                         
                        
                  
                   
                    }
            
             

            


        });

        res.status(200).json("1");
    });


  













// Start app and listen on port 8080  
app.listen(process.env.PORT || 8089);
console.log("billtracker server listening on port  - ", (process.env.PORT || 8089));