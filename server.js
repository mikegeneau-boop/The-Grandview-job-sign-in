const express = require('express');
const fs = require('fs');
const app = express();

app.use(express.json());
app.use(express.static('public'));

const FILE = 'log.json';

let logs = [];
if (fs.existsSync(FILE)) {
    logs = JSON.parse(fs.readFileSync(FILE));
}

app.post('/log', (req, res) => {
    const entry = {
        time: new Date().toISOString(),
        name: req.body.name,
        company: req.body.company,
        action: req.body.action
    };

    logs.push(entry);
    fs.writeFileSync(FILE, JSON.stringify(logs, null, 2));

    res.send({ success: true });
});

app.get('/status', (req, res) => {
    const status = {};

    logs.forEach(entry => {
        status[entry.name] = {
            action: entry.action,
            company: entry.company
        };
    });

    const onSite = Object.keys(status)
        .filter(name => status[name].action === "Sign In")
        .map(name => ({
            name,
            company: status[name].company || "Unknown"
        }));

    res.send(onSite);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Running on port " + PORT));
