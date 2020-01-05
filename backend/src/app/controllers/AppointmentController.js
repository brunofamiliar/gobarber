import User from '../models/User'
import Appointment from '../models/Appointment'
import File from '../models/File'
import Notification from '../schemas/Notification'

import CancellationMail from '../jobs/CancellationMail'
import Queue from '../../lib/Queue'
import pt from 'date-fns/locale/pt-BR'
import {startOfHour, parseISO, isBefore, format, subHours} from 'date-fns'
import * as Yup from 'yup'


class AppointmentController {
    async index(req, res){
        const { page = 1 } = req.query

        const appointments = await Appointment.findAll({
            where:{user_id: req.userId, canceled_at: null},
            attributes: ['id', 'data', 'past', 'cancelable'],
            order: ['data'],
            limit: 20,
            offset: (page -1) * 20,
            include: {
                model: User,
                as: 'provider',
                attributes: ['id', 'name'],
                include: {
                    model: File,
                    as: 'avatar',
                    attributes: ['id', 'path', 'url']
                }
            }
        })
        return res.json(appointments)
    }
    
    async store(req, res){
        const schema = Yup.object().shape({
            provider_id: Yup.number().required(),
            date: Yup.date().required()
        })

        if(!(await schema.isValid(req.body)))
            return res.status(400).json({ error: 'Valição falhou.'})
        
        const {provider_id, date} = req.body

        //Verificando se é provedor de serviço

        const isProvider = await User.findOne({
            where: { id: provider_id, provider: true}
        })

        if(!isProvider)
            return res.status(400).json({ error: 'Você não pode fazer esse tipo de agendamento'})
        
        //Verificar se horario já passou
        
        const hourStart = startOfHour(parseISO(date))

        if(isBefore(hourStart, new Date()))
            return res.status(400).json({ error: "Não é permitido agendar horários que já passou"})

        console.log(hourStart)
        console.log(new Date())
        //Verificar se horario está disponivel
        const verifyAvailability = await Appointment.findOne({
            where: {  
                provider_id,
                canceled_at: null,
                data: hourStart
            }
        })

        if(verifyAvailability)
            return res.status(400).json({ error: "Esse horário não está disponível"})

        if(provider_id == req.userId)
            return res.status(400).json({ error: "Você não pode fazer esse tipo de agendamento"})

        const appointment = await Appointment.create({
            user_id: req.userId,
            provider_id,
            data: hourStart
        })

        //Notificar prestador de serviço
        const user = await User.findByPk(req.userId)
        const formattedDate = format(
            hourStart,
            "'dia' dd 'de' MMMM', às' H:mm'h'",
            { locale: pt }
            )

        await Notification.create({
            content: `Novo agendamento de ${user.name} para ${formattedDate}`,
            user: provider_id
        })

        return res.json(appointment)
    }

    async delete(req, res){
        const appointment = await Appointment.findByPk(req.params.id, {
            include: [{
                model: User,
                as: 'provider',
                attributes: ['name', 'email'],
            },{
                model: User,
                as: 'user',
                attributes: ['name']
            }]
        })

        if(appointment.user_id != req.userId)
            return res.status(401).json({ error: 'Você não ter permissão para cancelar esse agendamento' })

        const dateWithSub = subHours(appointment.data, 2)

        if(isBefore(dateWithSub, new Date()))
            return res.status(401).json({ error: 'Você pode cancelar um agendamento somente com 2 horas de antecedência' })

        appointment.canceled_at = new Date()

        await appointment.save()

        await Queue.add(CancellationMail.key, {
            appointment
        })

        return res.json(appointment)
    }
}

export default new AppointmentController() 