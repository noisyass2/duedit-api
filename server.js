const express = require('express');
const cors = require('cors')
const app = express();
var apis = require('./api/api.js');
const PORT = process.env.PORT || 5000

app.use(cors())

app.get('/',(req,res) => { res.send("pasok") })
.get('/api',apis.getVersion)
.get('/api/add', apis.addAct)
.get('/api/delBet', apis.delBet)
.get('/api/save', apis.saveDB)
.get('/api/load', apis.loadDB)
.get('/api/getDBS', apis.getDBS)
.get('/api/getState', apis.getState)
.get('/api/getSummary', apis.getSummary)
.get('/api/getMyBets', apis.getMyBets)
.get('/api/newRound', apis.newRound)
.get('/api/addPlayer', apis.addPlayer)
.get('/api/delPlayer', apis.delPlayer)
.get('/api/winPlayer', apis.winPlayer)
.get('/api/lockGame', apis.lockGame)
.get('/api/unlockGame', apis.unlockGame)
.get('/api/loadTestData',apis.loadTestData)
.listen(PORT,() => {console.log('started')});

