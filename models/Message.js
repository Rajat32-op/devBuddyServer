const mongoose=require('mongoose')
const messageSchema = new mongoose.Schema({
  roomId: String, // either groupId or private roomId
  senderId: mongoose.Schema.Types.ObjectId,
  receiverId: mongoose.Schema.Types.ObjectId, // for private chat
  message: String,
  isGroup: Boolean,
  seenBy: [mongoose.Schema.Types.ObjectId], // userIds who have seen it
  deletedBy:[mongoose.Schema.Types.ObjectId],
  createdAt: { type: Date, default: Date.now }  
});

messageSchema.index({roomId:1,createdAt:1})
messageSchema.index({deletedBy:1});

module.exports=mongoose.model('Message',messageSchema);
