// TODO don't overwrite cached files or do it optionally
const Jimp = require('jimp')
const fs = require('fs')
const path = require('path')
const {
  imageSizes,
  getImageCachedSizePath,
  getDimensions
} = require('./utils/image_utils')

const imagesPath = path.resolve('dist', 'images', 'products')

const mkdirSync = function(dirPath) {
  try {
    fs.mkdirSync(dirPath)
  } catch (err) {
    if (err.code !== 'EEXIST') throw err
  }
}

const resizeAndSave = (dimensions, lenna, absolutePath) => {
  return lenna.resize(dimensions[0], dimensions[1]).write(absolutePath)
}
const processAndSaveImages = filePath => {
  Jimp.read(filePath)
    .then(lenna => {
      Object.keys(imageSizes).forEach(size => {
        const cachedImagePath = getImageCachedSizePath(filePath, size)
        const fileExists = fs.existsSync(cachedImagePath)
        if (!fileExists) {
          console.log('resizing', cachedImagePath)
          resizeAndSave(getDimensions(size), lenna, cachedImagePath)
        }
      })
    })
    .catch(err => {
      // eslint-disable-next-line no-console
      console.error(err)
    })
}

const processImages = folderPath => {
  const cachePath = path.resolve(folderPath, 'cache')
  mkdirSync(cachePath)
  fs.readdir(folderPath, (err, files) => {
    files.forEach(value => {
      if (value.endsWith('.jpg'))
        processAndSaveImages(path.resolve(folderPath, value))
    })
  })
}

fs.readdir(imagesPath, (err, files) => {
  files.forEach(file => {
    const productPath = path.resolve(imagesPath, file)
    fs.stat(path.resolve(imagesPath, file), (err, stats) => {
      if (stats.isDirectory()) {
        processImages(productPath)
      }
    })
  })
})
