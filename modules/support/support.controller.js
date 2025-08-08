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
      return res.json({ token: token })
    } catch (error) {
      res.status(500).json({
        message: 'Internal server error',
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
