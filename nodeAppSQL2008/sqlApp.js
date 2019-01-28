var express = require('express');
//var bodyParser = require('body-parser');
var app = express();
//var appRoot = 'http://127.0.0.1:54070/';
//app.use(bodyParser.urlencoded({ extended: true })); 
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
    
}
var connection = new Connection(config);

connection.on('connect', function(err) {
  // If no error, then good to go...
    if (!err){
        console.log("you're connected to the real estate database");
        //executeStatement()
    }
    else{
        console.log("you ain't connected to the real estate database, fool: " + JSON.stringify(err));
    }
  }
);

// function executeStatement(){
//     var request = new Request("SELECT DISTINCT PinNumber FROM RE_BASE_DATA", function(err, rowCount) {
//         if (err) {
//           console.log(err);
//         } else {
//           console.log(rowCount + ' rows');
        
//         }
//       });
//       var pins = []
//       request.on('row', function(columns) {
//         columns.forEach(function(column) {
//             console.log(column.metadata.colName + ": " + column.value);
//             pins.push(column.value)
//         });
//       });
//       request.on('requestCompleted', function () {console.log('requestCompleted')});
//       request.on('done', function (rowCount, more, rows) {console.log('done')});
//       request.on('doneInProc', function (rowCount, more, rows) {
//           console.log('doneInProc')
//           console.log(rowCount)  
//           console.log(more)  
//           console.log(rows)  
//       });
//       request.on('doneProc', function (rowCount, more, returnStatus, rows) {
//         console.log('doneProc')
//         console.log(rowCount)  
//         console.log(more)    
//         console.log(returnStatus)  
//         console.log(rows)  
//       });
//       request.on('returnValue', function (parameterName, value, metadata) {console.log('returnValue')});
//       connection.execSql(request);
// }

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

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
  res.send('Hello test World!');
});
app.post('/addparcels/:parceldata', function (req, res) {
    
    console.log('addparcels')
    const parceldata = JSON.parse(req.params.parceldata)
    let queryString = 'INSERT INTO RE_BASE_DATA ("PROJECTNUM","PHASE","REALID","PinNumber","OwnerWholeName","OwnerAdd1","OwnerAdd2","OwnerAdd3","DeedBook","DeedPage") VALUES'
    let i=1;
    parceldata.forEach(function(p){
        console.log(p.OBJECTID)
        //!!!!!'(ﾉ▀̿̿Ĺ̯̿̿▀̿ ̿ )ﾉ ︵┻━┻"TODO DOn't fall for this shit. use the produciton query string when testing is done(ﾉ▀̿̿Ĺ̯̿̿▀̿ ̿ )ﾉ ︵┻━┻"!!!!!
        queryString+=" ('"+p.ProjectNumber+"','"+p.Phase+"','"+p.Realid+"','"+p.PIN10+"','"+p.OwnerWholeName+"','"+p.OwnerAdd1+"','"+p.OwnerAdd2+"','test','"+p.DeedBook+"','"+p.DeedPage+"')"
        //queryString+=" ('"+p.ProjectNumber+"','"+p.Phase+"','"+p.Realid+"','"+p.PIN10+"','"+p.OwnerWholeName+"','"+p.OwnerAdd1+"','"+p.OwnerAdd2+"','"+p.OwnerAdd3+"','"+p.DeedBook+"','"+p.DeedPage+"')"
        if(i<parceldata.length){
            queryString+=','
        }
        i++
    })
    queryString+=';'
    console.log(queryString)
    const request = new Request(queryString, function(err, rowCount) {
        if (err) {
          console.log(err);
          res.send({'status':'error', 'info':'there was an error','error':err,'mood':'(ﾉ▀̿̿Ĺ̯̿̿▀̿ ̿ )ﾉ ︵┻━┻"'})
        } else {
          console.log(rowCount + ' rows');
          res.send({'status':'success', 'info':'your records were a success','mood':'ヽ༼ຈل͜ຈ༽ﾉ'})
        }
      });
  
      
  
      connection.execSql(request);
});
app.post('/getprojectparcels', function (req, res) {
    var request = new Request("SELECT DISTINCT PinNumber FROM RE_BASE_DATA", function(err, rowCount) {
        if (err) {
          console.log(err);
        } else {
          console.log(rowCount + ' rows');
          res.send(pins)
        }
      });
      var pins = []
      request.on('row', function(columns) {
          //console.log(columns)
        columns.forEach(function(column) {
            //console.log(column.metadata.colName + ": " + column.value);
            pins.push(column.value)
        });
      });
  
      connection.execSql(request);
});
//app.get('/facilitybyid/:id', function (req, res) {
app.post('/hitnodeapp/:data', function (req, res) {
    console.log('hittingnodeapp')
    console.log(req.params.data)
    const data = JSON.parse(req.params.data)
    console.log('JSON.stringify: ' + JSON.stringify(data))
    
    res.send({'info':'ʕ•ᴥ•ʔ'})
});
app.listen(3001, 'localhost',  function () {
  console.log('Example app listening on port 3001!');
});

