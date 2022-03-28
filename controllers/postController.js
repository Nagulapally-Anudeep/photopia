const Post = require("../models/postModel");
const User = require("../models/userModel");

exports.createPost = async (req, res, next) => {
  const createdUser = req.user;
  const newPost = {
    picture: req.body.picture,
    caption: req.body.caption,
    createdBy: createdUser._id,
  };
  const post = await Post.create(newPost);

  const userPosts = createdUser.posts;
  userPosts.push(post._id);

  await User.findByIdAndUpdate(
    createdUser._id,
    { $set: { posts: userPosts } },
    { new: true }
  );

  res.redirect("/");
};

exports.likePost = async (req, res, next) => {};
exports.unlikePost = async (req, res, next) => {};
exports.comment = async (req, res, next) => {};
