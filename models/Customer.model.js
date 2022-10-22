const mongoose = require('mongoose');
const { Schema, model } = mongoose;


const customerSchema = new Schema({
    firstName: String,
    lastName: String,
    email: String,
    address: String,
    apartmentNumber: String,
    city: String,
    state: String,
    zip: Number,
    purchases: {type: [
        {
            type: Schema.Types.ObjectId, 
            ref: 'Purchase'
        }
      ]
    }
}, { 
    timestamps: true
})

const Customer = model('Customer', customerSchema);
module.exports = Customer;