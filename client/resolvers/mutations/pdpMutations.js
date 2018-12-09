const defaultPDP = {
    mainImage: 0
}

module.exports = {
    updateSelectedImage: (obj, { index }, { cache } ) => {
        cache.writeData({
            data: {
                pdp: {
                    mainImage: index
                }
            }
        })
        return null
    },

    resetState: (_, __, { cache }) => {
        cache.writeData({
            data: {
                pdp: defaultPDP
            }
        })
        return null
    }
}