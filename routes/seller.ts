import { Router } from 'express'
import sellerController from '../controllers/user.js'

const sellerRouter = Router()

sellerRouter.get('/', sellerController.getAllUsers)
sellerRouter.post('/', sellerController.createUser)
sellerRouter.get('/:id', sellerController.getUserById)
sellerRouter.delete('/:id', sellerController.deleteUserById)
sellerRouter.put('/:id', sellerController.updateUserById)

export default sellerRouter
