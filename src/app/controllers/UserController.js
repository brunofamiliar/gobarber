import User from '../models/User'
import * as Yup from 'yup'

class UserController {
    async store(req, res){
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password: Yup.string().required().min(6),
            confirmPassword: Yup.string().when('password', (password, field) =>{
                password ? field.required().oneOf([Yup.ref('password')]) : field
            })
        })

        if(!(await schema.isValid(req.body)))
            return res.status(400).json({ error: "Parâmetros inválidos"})
        
        const userExists = await User.findOne({ where: {email : req.body.email }})

        if(userExists){
            return res.status(400).json({error: 'Usuário já cadastro'})
        }

        if(req.body.password == null){
            return res.status(400).json({error: 'Password deve ser informado'})
        }

        const {id, name, email, provider} = await User.create(req.body)

        return res.json({
            id,
            name,
            email,
            provider
        })
    }

    async update(req, res){
        const schema = Yup.object().shape({
            name: Yup.string(),
            email: Yup.string().email(),
            oldPassword: Yup.string().min(6),
            password: Yup.string().min(6).when('oldPassword', (oldPassword, field) => {
                oldPassword ? field.required() : field
            }),
            confirmPassword: Yup.string().when('password', (password, field) =>{
                password ? field.required().oneOf([Yup.ref('password')]) : field
            })
        })

        if(!(await schema.isValid(req.body)))
            return res.status(400).json({ error: "Parâmetros inválidos"})
        

        const { email, oldPassword } = req.body

        const user = await User.findByPk(req.userId)

        if(email != user.email){
            const userExists = await User.findOne({ where: {email}})

            if(userExists){
                return res.status(400).json({error: 'Usuário já cadastro'})
            }
        }

        if(oldPassword && !(await user.checkPassword(oldPassword)))
            return res.status(401).json({ error: "Senha antiga inválida"})

        const {id, name, provider} = await user.update(req.body)

        return res.json({
            id,
            name,
            email,
            provider
        })
    }
}

export default new UserController()