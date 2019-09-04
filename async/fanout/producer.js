const { createConnection } = require('../connection')

createConnection()
  .then(conn => conn.createChannel())
  .then(ch => {
    console.log('Channel created!')

    const exchange = 'logs_fanout'
    ch.assertExchange(exchange, 'fanout', { durable: false })

    setInterval(() => {
      console.log(' [x] %s - Sending message', new Date())
      // The empty string as second parameter means
      // that we don't want to send the message to any specific queue.
      // We want only to publish it to our 'logs' exchange.
      ch.publish(exchange, '', Buffer.from('Hello World!'))
    }, 1000)
  })
