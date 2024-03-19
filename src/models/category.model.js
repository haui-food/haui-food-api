const mongose = require('mongoose');
const categorySchema = mongose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    images: {
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
module.exports = mongose.model('Category', categorySchema);
