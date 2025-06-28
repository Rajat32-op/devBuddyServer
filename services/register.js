const User=require('../models/User');
const GoogleUser=require('../models/googleUser')

function registerUser(name,username,email,pass){
    User.insertOne({name:name,username:username,email:email,password:pass});
    console.log(username)
}

function registerGoogleUser(name,email,profile_url){
    GoogleUser.insertOne({name:name,email:email,profile_url:profile_url,username:""})
}

module.exports={
    registerUser,registerGoogleUser
}