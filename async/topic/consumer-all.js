const { createConnection } = require('../connection')

createConnection()
  .then(conn => conn.createChannel())
  .then(ch => {
    console.log('Channel created!')

    const exchange = 'logs'
    ch.assertExchange(exchange, 'topic', { durable: false })

    // When we supply wueue name as an empty string, we create a non-durable queue
    // with a generated name
    ch.assertQueue('', { exclusive: true })
      .then(q => {
        console.log(' [*] Waiting for messages in %s.', q.queue)
        // Binding routing key: ALL
        const routingKey = '#'
        ch.bindQueue(q.queue, exchange, routingKey)
        console.log(' [x] Binded %s', routingKey)

        ch.consume(q.queue, (msg) => {
          if (msg !== null) {
            console.log('%s [x] %s [%s]', Date.now(), msg.content.toString(), msg.fields.routingKey)
          }
        }, {
          noAck: true
        })
      })
  })
