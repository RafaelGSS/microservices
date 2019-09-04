const { createConnection } = require('../connection')

createConnection()
  .then(conn => conn.createChannel())
  .then(ch => {
    console.log('Channel created!')

    const queue = 'messages'
    ch.assertQueue(queue)
    setInterval(() => {
      console.log('-> Sending message')
      ch.sendToQueue(queue, Buffer.from('Message of example'))
    }, 1000)
  })
