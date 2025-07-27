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
    friends:{
        type:Array,
        default: []
    },
    profilePicture:{
        type:String,
        default:'https://example.com/default-profile-picture.png'
    },
    bio:{
        type:String,
        default:''
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    posts:{
        type:Array,
        default:[]
    },
    savedPosts:{
        type:Array,
        default:[]
    },
    likedPosts:{
        type:Array,
        default:[]
    },
    notifications:{
        type:Object,
        default: {}
    },
    
},{minimize: false});

userSchema.pre('save',async function (next) {
    if(!this.isModified('password'))return next();
    this.password=await bcrypt.hash(this.password,10)
    next();
})

module.exports=mongoose.model('User',userSchema);