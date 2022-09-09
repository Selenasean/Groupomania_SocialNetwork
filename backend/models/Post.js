const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  userId: { type: String, required: true },
  legend: { type: String, required: true },
  imageUrl: { type: String },
  likes: { type: Number, default: 0 },
  usersLiked: { type: [String], default: [String] },
});

module.exports = mongoose.model("Post", postSchema);
