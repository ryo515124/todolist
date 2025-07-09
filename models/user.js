const mongoose = require('mongoose');
const { Schema } = mongoose;
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

userSchema.plugin(passportLocalMongoose,{
    errorMessages: {
        UserExistsError: 'そのユーザー名は既に使用されています'
    }
});

module.exports = mongoose .model('User', userSchema);