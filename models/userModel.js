const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  posts: [String],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
