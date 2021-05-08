const express = require('express')
const jsonData = require('./accounts.json');
const fs = require('fs')
const path = require('path')
const app = express()
const port = 3000
const engines = require('consolidate');
const multer = require('multer')
var storage = multer.diskStorage({
  destination: function (req, file, cb){
    cb(null,"Users/"+username+pwd)
  },
  filename: function (req, file, cb) {
    const parts = file.mimetype.split("/");
    cb(null, `${file.fieldname}-${Date.now()}.${parts[1]}`)
  }
})

const upload = multer({storage})
const users = []
var username = ''
var pwd = ''
app.set('views', __dirname + '/public');
app.engine('html', engines.mustache);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(express.urlencoded({extended: false}))

app.get('/',(req,res) => {
  res.render('index.html')
})

app.get('/login',(req,res) => {
  res.render('login.html')
})

app.post('/login',(req,res) => {
  try{
    var found = false
    fs.readFile('accounts.json', function (err, data) {
      var json = JSON.parse(data)
      json.forEach(account =>{
        if(account.username == req.body.username && account.password == req.body.password){
          found = true
          username = req.body.username
          pwd = req.body.password
          return
        }
      })
      if(found){
        res.redirect('/homepage')
      }else{
        console.log('Not Found')
        res.redirect('/login')
      }
    })
  }catch{
    res.redirect('/login')
  } 
})

app.get('/register',(req,res) => {
  res.render('register.html')
})

app.post('/register',(req,res) => {
  try{
    var found = false
    fs.readFile('accounts.json', function (err, data) {
      var json = JSON.parse(data)
      json.forEach(account =>{
        if(account.username == req.body.username && account.password == req.body.password){
          found = true
          return
        }
      })
      if(!found){
        json.push({
          username: req.body.username,
          password: req.body.password
        })
        fs.writeFile("accounts.json", JSON.stringify(json),function(err){
          if (err) throw err;
        })
        fs.mkdirSync('Users/'+req.body.username + req.body.password)
        res.redirect('/login')
      }else{
        console.log('Already registered')
        res.redirect('/register')
      }
    })
  }catch{
    res.redirect('/register')
  }
})
app.listen(port, () => {
  console.log(`Listening at port: `+port)
})

app.get('/homepage',(req,res) => {
  res.render('loggedin.html')
})

app.post('/homepage', upload.single("image"), (req,res) => {
  res.redirect('/homepage')
  console.log("SAVED")
})