const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        index:true,
    },
    email:String,
    password:String,
    username:{
        type:String,
        index:true,
        unique:true,
    },
    friends:Array,
    profilePicture:String,
    bio:String,
    createdAt:{
        type:Date,
        default:Date.now
    },
    posts:Array,
    savedPosts:Array,
    likedPosts:Array,
    notifications:Object,
    
})

userSchema.pre('save',async function (next) {
    if(!this.isModified('password'))return next();
    this.password=await bcrypt.hash(this.password,10)
    next();
})

module.exports=mongoose.model('User',userSchema);