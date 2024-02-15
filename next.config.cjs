const dotenv = require('dotenv');

const parsedEnv = dotenv.config().parsed;

module.exports = {
    env: parsedEnv,
    // other configurations...
};
