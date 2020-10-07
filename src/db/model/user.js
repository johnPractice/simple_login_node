const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;
const User = new Schema({
    name: {
        type: String,
        require: true,
        minlength: 4,
    },
    id_name: {
        type: String,
        require: true,
        minlength: 4,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                return new Error("check email");
            }
        },
    },
    password: {
        type: String,
        require: true,
        minlength: 6,
    },
    re_password: {
        type: String,
        minlength: 6,
    },
    birthday: {
        type: Date,
    },
    age: {
        type: Number,
        default: 0,
    },
});

module.exports = User;