import Sequelize from 'sequelize'

import databaseConfig from '../config/database'
import ModelUtils from '../utils/modelutil'

class Database{
    constructor(){ this.init() }
    init(){
        this.connection = new Sequelize(databaseConfig)      
        ModelUtils.importModels(this.connection)
    }
    
}

export default new Database()