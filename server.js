const express = require('express')
var cors=require('cors')
const {checkLoggedinUser,generateToken,checkPassword,checkAlreadyExists, verifyGoogleToken}=require('./controllers/authenticate')
const {registerUser}=require('./services/register')
const {createNewPost,likePost,unlikePost,addComment,getPosts}=require('./services/addPost')
const {addUsername,editProfile,searchUser,getUser,uploadProfilePicture}=require('./services/editDatabase')
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
  registerUser(req.body.name,req.body.email,req.body.username,req.body.password);
  generateToken(req,res);
})

app.post('/google-signup',async(req,res)=>{
  verifyGoogleToken(req,res);
})

app.post('/login',checkPassword,(req,res)=>{
  generateToken(req,res);
})

app.post('/logout',(req,res)=>{
  res.clearCookie('token');
  res.clearCookie('email');
  res.status(200).json({message:"Logged out successfully"});
})

app.patch('/addUserName-google',async(req,res)=>{
  addUsername(req,res);
  generateToken(req,res);
})

app.patch('/edit-profile',checkLoggedinUser,uploadProfilePicture,async(req,res)=>{
    editProfile(req,res);
})


app.post('/send-friend-request',checkLoggedinUser,async (req, res) => {
  sendFriendRequest(req, res);
})

app.post('/add-friend',checkLoggedinUser,async (req, res) => {
  addNewFriend(req, res);
})

app.post('/add-post',checkLoggedinUser,async (req, res) => {
  createNewPost(req, res);
})

app.post('/like-post',checkLoggedinUser,async (req, res) => {
  likePost(req, res);
})

app.post('/unlike-post',checkLoggedinUser,async (req, res) => {
  unlikePost(req, res);
})

app.get('/get-posts',checkLoggedinUser,async (req, res) => {
  getPosts(req, res);
});

app.post('/add-comment',checkLoggedinUser,async (req, res) => {
  addComment(req, res);
})

app.get('/me',checkLoggedinUser,async (req, res) => {
  const user = req.user; 
  res.status(200).json(user);
})

app.get('/search',checkLoggedinUser,async (req, res) => {
  searchUser(req, res);
})

app.get('/get-user',async (req, res) => {
  getUser(req, res);
})

app.get('/',checkLoggedinUser, (req, res) => {
  res.json('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
