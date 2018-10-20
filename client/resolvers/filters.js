module.exports = {
    updateColors: (obj, { colors }, { cache } ) => {
        cache.writeData({
            data: {
            filters: {
                colors
            }
            }
        })
        return null
    },
    updatePrice: (obj, { price }, { cache } ) => {

        cache.writeData({
            data: {
                filters: {
                    price
                }
            }
        })
        return null
    }
}