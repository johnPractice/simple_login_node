const rout = require("express").Router();

const User = require("../db/model/user");
// middelware using 
const auth = require('../middelware/auth');

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
module.exports = rout;