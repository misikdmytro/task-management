const mongoose = require('mongoose');

const { Schema } = mongoose;

const TaskSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      enum: ['new', 'active', 'completed', 'cancelled'],
      default: 'new',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,
  },
  { optimisticConcurrency: true },
);

module.exports = mongoose.model('task', TaskSchema);
