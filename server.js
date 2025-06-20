const express = require('express')
var cors=require('cors')
const {checkLoggedinUser,generateToken,checkPassword,checkAlreadyExists, verifyGoogleToken}=require('./controllers/authenticate')
const {registerUser}=require('./services/register')
const jwt=require('jsonwebtoken')
const cookie_parser=require('cookie-parser')

const app = express()
const port = 3000
require('dotenv').config();
const mongoose = require('mongoose');

var corsConfig={
  origin:"http://localhost:5173",
  credentials:true
}
app.use(cors(corsConfig));

app.use(cookie_parser())
app.use(express.json())


mongoose.connect(process.env.MONG_URL)
.then(() => console.log('MongoDB connected!'))
.catch(err => console.error('MongoDB connection error:', err));

app.post('/signup',checkAlreadyExists,(req,res)=>{
  console.log('signing up');
  registerUser(req.body.name,req.body.email,req.body.password);
  res.json('Signed Up');
})

app.post('/google-signup',async(req,res)=>{
  console.log("google signup");
  verifyGoogleToken(req,res);
})

app.post('/login',checkPassword,(req,res)=>{
  console.log(req.user.name,"  logged in");
  generateToken(req,res);
})

app.get('/',checkLoggedinUser, (req, res) => {
  console.log("get request")
  res.json('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
