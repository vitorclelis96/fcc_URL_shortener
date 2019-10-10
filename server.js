'use strict';

const express = require('express');
const dbConnect = require('./config/dbConnect');
const bodyParser = require('body-parser');
var cors = require('cors');
var app = express();


// Basic Configuration 
dbConnect();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));
// cors for FCC testing




// Routes
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});
app.use('/api/shorturl', require('./routes/api/shorturl'));


// Start
const PORT = process.env.PORT || 3000;
app.listen(PORT, function () {
  console.log('Node.js listening on ' + PORT);
});