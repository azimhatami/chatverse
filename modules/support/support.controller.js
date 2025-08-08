const User = require('./user.model.js');
const { signAccessToken } = require('../../utils/functions');

class SupportController {
  loginForm(req, res, next) {
    try {
      return res.render('login.ejs', {
        error: undefined
      });
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  }

  async login(req, res, next) {
    try {
      const { mobile } = req.body;
      const user = await User.findOne({mobile});
      if (!user) return res.render('login.ejs', {
        error: 'Username incorrect'
      })
      const token = await signAccessToken(user._id);
      user.token = token;
      user.save();
      res.cookie(
        'access_token', 
        token, 
        {
          signed: true, 
          httpOnly: true, 
          expires: new Date(Date.now() + 1000 * 60 * 60 * 1)
        }
      );
      return res.redirect('/support')
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  renderChatRoom(req, res, next) {
    try {
      res.render('chat.ejs')
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
      });
    }
  }
}

module.exports = new SupportController();
