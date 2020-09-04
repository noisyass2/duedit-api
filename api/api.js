const fs = require('fs');
var dbs = [];


function makeid(length) {
    var result           = '';
    var characters       = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

function updateState(db){
    var state = {
        name: db.display,
        bets : [

        ],
        players : []
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
    state.players = db.players;

    db.state = state;
}

function getDB(name) {
    var found = dbs.filter((p) => {return p.name == name});
    if(found.length == 1)
    {
        return found[0];
    }else{
        return null;
    }
}


module.exports = {
    getVersion : (req,res) => {
        res.send("1.0")
    },

    addAct : (req,res) => {
        // console.log(req.query);
        var db = getDB(req.query.db)
        if(db && !db.locked){
            console.log(db)
            var bet = {
                name : req.query.name,
                amount: req.query.amt,
                bet : req.query.bet
            }
            db.acts.push(bet);
            updateState(db);
            console.log(db);
            res.send(db);
        }else{
            res.send("DB does not exist")
        }
    },

    saveDB : (req,res) => {
        console.log("saving dbs");

        fs.writeFileSync("dbs.db", JSON.stringify(dbs));
        res.send("DB Saved")
    },

    loadDB : (req,res) => {
        console.log("loading db");
        dbs  =JSON.parse(fs.readFileSync("dbs.db"));
        res.send(dbs);
    },

    getState : (req,res) => {
        console.log("getting state");
        var db = getDB(req.query.db)
        if(db){
            res.send(db.state)
        }else{
            res.send("DB does not exist")
        }
    },

    getSummary : (req,res) => {
        console.log('summary requested');
        var summary = []
        var db = getDB(req.query.db)
        if(db){
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
        }else{
            res.send("DB does not exist")
        }
    },

    getMyBets : (req,res) => {
        console.log('getting my bets')
        var mybets = [];
        var db = getDB(req.query.db)
        if(db){
            var bets = db.state.bets.filter(s => {return s.name == req.query.name})
            res.send(bets);
        }else{
            res.send("DB does not exist")
        }
    },

    newRound : (req,res) => {
        console.log("new round")
        db = { 
            acts : [],
            state: {},
            name : makeid(5),
            display: req.query.display,
            players : [],
            locked: false
        }

        dbs.push(db);
        res.send(db);
    },

    addPlayer : (req, res) => {
        console.log("adding player")

        var db = getDB(req.query.db)
        if(db){
            var playerExist = db.players.filter((p) => {return p.name == req.query.name})
            if(playerExist.length > 0){
                res.send("Already exists")
            }else{
                db.players.push({name: req.query.name})
                updateState(db);
                
                res.send(req.query.name + " added")
            }
           
        }else{
            res.send("DB not found")
        }

    },

    
    delPlayer : (req, res) => {
        console.log("removing player")

        var db = getDB(req.query.db)
        if(db){
            db.players = db.players.filter((p) => {return p.name != req.query.name})
            updateState(db);
            res.send(req.query.name + " removed")
           
        }else{
           
            res.send("DB does not exist")
            
        }

    },

    lockGame: (req,res) => {
        console.log("locking game")
        var db = getDB(req.query.db)
        if(db){
            db.locked = true;
            updateState(db);
            fs.writeFileSync("dbs.db", JSON.stringify(dbs));
            res.send(req.query.db + " locked")
        }
        else{
           
            res.send("DB does not exist")
            
        }
    },

    unlockGame: (req,res) => {
        console.log("unlocking game")
        var db = getDB(req.query.db)
        if(db){
            db.locked = false;
            updateState(db);
            fs.writeFileSync("dbs.db", JSON.stringify(dbs));
            res.send(req.query.db + " locked")
        }
        else{
           
            res.send("DB does not exist")
            
        }
    },

    getDBS : (req,res) => {
        console.log("getting DBS")
        res.send(dbs)
    },


    delBet : (req,res) => {
        console.log("deleting bet")
        var db = getDB(req.query.db)
        if(db){
            db.acts =  db.acts.filter(p => !(p.name == req.query.name && p.bet == req.query.bet))
            updateState(db);
            //fs.writeFileSync("dbs.db", JSON.stringify(dbs));
            res.send(req.query.name + " to " + req.query.bet + " removed")
        }
        else{
           
            res.send("DB does not exist")
            
        }
    },

    loadTestData : (req,res) => {
        console.log("deleting bet")
        var db = getDB(req.query.db)
        if(db){
            var ps = [];
            for (let i = 0; i < 5; i++) {
                ps.push(makeid(7))                
            }

            ps.forEach(p => {
                //addbet
                var bet = {
                    name : p,
                    amount: "" +  Math.floor(Math.random() * 20),
                    bet : db.players[Math.floor(Math.random() * db.players.length)].name
                }
                console.log("adding")
                console.log(bet)
                db.acts.push(bet);
            });

            updateState(db);
            //fs.writeFileSync("dbs.db", JSON.stringify(dbs));
            res.send(req.query.name + " to " + req.query.bet + " removed")
        }
        else{
           
            res.send("DB does not exist")
            
        }
    }
   
   
}