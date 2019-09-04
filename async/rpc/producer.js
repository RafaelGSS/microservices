const { createConnection } = require('../connection')

const users = [
  {
    id: 10,
    name: 'Crondawl Jhon'
  },
  {
    id: 11,
    name: 'Edward Jhon'
  },
  {
    id: 1,
    name: 'Paul Jhon'
  }
]

createConnection()
  .then(conn => conn.createChannel())
  .then(ch => {
    console.log('Channel created!')

    const queue = 'rpc_queue'

    ch.assertQueue(queue, {
      durable: false
    })
    ch.prefetch(1)

    console.log(' [x] Awaiting RPC requests')

    ch.consume(queue, function reply (msg) {
      const id = parseInt(msg.content.toString())

      console.log(' [*] Received: %s', id)

      const user = users.find(user => user.id === id) || 'Not found'

      ch.sendToQueue(msg.properties.replyTo,
        Buffer.from(user.name.toString()), {
          correlationId: msg.properties.correlationId
        })

      ch.ack(msg)
    })
  })
