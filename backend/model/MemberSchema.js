const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const memberSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['LIBRARIAN', 'MEMBER'], default: 'MEMEBER' },
}, { timestamps: true });



const Member = mongoose.model('Member', memberSchema);

module.exports = Member ;