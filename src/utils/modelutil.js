import Path from 'path'
import FileSystem from 'fs'

class ModelUtils {
    static importModels(connection){
        
        const models = []
        const modelsError = []

        let pathModels = Path.join(__dirname, '..', 'app', 'models')

        FileSystem.readdirSync(pathModels).forEach(file => {
            let model = require("../app/models/" + file)
            models.push(model)
        })

        models.forEach(model => {
            model.init(connection)

            try{
                if(model.associate)
                  model.associate(connection.models)
            }catch(err){
                modelsError.push(model)
            }

            modelsError.forEach((model, index) => {
                try{
                    model.associate(connection.models)
                    modelsError.splice(index,1)
                }catch(err){}
            })
        })
    }
}

export default ModelUtils