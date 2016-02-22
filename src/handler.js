import io from './server'
import _ from 'lodash'
import redis from 'redis'

const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1'
const REDIS_PORT = process.env.REDIS_PORT || 6379
const REDIS_PASS = process.env.REDIS_PASS || ''
const redisClient = redis.createClient(REDIS_PORT, REDIS_HOST, { auth_pass: REDIS_PASS })

redisClient.subscribe('create_msg')
redisClient.on('message', (channel, rawParams) => {
  const params = JSON.parse(rawParams)
  console.log(params.broadcast_id)
  io.to(params.broadcast_id).emit("create_mes", params)
})

export default function handler (socket) {
  console.log('a user connected')
  socket.userId = null

  socket.on('start distribution', (broadcast_id) => {
    console.log('the user start distribute #' + broadcast_id)
    socket.join(broadcast_id)

    const broadcast = function(data) {
      io.to(broadcast_id).emit('stream', data)
    }
    socket.on('stream', broadcast)

    socket.once('stop distribution', (broadcast_id) => {
      console.log('the user stop distribute #' + broadcast_id)
      socket.removeListener('stream', broadcast)
      socket.leave(broadcast_id)
    })
  })

  socket.on('start listening', (broadcast_id) => {
    console.log('the user start listen #' + broadcast_id)
    socket.join(broadcast_id)

    socket.once('stop listening', (id) => {
      console.log('the user stop listen #' + broadcast_id)
      socket.leave(broadcast_id)
    })
  })

  socket.on('disconnect', () => {
    socket.removeAllListeners()
  })
}
