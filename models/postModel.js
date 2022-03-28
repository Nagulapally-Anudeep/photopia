const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  createdBy: {
    type: String, // user ID
  },
  comments: [String],
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
