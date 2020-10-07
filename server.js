const express = require("express");
const port = process.env.PORT || 5000;

const app = express();

app.listen(port, () => {
    console.clear();
    console.log(`server runnig at port ${port}`);
});