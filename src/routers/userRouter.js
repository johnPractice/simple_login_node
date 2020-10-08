const rout = require("express").Router();

const User = require('../db/model/user');

rout.get("/user", (req, res) => {
    res.json("Hi user");
});

rout.post('/user', async(req, res) => {
    const info = req.body;
    console.log('info', info);
    try {
        const user = new User(info);
        await user.save();
        res.json(user);
    } catch (e) {
        res.json(e).status(400);
    }

});
module.exports = rout;