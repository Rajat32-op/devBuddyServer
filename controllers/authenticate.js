const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt')
const User=require('../models/User')
const {registerUser,registerGoogleUser}=require('../services/register')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client();

async function verifyGoogleToken(req,res) {
  const { token } = req.body;
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  if(!ticket){
    res.json({error:"Not Authorized"})
  }

  const payload = ticket.getPayload();
  const email = payload.email;
  const name = payload.name;
  const profile_url=payload.picture;

  let user = await User.findOne({ email });

  if (!user) {
    registerGoogleUser(name,email,profile_url)
    user={
        name:name,
        email:email
    }
  }

  const jwtToken=jwt.sign(user,process.env.AUTH_SECRET_KEY);

  res.json({ token: jwtToken });
}

async function checkAlreadyExists(req,res,next) {
    const user=await User.findOne({email:req.body.email});
    if(user){
        res.json({error:"Already registered email"});
    }
    else{
        next();
    }
}

async function checkPassword(req,res,next){
    const user=await User.findOne({username:req.body.username});
    console.log(user)
    if(!user){
        res.json({error:"Not a registered user"});
        return;
    }
    const passwordMatching=await bcrypt.compare(req.body.password,user.password);
    if(passwordMatching){
        req.user=user;
        next();
    }
    else{
        res.json({error:"Wrong password"});
    }
}

function generateToken(req,res){
    const user={
        username:req.body.username
    }
    const token=jwt.sign(user,process.env.AUTH_SECRET_KEY)
    res.cookie("token", token, {
            httpOnly: true,
            secure: false, //set true when deploying
            sameSite: "Lax",
            maxAge: 24 * 60 * 60 * 1000, 
    });
    res.json({ message: "Login successful" });
}

function checkLoggedinUser(req,res,next){
    const cookieToken=req.cookies.token;
    if(!cookieToken){
        res.json({error:"Unauthorized"});
    }
    
    try{
        const user=jwt.verify(cookieToken,process.env.AUTH_SECRET_KEY);
        req.user=user;
        next();
    }
    catch(err){
        res.json({error:"Not a user"});
    }
}
module.exports={
    checkLoggedinUser,generateToken,checkPassword,checkAlreadyExists,verifyGoogleToken
}