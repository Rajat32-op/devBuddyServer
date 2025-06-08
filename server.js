const express = require('express')
var cors=require('cors')
const {checkLoggedinUser,generateToken,checkPassword,checkAlreadyExists}=require('./controllers/authenticate')
const {registerUser}=require('./services/register')
const jwt=require('jsonwebtoken')

const app = express()
const port = 3000
require('dotenv').config();
const mongoose = require('mongoose');

app.use(express.json())

var corsConfig={
  origin:"http://localhost:5173"
}

mongoose.connect(process.env.MONG_URL)
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

app.get('/signup',checkAlreadyExists,(req,res)=>{
  console.log('signing up');
  registerUser(req.body.name,req.body.email,req.body.password);
  res.send('Signed Up');
})

app.get('/login',checkPassword,(req,res)=>{
  console.log(req.user.name,"  logged in");
  generateToken(req,res);
})

app.get('/',cors(corsConfig),checkLoggedinUser, (req, res) => {
  console.log("get request")
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
