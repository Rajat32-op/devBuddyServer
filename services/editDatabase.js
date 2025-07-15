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

async function searchUser(req,res){
    const query=req.query.q;
    if(!query || query.trim()==="") return res.status(400).json({message:"Query parameter is required"});
    
    try{
        const reg=new RegExp(query, 'i'); // Case-insensitive search
        console.log(reg);
        const users=await User.find({
            $or: [
                {username: reg},
                {name: reg}
            ]
        }).select('name username profilePicture _id');
        console.log(users);
        res.status(200).json(users);
    } catch(err) {
        console.error(err);
        res.status(500).json({message:"Internal server error"});
    }
}

async function getUser(req, res) {
    const userId = req.query.id;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const user = await User.findById(userId).select('name username profilePicture _id bio friends posts');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
}

module.exports={
    addUsername,
    editProfile,
    searchUser,
    getUser
}