const mongoose=require('mongoose')
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    photo_url:String,
    username:String
})


module.exports=mongoose.model('GoogleUser',userSchema);