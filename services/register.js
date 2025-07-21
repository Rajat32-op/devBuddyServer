const User=require('../models/User');

async function registerUser(name,email,username="",pass=""){
    await User.create({name:name,username:username,email:email,password:pass});
}

module.exports={
    registerUser
}