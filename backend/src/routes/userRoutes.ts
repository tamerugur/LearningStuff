import express from 'express'
import { checkUnique, registerUser } from '../controllers/userController'

const router = express.Router()

router.post('/register', registerUser)
router.post('/check-unique', checkUnique)

export default router
