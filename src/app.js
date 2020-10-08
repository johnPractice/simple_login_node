const express = require("express");
require("./db/mongoose");
const userRouter = require("./routers/userRouter");
// const taskRouter = require('./routers/task')

const app = express();
app.use(express.json());
app.use(userRouter);
// app.use(taskRouter);

module.exports = app;