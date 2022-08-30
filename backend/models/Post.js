const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  likes: { type: Number, default: 0 },
  usersLiked: { type: [String], default: [String] },
  dislikes: { type: Number, default: 0 },
  usersDisliked: { type: [String], default: [String] },
});

module.exports = mongoose.model("Post", postSchema);
