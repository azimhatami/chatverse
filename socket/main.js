const NamespaceHandler = require('./namespace');


module.exports = {
  socketHandler : (io) => {
    new NamespaceHandler(io).initConnection(),
    new NamespaceHandler(io).createNamespacesConnection()
  }
}
