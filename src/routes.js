import { Router } from 'express'

import UserController from '../src/app/controllers/UserController'
import SessionController from '../src/app/controllers/SessionController'

import AuthMiddleware from '../src/app/middlewares/auth'

const routes = new Router()

routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

routes.use(AuthMiddleware)

routes.put('/users', UserController.update)

export default routes