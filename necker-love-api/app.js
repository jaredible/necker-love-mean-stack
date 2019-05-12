const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const userRoutes = require('./routes/user');

const app = express();

if (app.get('env') === 'production') {
  mongoose.connect('mongodb+srv://matchMaker:p%40ssw0rd@cluster0-nnays.mongodb.net/mean?retryWrites=true', {
    useNewUrlParser: true,
    useCreateIndex: true
  }).then(() => {
    console.log('Connected to production database!');
  }).catch(() => {
    console.log('Connection failed!');
  });
} else {
  mongoose.connect('mongodb://localhost:27017/mean?retryWrites=true', {
    auth: {
      user: 'matchMaker',
      password: 'p@ssw0rd'
    },
    useNewUrlParser: true,
    useCreateIndex: true
  }).then(() => {
    console.log('Connected to development database!');
  }).catch(() => {
    console.log('Connection failed!');
  });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use('/images', express.static(path.join('images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, PUT, DELETE, OPTIONS');
  next();
});

app.use('/api/user', userRoutes);

module.exports = app;
