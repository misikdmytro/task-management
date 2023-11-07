const mongoose = require('mongoose');

const { Schema } = mongoose;

const TaskSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['new', 'active', 'complete', 'cancelled'],
    default: 'new',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: Date,
});

module.exports = mongoose.model('task', TaskSchema);
