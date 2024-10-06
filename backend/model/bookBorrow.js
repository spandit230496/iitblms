const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const borrowHistorySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    borrowedAt: { type: Date },
    returnedAt: { type: Date },
  }, { timestamps: true });


const BorrowHistory = mongoose.model('BorrowHistory', borrowHistorySchema);

module.exports = BorrowHistory ;