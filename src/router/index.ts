import { Router } from 'express'
import ChatController from '../controllers/ChatController'
import QrCodeController from '../controllers/QrCodeController'

const router = Router({})
router.get('/qrcode', QrCodeController.scan)
router.use('/sendMessage', ChatController.send)

export default router
