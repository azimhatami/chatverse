const config = require('./configs/config');
const CreateApplication = require('./index');

const PORT = config.PORT;
const MODE = config.MODE;

new CreateApplication(PORT, MODE);
