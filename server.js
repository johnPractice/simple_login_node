const app = require('./src/app');
const constants = require('./constants');
const port = constants.portLocal;

app.listen(port, () => {
    console.clear();
    console.log('Server is up on port ' + port);

});