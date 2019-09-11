let assert = require('assert');
let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

let indexRouter = require('./routes/index');
let usersRouter = require('./routes/loan');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/loan', usersRouter);

const connectDb = async () => {
  const password = '%24Leoj2468'
  const MongoClient = require('mongodb').MongoClient;
  const uri = `mongodb+srv://mjh5153:${password}@cluster0-ryuu5.mongodb.net/test?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, { useNewUrlParser: true });
  try {
    await client.connect();
    console.log('mongo client', client);
    const db = client.db("test")
    // .collection("devices");
    // perform actions on the collection object
    console.log('db:', db);
    db.createCollection("loans", { "capped": false, "size": 100000, "max": 5000},
      (err, results) => {
        console.log("Collection created.", results);
        
      }
    );
    db.collection('loans').insertOne({
      item: "loan",
      qty: 100,
      tags: ["amount"],
      size: { h: 28, w: 35.5, uom: "cm" }
    })
    .then(result => {
      console.log('loan collection results: ', JSON.stringify(result.result.ok));
      client.close();
      // process result
    })
  } catch(err) {
    console.log('error ', err);
  } 
}

connectDb();

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
