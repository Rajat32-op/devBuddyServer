const Post = require('../models/Post');
const Comment = require('../models/Comment');
async function createNewPost(req,res){
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
    await Post.create(post);
    res.status(200).json({ message: 'Post created successfully' });
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(500).json({ message: 'Error creating post' });
  }
}

function likePost(req, res) {
  const postId = req.body.postId;
  try {
    req.user.likedPosts.push(postId);
    res.status(200).json({ message: 'Post liked successfully' });
  } catch (error) {
    console.error('Error liking post:', error);
    res.status(500).json({ message: 'Error liking post' });
  }
}

function unlikePost(req,res){
  const postId = req.body.postId;
  try {
    req.user.likedPosts = req.user.likedPosts.filter((id) => id !== postId);
    res.status(200).json({ message: 'Post unliked successfully'});
  } catch (error) {
    console.error('Error unliking post:', error);
    res.status(500).json({ message: 'Error unliking post' });
  }
}

async function addComment(req, res) {
  const { postId, content } = req.body;
  if (!postId || !content) {
    return res.status(400).json({ message: 'Post ID and content are required' });
  } 
  try {
    const comment = new Comment({
      userId: req.user._id,
      content,
      postId
    });
    await comment.save();
    
    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Error adding comment' });
  }
}

const getPosts = async (req, res) => {
  try {
    const posts = await Post.find({userId:req.query.userId}).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {  
    console.error('Error fetching posts:', error);
    res.status(500).json({ message: 'Error fetching posts' });
  }
};

module.exports = {
  createNewPost,likePost,unlikePost,addComment,getPosts
};