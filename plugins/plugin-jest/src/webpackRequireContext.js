module.exports = {
    process(src, filename) {

        // Return original document if don't have reference to require.context.
        if (!/require\.context\([^)]*\)/gm.test(src)) {
            return src
        }

        return `if (typeof require.context === 'undefined') {
        const fs = require('fs')
        const path = require('path')
        require.context = (base = '.', scanSubDirectories = false, regularExpression = /\.js$/) => {
        const files = {}
    
        function readDirectory (directory) {
            fs.readdirSync(directory).forEach((file) => {
            const fullPath = path.resolve(directory, file)
    
            if (fs.statSync(fullPath).isDirectory()) {
              if (scanSubDirectories) readDirectory(fullPath)
              return
            }
    
            if (!regularExpression.test(fullPath)) return
              files[\`./\${file}\`] = true
            })
        }
    
        readDirectory(path.resolve(__dirname, base))
    
        function Module (file) {
            return require(path.resolve(__dirname, base, file))
        }
    
        Module.keys = () => Object.keys(files)
    
        return Module
        }
    }
    ${src}`
    }
};