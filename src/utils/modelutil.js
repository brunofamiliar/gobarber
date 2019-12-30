import Path from 'path'
import FileSystem from 'fs'

class ModelUtils {
    static importModels(connection){
        
        let pathModels = Path.join(__dirname, '..', 'app', 'models')
        
        FileSystem.readdirSync(pathModels).forEach(file => {
            let model = require("../app/models/" + file)
            model.init(connection)
            
            if(model.associate)
                model.associate(connection.models)
        })
    }
}

export default ModelUtils