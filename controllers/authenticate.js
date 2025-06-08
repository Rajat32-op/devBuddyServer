const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt')
const User=require('../models/User')

async function checkAlreadyExists(req,res,next) {
    const user=await User.findOne({email:req.body.email});
    if(user){
        res.send("Already registered email", user);
    }
    else{
        next();
    }
}

async function checkPassword(req,res,next){
    const user=await User.findOne({email:req.body.email});
    if(!user){
        res.send("Not a registered email");
    }
    const passwordMatching=await bcrypt.compare(req.body.password,user.password);
    if(passwordMatching){
        req.user=user;
        next();
    }
    else{
        res.send("Wrong password");
    }
}

function generateToken(req,res){
    const user={
        name:req.body.name,
        email:req.body.email
    }
    const token=jwt.sign(user,process.env.AUTH_SECRET_KEY)
    res.json({token})
}

function checkLoggedinUser(req,res,next){
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith('Bearer')){
        res.status(401).json({error:"Unauthorized"});
    }
    const token=authHeader.split(' ')[1];
    try{
        const user=jwt.verify(token,process.env.AUTH_SECRET_KEY);
        req.user=user;
        next();
    }
    catch(err){
        res.status(403).json({error:"Not a user"});
    }
}
module.exports={
    checkLoggedinUser,generateToken,checkPassword,checkAlreadyExists
}