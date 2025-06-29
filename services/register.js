const User=require('../models/User');

function registerUser(name,email,username="",pass=""){
    User.insertOne({name:name,username:username,email:email,password:pass});
}

module.exports={
    registerUser
}