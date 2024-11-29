// import models
const Post = require('../models/postModel');
const Likes = require('../models/likeModel');

// like a post
exports.likePost = async (req, res) => {
    try {
        const {post, user} = req.body;
        const like = new Likes({post, user});
        const savedLike = await like.save();

        // update the post collection basus on this
        const updatedPost = await Post.findByIdAndUpdate(post, {$push: {likes: savedLike._id}}, {new: true})
        .populate('likes').exec();

        res.json({
            post: updatedPost,
        });
    }
    catch(error) {
        return res.status(400).json({
            error: 'Error while liking post'
        });
    }
}

// unlike a post
exports.unlikePost = async (req, res) => {
    try {
        const {post, like} = req.body;
        // find and delete the like collection me se
        const deleteLike = await Likes.findOneAndDelete({post:post, _id:like});
        
        // update the post collection 
        const updateedPost = await Post.findByIdAndUpdate(post, {$pull: {likes: deleteLike._id}}, {new: true});

        res.json({
            post: updateedPost
        });
    }
    catch(error) {
        return res.status(400).json({
            error: 'Error while unliking post'
        });
    }
}

exports.dummyLink = (req, res) => {
    res.send("This is your dummy page");
}; 