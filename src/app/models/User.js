import Sequelize, { Model } from 'sequelize'
import BCrypt from 'bcryptjs'

class User extends Model{
    static init(sequelize){
        super.init({
         name: Sequelize.STRING,
         email: Sequelize.STRING,
         password: Sequelize.VIRTUAL,
         password_hash: Sequelize.STRING,
         provider: Sequelize.BOOLEAN   
        },{
            sequelize
        })

        this.addHook('beforeSave', async (user)=>{
            if(user.password){
                user.password_hash = await BCrypt.hash(user.password, 8)
            }
        })

        return this
    }

    checkPassword(password){
        return BCrypt.compare(password, this.password_hash)
    }
}

module.exports = User