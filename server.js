const express=require('express'); const sqlite3=require('sqlite3').verbose();
const app=express(); const db=new sqlite3.Database('./signin.db');
app.use(express.json()); app.use(express.static('public'));
db.serialize(()=>{db.run(`CREATE TABLE IF NOT EXISTS logs(id INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,trade TEXT,date TEXT,time TEXT,action TEXT)`);});
app.post('/api/sign',(req,res)=>{const {name,trade,action,date}=req.body; const now=new Date(); const time=now.toLocaleTimeString();
db.run('INSERT INTO logs(name,trade,date,time,action) VALUES(?,?,?,?,?)',[name,trade,date,time,action],()=>res.json({ok:true}));});
app.get('/api/logs',(req,res)=>db.all('SELECT * FROM logs ORDER BY id DESC',(e,r)=>res.json(r)));
app.get('/api/csv',(req,res)=>db.all('SELECT * FROM logs ORDER BY id DESC',(e,rows)=>{let csv='ID,Name,Trade,Date,Time,Action\n'; rows.forEach(x=>csv+=`${x.id},${x.name},${x.trade},${x.date},${x.time},${x.action}\n`); res.header('Content-Type','text/csv'); res.attachment('job-signin-log.csv'); res.send(csv);}));
app.listen(process.env.PORT||3000);