const express = require('express');
const app = express();
var apis = require('./api/api.js');

app.get('/',(req,res) => { res.send("pasok") })
.get('/api',apis.getVersion)
.get('/api/add', apis.addAct)
.get('/api/save', apis.saveDB)
.get('/api/load', apis.loadDB)
.get('/api/getState', apis.getState)
.get('/api/getSummary', apis.getSummary)
.get('/api/getMyBets', apis.getMyBets)
.listen(8888,() => {console.log('started')});
