import { format, parseISO, parse } from 'date-fns'
import { pt } from 'date-fns/locale/pt-BR'
import Mail from '../../lib/Mail'

class CancellationMail {
    get key(){
        return 'CancellationMail'
    }

    async handle({ data }){
        const { appointment } = data

        await Mail.sendMail({
            to: `${appointment.provider.name} <${appointment.provider.email}>`,
            subject: 'Agendamento cancelado',
            template: 'cancellation',
            context: {
                provider: appointment.provider.name,
                user: appointment.user.name,
                date: format(
                    parseISO(appointment.data),
                    "'dia' dd 'de' MMMM', às' H:mm'h'",
                    { locale: pt }
                    )
            } 
        })
    }
}

export default new CancellationMail()