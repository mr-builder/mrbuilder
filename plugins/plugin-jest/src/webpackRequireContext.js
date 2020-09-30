
module.exports = {
    process(src, filename) {

        // Return original document if don't have reference to require.context.
        if (!/require\.context\([^)]*\)/gm.test(src)) {
            return src
        }

        return `if (typeof require.context === 'undefined') {
        require.context = (base = '.', scanSubDirectories = false, regularExpression) => {
        const fs = require('fs')
        const path = require('path')
        const files = {}
        const relativeTo = path.parse(${JSON.stringify(filename)}).dir;
        function readDirectory (directory) {
            const dirPath = path.resolve(relativeTo,directory);
            fs.readdirSync(dirPath).forEach((file) => {
                const relPath = path.join(directory, file);
                const fullPath = path.resolve(relativeTo, relPath)
                if (fs.statSync(fullPath).isDirectory()) {
                  if (scanSubDirectories){
                    readDirectory(relPath)
                  }
                  return
                }
            
                if (regularExpression && !regularExpression.test(relPath)){ 
                    return
                }
                
                files[base+'/'+relPath] = true
            })
        }
    
        readDirectory(base);
    
        function Module (file) {
            return require(path.resolve(relativeTo, base, file))
        }
    
        Module.keys = Object.keys.bind(Object, files);
    
        return Module
        }
    }
    ${src}`
    }
};
