const jwt = require('jsonwebtoken');
const User = require('../modules/support/user.model.js');
const config = require('../configs/config');

function signAccessToken(userId) {
  return new Promise(async (resolve, reject) => {
    const user = await User.findById(userId)
    const payload = {
      mobile: user.mobile
    };
    const options = {
      expiresIn:'1d'
    };
    jwt.sign(payload, config.ACCESS_TOKEN_SECRET_KEY, options, (err, token) => {
      if (err) reject(new Error('Internal Server Error'));
      resolve(token);
    })
  })
}

module.exports = {
  signAccessToken,
}
