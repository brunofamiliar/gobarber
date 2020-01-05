import { Router } from 'express'
import multer from 'multer'
import multerConfig from './config/multer'

import UserController from '../src/app/controllers/UserController'
import SessionController from '../src/app/controllers/SessionController'
import FileController from '../src/app/controllers/FileController'
import ProviderController from '../src/app/controllers/ProviderController'
import AppointmentController from '../src/app/controllers/AppointmentController'
import ScheduleController from './app/controllers/ScheduleController'
import NotificationController from './app/controllers/NotificationController'
import AvaiableController from './app/controllers/AvaiableController'


import AuthMiddleware from '../src/app/middlewares/auth'

const routes = new Router()
const upload = multer(multerConfig)


routes.post('/users', UserController.store)
routes.post('/sessions', SessionController.store)   

routes.use(AuthMiddleware)

routes.put('/users', UserController.update)
routes.put('/notifications/:id', NotificationController.update)

routes.get('/providers', ProviderController.index)   
routes.get('/providers/:providerId/avaiable', AvaiableController.index)   
routes.get('/appointments', AppointmentController.index)
routes.get('/schedule', ScheduleController.index)
routes.get('/notifications', NotificationController.index)

routes.delete('/appointments/:id', AppointmentController.delete)

routes.post('/files', upload.single('file'), FileController.store)
routes.post('/appointments', AppointmentController.store)

export default routes