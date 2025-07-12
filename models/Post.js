const mongoose=require('mongoose')
const postSchema=new mongoose.Schema({
    userId:String,
    username:String,
    profilePicture:String,
    name:String,
    caption:String,
    image:String,
    codeSnippet:String,
    tags:Array,
    likes:Number,
    comments:Array,
    createdAt:{
        type:Date,
        default:Date.now
    },
})
module.exports=mongoose.model('Post',postSchema);