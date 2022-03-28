const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  picture: {
    type: String,
  },
  caption: {
    type: String,
  },
  createdBy: {
    type: String, // user ID
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: [
    {
      content: String, //actual comment
      commentBy: String, // comment by userId
    },
  ],
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
