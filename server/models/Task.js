const mongoose = require('mongoose')
const Schema = mongoose.Schema;


const TaskSchema = new Schema({
  name: {
    type: String,
    required: [true, 'must provide name'],
    trim: true,
    maxlength: [50, 'name can not be more than 20 characters'],
  },
  completed: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: Schema.Types.ObjectId, 
    ref: 'User' 
  },
})

module.exports = mongoose.model('Task', TaskSchema)
