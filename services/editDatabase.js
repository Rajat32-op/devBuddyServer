const User=require('../models/User');
const jwt=require('jsonwebtoken');

async function addUsername(req,res){
    let email=req.cookies.email;
    console.log(email)
    try{
        await User.updateOne({email:email},{
            $set:{username:req.body.username}
        })
    }
    catch(err){
        console.log(err)
        res.json({message:"error"})
    }
}

async function editProfile(req,res){
    let token=req.cookies.token;
    const userName=jwt.verify(token,process.env.AUTH_SECRET_KEY).username;
    const user=await User.findOne({username:userName});
    if(!user){
        return res.status(404).json({message:"User not found"});
    }
    const updatedData={};
    if(req.body.name) updatedData.name=req.body.name;
    if(req.body.bio) updatedData.bio=req.body.bio;
    if(req.body.profilePicture) updatedData.profilePicture=req.body.profilePicture;
    await User.updateOne({username:userName},{$set:updatedData});
    res.json({message:"Profile updated successfully"});//may have to send updated user.
    
}

module.exports={
    addUsername,
    editProfile
}