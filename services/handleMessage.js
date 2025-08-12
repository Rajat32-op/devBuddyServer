const Message = require('../models/Message');
const User = require('../models/User')
const { storage ,cloudinary} = require('./cloudinary')
const upload = require('multer')({ storage });

const uploadChatImage = async (req, res, next) => {
    console.log('hello');
    upload.array('images', 10)(req, res, (err) => {
        if (err) {
            return res.status(400).json(err)
        }
        next();
    });
}

async function getchats(req, res) {
    try {

        const recentChats = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { senderId: req.user._id },
                        { receiverId: req.user._id }
                    ],
                    deletedBy: { $ne: req.user._id }
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
        const sortedChats = recentChats.map(c => ({ ...userMap[c._id.toString()]._doc, lastMessageTime: c.lastMessageTime }));

        return res.status(200).json(sortedChats)
    }
    catch (err) {
        console.log(err);
        res.status(500)
    }
}

async function deleteChat(req, res) {
    const { roomId } = req.body;

    try {
        // Step 1: Mark messages as deleted by current user
        await Message.updateMany(
            { roomId: roomId },
            { $addToSet: { deletedBy: req.user._id } }
        );

        // Step 2: Find messages to permanently delete (deletedBy size = 2)
        const toDelete = await Message.find({
            roomId: roomId,
            $expr: { $eq: [{ $size: "$deletedBy" }, 2] }
        });

        if (toDelete.length > 0) {
            // Step 3: Collect all Cloudinary IDs
            const allImageIds = toDelete
                .flatMap(msg => msg.imageIds || []);

            // Step 4: Delete images from Cloudinary
            for (const id of allImageIds) {
                try {
                    await cloudinary.uploader.destroy(id);
                } catch (err) {
                    console.error(`Failed to delete Cloudinary image: ${id}`, err);
                }
            }

            // Step 5: Delete messages from DB
            await Message.deleteMany({ _id: { $in: toDelete.map(m => m._id) } });
        }

        return res.status(200).json({ message: "successful" });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "error" });
    }
}

module.exports = {
    deleteChat, getchats, uploadChatImage
}