const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalmongoose = require("passport-local-mongoose");

const User = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    }
});

User.plugin(passportLocalmongoose, {
    usernameField: 'username',
    usernameUnique: true
});

module.exports = mongoose.model('User', User);
