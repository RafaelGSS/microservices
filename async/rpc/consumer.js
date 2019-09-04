const { createConnection } = require('../connection')
const { sample } = require('lodash')
const uuid = require('uuid/v4')

createConnection()
  .then(conn => conn.createChannel())

  .then(async ch => {
    console.log('Channel created!')

    const q = await ch.assertQueue('', { exclusive: true })
    const queue = 'rpc_queue'

    const correlationId = uuid()
    console.log(' [x] Sending message - correlation: %s - replyTo: %s', correlationId, q.queue)

    ch.sendToQueue(queue, Buffer.from(sample(['10', '11', '1'])), {
      replyTo: q.queue, correlationId
    })
    ch.consume(q.queue, function (msg) {
      if (msg !== null && msg.properties.correlationId === correlationId) {
        console.log('[%s] Received: %s', msg.properties.correlationId, msg.content.toString())
      }
    }, { noAck: true })
    
  })
