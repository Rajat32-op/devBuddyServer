const User=require('../models/User');

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

module.exports={
    addUsername
}