const rout = require("express").Router();
const multer = require('multer');
// const fileUploader = require('express-fileupload');
const User = require("../db/model/user");
// middelware using 
const auth = require('../middelware/auth');

// multer setup 
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/avatar');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({
    // dest: 'uploads/avatar',
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }

        cb(undefined, true);
    },
    storage: storage
});


//rout 
rout.get("/", (req, res) => {
    res.json("Hi user");
});

rout.post("/", async(req, res) => {
    const info = req.body;
    try {
        const user = new User(info);
        await user.save();
        const token = await user.genrateAuth();
        res.json({
            user,
            token
        });
    } catch (e) {
        res.json(e).status(400);
    }
});
// login user
rout.post('/login', async(req, res) => {
    const {
        password,
        username
    } = req.body;
    if (!password || !username) return new Error('please check your input');
    try {
        const user = await User.findByCredentials({
            username,
            password
        });
        const token = await user.genrateAuth();
        res.json({
            token,
            user
        });

    } catch (e) {
        res.json(e).status(400);
    }
});
// logout user
rout.post('/logout', auth, async(req, res) => {
    try {
        const user = req.user;
        const token = req.token;
        user.tokens = user.tokens.filter(t => {
            return t.token != token;
        });

        await user.save();

        res.json({
            user,
            'logout': true
        });


    } catch (e) {
        res.json(e).status(400);
    }
});
// logout all
rout.post('/logoutall', auth, async(req, res) => {
    try {
        const user = req.user;
        user.tokens = [];
        await user.save();
        res.json(user);

    } catch (e) {
        res.json(e).status(400);
    }
});
// upload avatar image 
rout.post('/upload-avatar', upload.single('avatar'), async(req, res) => {
    try {
        res.send(req.file);
    } catch (err) {
        res.send(400);
    }
});
module.exports = rout;