export const defaultState = {
  features: {
    PDP_SIMILAR_PRODUCTS: false,
    PDP_RECOMMENDED_PRODUCTS: false,
    PDP_LAST_VIEWED: false,
    PDP_VIEW_COUNT: false,
    NEWSLETTER_SUBSCRIBE: false,
    PDP_NOTIFY_AVAILABLE: false,
    LOGIN_ENABLED: false,
    THUMB_CAROUSEL_ENABLED: false,
  },
  filters: {
    search: '',
    materials: [],
    styles: [],
    colors: [],
    price: {
      min: 10,
      max: 140
    },
    lastcolor: null
  },
  pdp: {
    mainImage: 0
  }
}
