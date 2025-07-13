const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    password:String,
    username:String,
    friends:Array,
    profilePicture:String,
    bio:String,
    createdAt:{
        type:Date,
        default:Date.now
    },
    posts:Array,
    savedPosts:Array,
    notifications:Object,
    
})

userSchema.pre('save',async function (next) {
    if(!this.isModified('password'))return next();
    this.password=await bcrypt.hash(this.password,10)
    next();
})

module.exports=mongoose.model('User',userSchema);