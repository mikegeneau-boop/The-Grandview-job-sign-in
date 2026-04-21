const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const FILE = 'log.json';
const PASSWORD = "lanca123";

let logs = [];
if (fs.existsSync(FILE)) {
    logs = JSON.parse(fs.readFileSync(FILE));
}

app.post('/log', (req, res) => {
    const entry = {
        time: new Date().toISOString(),
        name: req.body.name,
        company: req.body.company,
        trade: req.body.trade,
        action: req.body.action
    };
    logs.push(entry);
    fs.writeFileSync(FILE, JSON.stringify(logs, null, 2));
    res.send({ success: true });
});

app.get('/status', (req, res) => {
    const latest = {};
    logs.forEach(e => latest[e.name] = e);

    const onsite = Object.values(latest)
        .filter(e => e.action === "Sign In");

    res.send(onsite);
});

app.get('/logs', (req,res)=>{
    res.send(logs);
});

app.post('/delete', (req,res)=>{
    logs.splice(req.body.index,1);
    fs.writeFileSync(FILE, JSON.stringify(logs,null,2));
    res.send({success:true});
});

app.post('/login',(req,res)=>{
    if(req.body.password===PASSWORD){
        res.send({success:true});
    } else {
        res.send({success:false});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on " + PORT));
