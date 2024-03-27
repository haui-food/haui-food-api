const mongoose = require('mongoose');

const cartSchema = mongoose.Schema(
  {
    cartDetailId: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'CartDetail',
        default: [],
      },
    ],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    isOrder: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Cart', cartSchema);
