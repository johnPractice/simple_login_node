const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const constants = require('../../../constants');
// time stamp for modify date :)//
const Schema = mongoose.Schema;
const userSchema = new Schema({
    firstname: {
        type: String,
        require: true,
        minlength: 4,
    },
    lastname: {
        type: String,
        require: true,
        minlength: 4,
    },
    username: {
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
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
}, {
    autoCreate: true,
    autoIndex: true,
    timestamps: true,
});
// modified function//
// create  middelware for check password
// if password modified ==>hashed then store to db and check
///we must use classic function to not bind this
userSchema.pre("save", async function(next) {
    const user = this;
    console.log("this save pre", user);
    if (this.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
        user.re_password = user.password;
    }

    next();
});
// generate auth token
userSchema.methods.genrateAuth = async function() {
    const user = this;
    const token = await jwt.sign({
        _id: user._id.toString()
    }, constants.jwtSecret);

    user.tokens = user.tokens.concat({
        token
    });
    await user.save();
    return token;
};
// toJson
///for retunrning in api json
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.re_password;
    delete userObject.tokens;
    delete userObject.createdAt;
    delete userObject.updatedAt;

    return userObject;
};

// create user model save in mongoose
const User = mongoose.model("User", userSchema);

module.exports = User;