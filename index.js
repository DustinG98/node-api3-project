// code away!
const express = require('express')

const server = express()

const postRouter = require('./posts/postRouter')
const userRouter = require('./users/userRouter')

server.use(express.json())
server.use(logger)




function logger (req, res, next) {
    console.log(
        `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
            'Origin'
            )}`
            )
            next();
        }
        
        server.get('/', (req, res) => {
            res.send("IT'S WORKING :D")
        })
        
    server.use('/api/post', postRouter)
    server.use('/api/user', userRouter)

server.listen(5000, () => {
    console.log('server is running away!')
})