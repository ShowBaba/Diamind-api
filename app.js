const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const config = require('./config/db.config');

dotenv.config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users.route');
const entriesRouter = require('./routes/entries.route');

const app = express();
const corsOptions = {
  origin: '*',
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions));
app.use(passport.initialize());

app.get('*', (req, res) => {
  res.redirect('/api/v1');
});

app.get('/entries', (req, res) => {
  res.redirect('/api/v1/entries');
});

// app.get('*', (req, res) => {
//   res.redirect('/api/v1');
// });

app.use('/api/v1/', indexRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/entries', entriesRouter);

app.use(express.static(path.join(__dirname, 'public')));

const localUrl = config.mongoUrl;
// eslint-disable-next-line no-unused-vars
const liveUrl = process.env.DB_CONNECTION;
// replace liveUrl with localUrl to use local mongodb
const connect = mongoose.connect(localUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
});

// establish connection
connect.then(
  // eslint-disable-next-line no-unused-vars
  (db) => {
    console.log('Connected to Database');
  },
  (err) => {
    console.log(err);
  },
);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use((err, req, res) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
