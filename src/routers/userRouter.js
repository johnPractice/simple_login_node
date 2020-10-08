const rout = require("express").Router();
const User = require('../db/model/user');

rout.get("/user", (req, res) => {
    res.json("Hi user");
});

rout.post('/user', (req, res) => {
    const info = req.body;
    console.log(info);
    const user = new User(info);
    user.save()
        .then(data => console.log(data))
        .catch(e => console.log(e));
    res.json(info);
});
module.exports = rout;