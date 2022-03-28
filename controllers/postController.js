const Post = require("../models/postModel");
const User = require("../models/userModel");

exports.createPost = async (req, res, next) => {
  const createdUser = req.user;
  const newPost = {
    picture: req.body.picture,
    caption: req.body.caption,
    createdBy: createdUser._id,
    createdByName: createdUser.name,
    createdByPic: createdUser.profilePic,
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

exports.getPost = async (req, res, next) => {
  // .../posts/:postID
  const post = await Post.findById(req.params.postID);
  res.render("comments", {
    post: post,
    user: req.user,
    isLoggedIn: true,
  });
};

exports.comment = async (req, res, next) => {
  //  .../posts/:postID
  const commentedUser = req.user;
  const newComment = {
    content: req.body.comment,
    commentBy: commentedUser._id,
    commentByName: commentedUser.name,
    commentByPic: commentedUser.profilePic,
  };

  const post = await Post.findById(req.params.postID);
  const postComments = post.comments;
  postComments.push(newComment);

  await Post.findByIdAndUpdate(
    post._id,
    { $set: { comments: postComments } },
    { new: true }
  );

  res.redirect(`/posts/${post._id}`);
};

exports.likePost = async (req, res, next) => {
  const post = await Post.findById(req.body.postID);
  const user = req.user;

  const userLikedPosts = user.likedPosts;
  userLikedPosts.push(post._id);

  await User.findByIdAndUpdate(
    user._id,
    { $set: { likedPosts: userLikedPosts } },
    { new: true }
  );

  let likes = post.likes;
  likes++;

  await Post.findByIdAndUpdate(post._id, { $set: { likes } }, { new: true });
  res.redirect("/");
};

exports.unlikePost = async (req, res, next) => {
  const post = await Post.findById(req.body.postID);
  const user = req.user;

  const userLikedPosts = user.likedPosts;
  const index = indexOf(post._id);
  userLikedPosts.splice(index, 1);

  await User.findByIdAndUpdate(
    user._id,
    { $set: { likedPosts: userLikedPosts } },
    { new: true }
  );

  let likes = post.likes;
  likes--;

  await Post.findByIdAndUpdate(post._id, { $set: { likes } }, { new: true });
  res.redirect("/");
};
