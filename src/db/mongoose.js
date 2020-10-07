const mongoose = require('mongoose');
const constants = require('../../constants');
const dbAddress = constants.dbAddLocal;
try {
    mongoose.connect(dbAddress, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    });
} catch (e) {
    console.error(e);
}