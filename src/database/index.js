import Sequelize from 'sequelize'
import Mongoose from 'mongoose'

import databaseConfig from '../config/database'
import ModelUtils from '../utils/modelutil'

class Database{
    constructor(){ 
        this.init() 
        this.mongo() 
    }
    init(){
        this.connection = new Sequelize(databaseConfig)      
        ModelUtils.importModels(this.connection)
    }
    
    mongo(){
        this.mongoConnection = Mongoose.connect(
            'mongodb://localhost:27017/gobarber',
            { useNewUrlParser: true, useFindAndModify: true, useUnifiedTopology: true }
        )
    }
}

export default new Database()