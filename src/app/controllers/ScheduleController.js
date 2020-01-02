import Appointment from '../models/Appointment'
import User from '../models/User'
import {startOfDay, endOfDay, parseISO} from 'date-fns'
import {Op} from 'sequelize'


class ScheduleController{
    async index(req,res){
        const isUserProvider = await User.findOne({
            where: { id: req.userId, provider: true }
        })

        if(!isUserProvider)
            return res.status(400).json({ error: "Esse usuário não é provedor de serviços"})
        
        const { date } = req.query 
        const parsedDate = parseISO(date)


        const appointments = await Appointment.findAll({
            where: {
                provider_id: req.userId,
                canceled_at: null,
                data : {
                    [Op.between]: [
                        startOfDay(parsedDate),
                        endOfDay(parsedDate)
                    ]
                }
            },
            order: ['data']
        })

        return res.json(appointments)
    }
}

export default new ScheduleController()