const Post = require('../models/Post');
async function createNewPost(req,res){
    console.log(req.user);
    const post = {
    userId: req.user._id,
    username: req.user.username,
    profilePicture: req.user.profilePicture? req.user.profilePicture : '',
    name: req.user.name,
    caption: req.body.caption? req.body.caption : '',
    image: req.body.image? req.body.image : '',
    codeSnippet: req.body.codeSnippet? req.body.codeSnippet : '',
    tags: req.body.tags? req.body.tags : [],
    likes: 0,
    comments: [],
    createdAt: new Date()
  };
  try {
    const newPost = new Post(post);
    await newPost.save();
    res.status(201).json({ message: 'Post created successfully', post: newPost  });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
}
module.exports = {
  createNewPost
};