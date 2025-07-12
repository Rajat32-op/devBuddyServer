const express = require('express')
var cors=require('cors')
const {checkLoggedinUser,generateToken,checkPassword,checkAlreadyExists, verifyGoogleToken}=require('./controllers/authenticate')
const {registerUser}=require('./services/register')
const {createNewPost}=require('./services/addPost')
const {addUsername,editProfile}=require('./services/editDatabase')
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
  registerUser(req.body.name,req.body.username,req.body.email,req.body.password);
  generateToken(req,res);
})

app.post('/google-signup',async(req,res)=>{
  console.log("google signup");
  verifyGoogleToken(req,res);
})

app.post('/login',checkPassword,(req,res)=>{
  console.log(req.user.name,"  logged in");
  generateToken(req,res);
})

app.patch('/addUserName-google',async(req,res)=>{
  addUsername(req,res);
  generateToken(req,res);
})

app.patch('/edit-profile',async(req,res)=>{
    editProfile(req,res);
})

app.post('/add-post',checkLoggedinUser,async (req, res) => {
  createNewPost(req, res);
})

app.get('/',checkLoggedinUser, (req, res) => {
  res.json('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
