const mongoose = require('mongoose');  
const commentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref:'User', required: true },
  username:String,
  name:String,
  profilePicture:{
    type:String,
    default:""
  },
  content: { type: String, required: true },
  postId: { type: mongoose.Schema.Types.ObjectId, ref:'Post', required: true },
  createdAt: { type: Date, default: Date.now }
});

commentSchema.index({postId:1,createdAt:1});

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;