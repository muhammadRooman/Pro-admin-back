const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  photo: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
  },
});
const Category = mongoose.model("category", categorySchema);

module.exports = Category;
