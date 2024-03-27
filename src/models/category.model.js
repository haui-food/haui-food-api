const mongoose = require('mongoose');
const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);
module.exports = mongoose.model('Category', categorySchema);
