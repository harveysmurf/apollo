import { gql } from '@apollo/client'

export const filtersQuery = gql`
  query getFiltersQuery {
    filters @client {
      search
      materials
      colors
      styles
      price {
        min
        max
      }
      lastcolor
    }
  }
`

export const mainImageQuery = gql`
  query getMainImageQuery {
    pdp @client {
      mainImage
    }
  }
`

export const featuresQuery = gql`
  query getFeatures {
    features @client {
      PDP_SIMILAR_PRODUCTS
      PDP_RECOMMENDED_PRODUCTS
      PDP_LAST_VIEWED
      PDP_VIEW_COUNT
      NEWSLETTER_SUBSCRIBE
      PDP_NOTIFY_AVAILABLE
      LOGIN_ENABLED
      THUMB_CAROUSEL_ENABLED
    }
  }
`
export const screenSizeQuery = gql`
  query getScreenSizeQuery {
    screenSize @client
  }
`
