const User=require('../models/User');

function registerUser(name,email,pass){
    User.insertOne({name:name,email:email,password:pass});
}

module.exports={
    registerUser
}