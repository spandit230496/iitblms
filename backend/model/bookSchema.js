const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const bookSchema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, required: true, unique: true },
  status: { type: String, enum: ['AVAILABLE', 'BORROWED'], default: 'AVAILABLE' },
}, { timestamps: true });



const Book = mongoose.model('Book', bookSchema);

module.exports = Book ;