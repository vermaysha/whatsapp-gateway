import express from 'express'
import bodyParser from 'body-parser'
import router from './router'
import { resolve } from 'path'
import { Server } from 'socket.io'
import Whatsapp from './libraries/Whatsapp'
import QRCode from 'qrcode'
const app = express()
const port = process.env.PORT || 3000

/**
 * Body Parser
 */
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/**
 * Template Engine
 */
app.set('view engine', 'ejs')
app.set('views', resolve(__dirname, 'views'))

/**
 * Router
 */
app.use(router)

/**
 * Express Server
 */
const server = app.listen(port, () => {
  console.log(`Application running under port: ${port}`)
})

/**
 * Socket IO
 */
const io = new Server(server)

// /**
//  * Whatsapp
//  */
Whatsapp.connect(async (qr, status) => {
  console.log('qrcode refreshed')
  if (status != undefined) {
    io.emit('status', status)
  }

  if (qr != undefined) {
    io.emit('qr', await QRCode.toDataURL(qr))
  }
})
