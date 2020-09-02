const fs = require('fs');
var db = { 
    acts : [],
    state: {}
}

function updateState(){
    var state = {
        bets : [

        ]
    }
    db.acts.forEach(act => {
        var bet = state.bets.filter((p) => {return p.name == act.name && p.bet == act.bet})
        if(bet.length == 1)
        {
            bet[0].amount = act.amount;
        }else{
            var newBet = {
                name: act.name,
                amount : act.amount,
                bet: act.bet,                
            }
            state.bets.push(newBet);
        }
    });

    db.state = state;
}

function updateTotal(bet){
    var acts = db.acts.filter((p) => {return p.name == bet.name});
    foreach
}

module.exports = {
    getVersion : (req,res) => {
        res.send("1.0")
    },

    addAct : (req,res) => {
        console.log(req.query);
        var bet = {
            name : req.query.name,
            amount: parseInt(req.query.amt),
            bet : req.query.bet
        }
        db.acts.push(bet);
        updateState();
        console.log(db);
        res.send(db);
    },

    saveDB : (req,res) => {
        console.log("saving db");

        fs.writeFileSync("db.db", JSON.stringify(db));
        res.send("DB Saved")
    },

    loadDB : (req,res) => {
        console.log("loading db");
        db  =JSON.parse(fs.readFileSync("db.db"));
        res.send(db);
    },

    getState : (req,res) => {
        console.log("getting state");

        res.send(db.state)
    },

    getSummary : (req,res) => {
        console.log('summary requested');
        var summary = []
        db.state.bets.forEach(bet => {
            var player = summary.filter(s => { return s.name == bet.bet});
            if(player.length == 0)
            {
                var newPlayer = {
                    name : bet.bet,
                    bettors : [bet.name]
                }
                summary.push(newPlayer)
            }else{
                player[0].bettors.push(bet.name);
            }
        })

        res.send(summary);

    },

    getMyBets : (req,res) => {
        console.log('getting my bets')
        var mybets = [];
        var bets = db.state.bets.filter(s => {return s.name == req.query.name})
        res.send(bets);
    }
}