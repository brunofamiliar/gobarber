import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'

import UserController from '../src/app/controllers/UserController'
import SessionController from '../src/app/controllers/SessionController'
import FileController from '../src/app/controllers/FileController'

import AuthMiddleware from '../src/app/middlewares/auth'

const routes = new Router()
const upload = multer(multerConfig)


routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)

routes.use(AuthMiddleware)

routes.put('/users', UserController.update)

routes.post('/files', upload.single('file'), FileController.store)

export default routes