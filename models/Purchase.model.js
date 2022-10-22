const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const purchaseSchema = new Schema({
    invoiceId: String,
    invoiceDate: Date,
    paymentMethod: {
        type: String, 
        enum: ['Credit or debit card', 'Gift card', 'Cash', 'Mobile wallet'],
        default: 'Credit or debit card',
      },
    customers: {
        type: Schema.Types.ObjectId, 
        ref: 'Customer'
    },
    books: {
        type: Schema.Types.ObjectId, 
        ref: 'Book'
    },
    movies: {
        type: Schema.Types.ObjectId, 
        ref: 'Movie'
    },
    purchaseTotal: String
}, { 
    timestamps: true
})

const Purchase = model('Purchase', purchaseSchema);
module.exports = Purchase;