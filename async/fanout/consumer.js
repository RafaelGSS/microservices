const { createConnection } = require('../connection')

createConnection()
  .then(conn => conn.createChannel())
  .then(ch => {
    console.log('Channel created!')

    const exchange = 'logs_fanout'
    ch.assertExchange(exchange, 'fanout', { durable: false })

    // When we supply wueue name as an empty string, we create a non-durable queue
    // with a generated name
    ch.assertQueue('', { exclusive: true })
      .then(q => {
        console.log(' [*] Waiting for messages in %s.', q.queue)
        ch.bindQueue(q.queue, exchange, '')

        ch.consume(q.queue, (msg) => {
          if (msg !== null) {
            console.log(' [x] %s', msg.content.toString())
          }
        }, {
          noAck: true
        })
      })
  })
