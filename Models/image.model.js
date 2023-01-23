const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const ImageSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  by: {
    type: String,
    required: false,
  },
});

module.exports = ImageModel = mongoose.model("imageModel", ImageSchema);
