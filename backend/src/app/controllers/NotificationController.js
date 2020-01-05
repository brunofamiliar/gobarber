import Notification from '../schemas/Notification'
import User from '../models/User'

class NotificationController{
    async index(req, res){
        //Verificando se é provedor de serviço

        const isProvider = await User.findOne({
            where: { id: req.userId, provider: true}
        })

        if(!isProvider)
            return res.status(400).json({ error: 'Não foi possivel carregar as notificações'})

        const notifications = await Notification.find({
            user: req.userId
        }).sort({ createdAt: -1 }).limit(20)

        return res.json(notifications)
    }

    async update(req, res){
        const notification = await Notification.findByIdAndUpdate(
            req.params.id,
            { read: true },
            { new: true }
            )

        return res.json(notification)
    }
}

export default new NotificationController()