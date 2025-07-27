const User=require('../models/User');

async function sendFriendRequest(req, res) {
    const friendUsername = req.body.friendUsername; 
    try {
        const user = req.user;
        const friend = await User.findOne({ username: friendUsername });

        if (!friend) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.friends.includes(friend._id)) {
            return res.status(400).json({ message: 'You are already friends with this user' });
        }

        // Here you can implement logic to send a friend request, e.g., adding to a pending requests list
        // For simplicity, we will just return a success message
        const newRequest={type:'friendRequest',from:user.username,createdAt:new Date()}
        friend.notifications.push(newRequest);
        await friend.save();
        res.status(200).json({ message: 'Friend request sent successfully' });
    } catch (error) {
        console.error('Error sending friend request:', error);
        res.status(500).json({ message: 'Error sending friend request' });
    }
}

async function addNewFriend(req, res) {
    const  friendId  = req.body.friendId;

    try {
        const user = req.user;
        const friend = await User.findById(friendId);

        if (!friend) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.friends.includes(friend._id)) {
            return res.status(400).json({ message: 'You are already friends with this user' });
        }
        if (friend.notifications.some(notification => notification.type === 'friendRequest' && notification.from === user.username)) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }
        user.friends.push(friend._id);
        friend.friends.push(user._id);
        await user.save();
        await friend.save();

        res.status(200).json({ message: 'Friend added successfully' });
    } catch (error) {
        console.error('Error adding friend:', error);
        res.status(500).json({ message: 'Error adding friend' });
    }
}

module.exports = {
    addNewFriend,sendFriendRequest
};