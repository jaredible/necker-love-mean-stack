const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
    userName: {
        type: String,
        index: true,
        required: true,
        unique: true,
        maxlength: 50
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        maxlength: 50
    },
    lastName: {
        type: String,
        maxlength: 50
    },
    profileImage: {
        type: String
    },
    interests: {
        type: String,
        maxlength: 2000
    },
    state: {
        type: String,
        maxlength: 52
    }
}, {
    collection: 'profiles'
});

profileSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Profile', profileSchema);