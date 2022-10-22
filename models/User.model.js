const { Schema, model } = require("mongoose");

const userSchema = new Schema({
    firstName: {
      type: String, 
      required: true
    },
    lastName: {
      type: String,  
      required: true
    },
    email: {
      type: String, 
      required: true
    },
    password: {
      type: String, 
      required: true
    },
    role: {
      type: String, 
      enum: ['ADMIN', 'STAFF'],
    },
    storeType: {
      type: String, 
      enum: ['ONLINE STORE', 'PHYSICAL STORE', 'ONLINE AND PHYSICAL STORE'],
    },
    address: String,
    unitNumber: String, 
    city: String,
    state: String,     
    zip: Number,
},
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

module.exports = User;