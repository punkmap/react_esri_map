var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var appRoot = 'http://127.0.0.1:54070/';
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:54070');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});


app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.get('/getdrains', function (req, res) {
    console.log('getDrains');
    var records = [];
    
    // conn.query("SELECT Id, account.name FROM asset WHERE account.name ='Sabre Asset Holder' LIMIT 5", function(err, result) {
    //   console.log('getDrainsResult');
    //   if (err) { return console.error(err); }
    //   else{  
    //       console.log("fetched : " + result.records.length);
    //       console.log("records : " + JSON.stringify(result.records));
    //   }
    // });

});
//app.get('/facilitybyid/:id', function (req, res) {
app.post('/facilitybyid/:id', function (req, res) {
    var serialNumber = req.params.id;
    console.log('Hello facilitybyid!');
    console.log("facilityId: " + serialNumber);
    // console.log("conn.loginUrl: " + conn.loginUrl);
    // console.log(conn);
    // var query = "SELECT SerialNumber, Name FROM Asset WHERE SerialNumber = '"+serialNumber+"'";
    // conn.query(query, function(err, result) {
    //   if (err) { return console.error(err); }
    //   else{  
    //       console.log("fetched : " + result.records.length);
    //       console.log("records : " + JSON.stringify(result.records[0]));
    //       res.send(result.records[0]);
    //   }
    // });
});
app.post('/login', function(req, res){
    console.log(JSON.stringify(req.body.inputUsername));
    console.log(JSON.stringify(req.body.inputPassword))
    //res.send('You sent the name "' + req.body.name + '".');
    res.redirect(appRoot+'/index.html');
})
app.post('/passwordreset', function(req, res){
    console.log("passwordreset username: " + JSON.stringify(req.body.inputUsername));
    res.redirect(appRoot+'login.html');
})
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

