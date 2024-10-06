const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const librarianSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  mobile: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['LIBRARIAN', 'MEMBER'], default: 'MEMEBER' },
}, { timestamps: true });



const Librarian = mongoose.model('Librarian', librarianSchema);

module.exports = Librarian ;