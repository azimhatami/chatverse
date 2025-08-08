const User = require('../support/user.model.js');


async function checkLogin(req, res, next) {
  try {
    const token = req.signedCookies['access_token'];
    if (token) {
      const user = await User.findOne({token}); 
      if (user) {
        req.user = user;
        return next();
      }
    }

    return res.render('login.ejs', {
      error: 'Unauthorized'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}

async function checkAccessLogin(req, res, next) {
  try {
    const token = req.signedCookies['access_token'];
    if (token) {
      const user = await User.findOne({token}); 
      if (user) {
        req.user = user;
        return res.redirect('/support');
      }
    }

    return next();
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error',
    });
  }
}

module.exports = {
  checkLogin,
  checkAccessLogin,
};
