import Path from 'path'
import FileSystem from 'fs'

class ModelUtils {
    static importModels(connection){
        
        let pathModels = Path.join(__dirname, '..', 'app', 'models')
        
        FileSystem.readdirSync(pathModels).forEach(file => {
            require("../app/models/" + file).init(connection)
        })
    }
}

export default ModelUtils