const { response } = require('express');
const Message = require('../models/Message');
const User = require('../models/User')

async function getchats(req, res) {
    try{

        const recentChats = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: req.user._id },
                        { receiverId: req.user._id }
                    ]
                }
            },
            {
                $project: {
                    senderId: 1,
                    receiverId: 1,
                    createdAt: 1
                }
            },
            {
                $addFields: {
                    otherUser: {
                        $cond: [
                            { $eq: ["$senderId", req.user._id] },
                            "$receiverId",
                            "$senderId"
                        ]
                    }
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: "$otherUser",
                    lastMessageTime: { $first: "$createdAt" }
                }
            },
            {
                $sort: { lastMessageTime: -1 }
            }
        ]);
        
        
        const users = await User.find({ _id: { $in: recentChats.map(c => c._id) } }).select("_id name username profilePicture")
        const userMap = {};
        users.forEach(user => userMap[user._id.toString()] = user);
        // Merge
        const sortedChats = recentChats.map(c => ({...userMap[c._id.toString()]._doc,lastMessageTime:c.lastMessageTime}));
        
        return res.status(200).json(sortedChats)
    }
    catch(err){
        console.log(err);
        res.status(500)
    }
}

async function deleteChat(req, res) {
    const roomId = req.body.roomId;
    try {

        await Message.updateMany({ roomId: roomId },
            { $addToSet: { deletedBy: req.user._id } })
        return res.status(200)
    }
    catch (err) {
        console.log(err);
        return res.status(500)
    }
}

module.exports = {
    deleteChat,getchats
}