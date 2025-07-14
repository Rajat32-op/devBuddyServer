const express = require('express')
var cors=require('cors')
const {checkLoggedinUser,generateToken,checkPassword,checkAlreadyExists, verifyGoogleToken}=require('./controllers/authenticate')
const {registerUser}=require('./services/register')
const {createNewPost,likePost,unlikePost,addComment}=require('./services/addPost')
const {addUsername,editProfile}=require('./services/editDatabase')
const {addNewFriend,sendFriendRequest}=require('./services/addFriend')
const cookie_parser=require('cookie-parser')

const app = express()
const port = 3000
require('dotenv').config();
const mongoose = require('mongoose');
const { addFriend } = require('./services/addFriend')

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

app.post('/send-friend-request',checkLoggedinUser,async (req, res) => {
  sendFriendRequest(req, res);
})

app.post('/add-friend',checkLoggedinUser,async (req, res) => {
  addNewFriend(req, res);
})

app.post('/like-post',checkLoggedinUser,async (req, res) => {
  // Logic to like a post will go here
  likePost(req, res);
})

app.post('/unlike-post',checkLoggedinUser,async (req, res) => {
  // Logic to unlike a post will go here
  unlikePost(req, res);
})

app.post('/add-comment',checkLoggedinUser,async (req, res) => {
  addComment(req, res);
})

app.get('/me',checkLoggedinUser,async (req, res) => {
  // Logic to get notifications will go here
  const user = req.user; // Exclude password and __v field
  res.status(200).json(user);
})

app.get('/',checkLoggedinUser, (req, res) => {
  res.json('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
