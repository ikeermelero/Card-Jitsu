import { Router } from 'express'
import roomController from '../../modules/challenges/challenge.controller.ts'
import { authMiddleware } from '../../middlewares/auth.middleware.ts'

const router = Router()

router.get('/', authMiddleware, roomController.getRoom)

export default router;