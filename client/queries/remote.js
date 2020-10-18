import { gql } from '@apollo/client'

export const categoryQuery = gql`
  query getCategory(
    $slug: String!
    $colors: [String] = []
    $cursor: CursorInput
    $materials: [String] = []
    $price: PriceInput
  ) {
    getCategory(slug: $slug) {
      id
      name
      meta_title
      meta_description
      description
      slug
      subcategories {
        name
        slug
      }
      breadcrumbs {
        name
        href
      }
      productFeed(
        cursor: $cursor
        colors: $colors
        materials: $materials
        price: $price
      ) {
        cursor {
          model
          createdAt
        }
        hasMore
        products {
          model
          images
          discount
          sellPrice
          name
          price
          quantity
          main_image
          description
          slug
          colors {
            group
            color
            images
            quantity
            discount
          }
          variations {
            name
            sellPrice
            price
            images
            model
            description_short
            slug
            discount
            quantity
          }
        }
      }
    }
  }
`

export const getCities = gql`
  query($search: String, $withOffices: Boolean) {
    getCities(search: $search, withOffices: $withOffices) {
      id
      name
      region
      presentation
      offices {
        id
        presentation
        name
      }
    }
  }
`

export const getOffices = gql`
  query getOffices($cityId: Int!, $search: String) {
    getOffices(cityId: $cityId, search: $search) {
      id
      name
      cityId
      address
      presentation
    }
  }
`

export const userQuery = gql`
  query {
    loggedInUser {
      name
      lastname
      email
    }
  }
`
export const cartQuery = gql`
  query {
    cart {
      products {
        product {
          name
          sellPrice
          price
          color
          images
          available
          quantity
          model
          slug
        }
        quantity
        price
      }
      price
      quantity
    }
  }
`
export const getProductQuery = gql`
  query getProduct($model: String!, $referer: String) {
    getProduct(model: $model, referer: $referer) {
      images
      color
      main_image
      name
      dimensions
      material
      style
      quantity
      breadcrumbs {
        name
        href
      }
      price
      description_short
      meta_title
      meta_description
      model
      slug
      discount
      sellPrice
      variations {
        slug
        color
        images
        quantity
        main_image
        model
        discount
      }
      availableColors {
        name
        images
        quantity
        discount
      }
      similar {
        name
        slug
        discount
      }
    }
  }
`

export const getProductsFeedQuery = gql`
  query getProducts(
    $colors: [String] = []
    $cursor: CursorInput
    $material: String
    $price: PriceInput
    $search: String
    $limit: Int
  ) {
    getProducts(
      cursor: $cursor
      colors: $colors
      material: $material
      price: $price
      search: $search
      limit: $limit
    )
      @connection(
        key: "productFeedSearch"
        filter: ["colors", "material", "price", "search"]
      ) {
      cursor {
        model
        createdAt
      }
      hasMore
      products {
        model
        images
        name
        price
        sellPrice
        available
        main_image
        description
        slug
        discount
        sellPrice
        variations {
          sellPrice
          name
          images
          model
          description_short
          slug
          discount
          price
        }
        colors {
          group
          color
          images
          quantity
          discount
        }
      }
    }
  }
`
