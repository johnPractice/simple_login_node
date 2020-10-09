const rout = require("express").Router();
const multer = require('multer');
const sharp = require('sharp');
const multerTest = require('multer');
const path = require('path');
const fs = require("fs");
const constants = require('../../constants');

// const fileUploader = require('express-fileupload');
const User = require("../db/model/user");
// middelware using 
const auth = require('../middelware/auth');
const { findOne } = require("../db/model/user");

// multer setup 
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads/avatar');
//     },
//     // filename: function(req, file, cb) {
//     //     cb(null, file.originalname);
//     // }
// });
// const upload = multer({
//     // dest: 'uploads/avatar',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
//             return cb(new Error('Please upload an image'));
//         }

//         cb(undefined, true);
//     },
//     storage: storage
// });
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('Please upload an image'));
        }

        cb(undefined, true);
    }
});


// test
const storage = multerTest.diskStorage({
    destination: async function(req, file, cb) {
        if (!fs.existsSync('public/')) {
            fs.mkdirSync('public/');
            if (!fs.existsSync('public/uploads'))
                fs.mkdirSync('public/uploads/');
        }
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const uploadTest = multer({
    // dest: 'uploads/test',
    // limits: {
    //     fileSize: 1000000
    // },
    // fileFilter(req, file, cb) {
    //     if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
    //         return cb(new Error('Please upload an image'));
    //     }

    //     cb(undefined, true);
    // },
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
rout.post('/upload-avatar', auth, upload.single('avatar'), async(req, res) => {

    try {
        const user = req.user;
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
        user.avatar = buffer;
        await user.save();
        res.json({ image: req.file, user });

    } catch (err) {
        res.send(err).status(400);
    }
});
rout.get('/avatar', auth, async(req, res) => {
    try {
        const user = await req.user;
        console.log('in get avatar', user);
        // res.json(user);
        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});


// test
rout.post('/test', auth, uploadTest.single('test'), async(req, res) => {
    try {
        const file = req.file;
        const user = req.user;
        let { path } = file;
        path = path.replace('public', "");
        path = path.replace("\\", "/");
        path = constants.usrAddLocal + path;
        user.test = path;
        await user.save();
        res.json({ file, user });
    } catch (e) { res.json(e).status(400); }

});

rout.get('/test', async(req, res) => {
    try {
        const { username } = req.body;
        if (!username) return new Error('check your input');
        const user = await User.findOne({ username });
        if (!user) return new Error('user not found');
        res.json(user.test);
    } catch (e) { res.json(e).status(400); }

});

module.exports = rout;