const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const postSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  likes: [{ type: String }],
  comments: [
    {
      comment: String,
      postedBy: String,
    },
  ],
  postedBy: {
    type: ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Post", postSchema);
