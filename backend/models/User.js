const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type: String,
        required: true 
    },
    email:{
        type: String,
        required: true,
        unique: true 
    },
    password:{
        type: String,
        required: true 
    },
    date:{
        type: Date,
        default: Date.now 
    },

  });


const User = mongoose.model('user', UserSchema); // (model name, Schema name)
// User.createIndexes(); // this ensures that there are no duplicate entries, however this creates an extra index 'email' which is not desired
// rather to enforce that duplicate email isi not created, we will write the logic in auth.js
module.exports = User;