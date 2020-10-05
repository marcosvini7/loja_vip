const express = require('express')
var app = express()
var consign = require('consign')
var multiparty = require('connect-multiparty')
var bodyParser = require('body-parser')
var expressSession = require('express-session')

app.set('view engine', 'ejs')
app.set('views', './application/views')

app.use(express.static('./public'))
app.use(multiparty())
app.use(expressSession({
	secret: 'segredo',
	resave: true,
	saveUninitialized: true,
}))

app.use(bodyParser.urlencoded({
    parameterLimit: 100000,
    limit: '50mb',
    extended: true
  }));

consign().include('application/routes')
	.then('application/controllers')
	.then('config/dbConnection.js')
	.then('application/models')
	.into(app)

module.exports = app