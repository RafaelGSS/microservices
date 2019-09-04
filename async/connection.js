const amqp = require('amqplib')

/**
 * Factory function to connection AMQP
 * @param {String} uri
 */
async function createConnection (uri = 'guest:guest@localhost:5672') {
  const connection = await amqp.connect('amqp://' + uri)
  return connection
}

module.exports = {
  createConnection
}
