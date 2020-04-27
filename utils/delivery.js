const deliveryMethods = {
  toAddress: 'toAddress',
  toOffice: 'toOffice'
}
const deliveryPrices = {
  [deliveryMethods.toAddress]: 7.5,
  [deliveryMethods.toOffice]: 5.5
}

const getDeliveryPrice = (cartPrice, deliveryMethod) =>
  cartPrice > 60 ? 0 : deliveryPrices[deliveryMethod]

const getDeliveryMethodString = type =>
  type === 'toAddress' ? 'До Адрес' : 'До офис'

module.exports = {
  deliveryMethods,
  deliveryPrices,
  getDeliveryPrice,
  getDeliveryMethodString
}