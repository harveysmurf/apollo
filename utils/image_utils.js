const path = require('path')
// width, height
const imageSizes = {
    xl: [1200, 1200],
    l: [600, 600],
    m: [300, 300],
    s: [150, 150],
    xs: [50, 50]
}
const getDimensions = size => imageSizes[size]

const getImageCachedSizePath = (filePath, size) => {
    const fileNameWithoutExtension = path.basename(filePath, path.extname(filePath))
    const dirName = path.dirname(filePath)
    const dimensions = getDimensions(size)
    return `${path.resolve(dirName, 'cache',fileNameWithoutExtension)}-${dimensions.join('x')}.jpg`
}

module.exports = {
    imageSizes,
    getDimensions,
    getImageCachedSizePath
}

