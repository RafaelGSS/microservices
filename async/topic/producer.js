const { createConnection } = require('../connection')
const { sample } = require('lodash')

createConnection()
  .then(conn => conn.createChannel())
  .then(ch => {
    console.log('Channel created!')

    const exchange = 'logs'

    ch.assertExchange(exchange, 'topic', { durable: false })

    setInterval(() => {
      const key = sample([
        'log.critical',
        'log.warning',
      ])
      console.log(' [x] Sending message [%s]', key)
      ch.publish(exchange, key, Buffer.from('Hello World!'))
    }, 1000)
  })
