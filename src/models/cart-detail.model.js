const mongoose = require('mongoose');

const cartDetailSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    isOrder: {
      type: Boolean,
      default: false,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('CartDetail', cartDetailSchema);
