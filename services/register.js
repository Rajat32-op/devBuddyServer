const User=require('../models/User');
const GoogleUser=require('../models/googleUser')

function registerUser(name,email,pass){
    User.insertOne({name:name,email:email,password:pass});
}

function registerGoogleUser(name,email,profile_url){
    GoogleUser.insertOne({name:name,email:email,profile_url:profile_url})
}

module.exports={
    registerUser,registerGoogleUser
}