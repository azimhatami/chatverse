class SupportController {
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
