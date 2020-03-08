import gql from 'graphql-tag'

export const categoryQuery = gql`
  query getCategory(
    $slug: String!
    $colors: [String] = []
    $cursor: String
    $materials: [String] = []
    $price: PriceInput
  ) {
    getCategory(slug: $slug) {
      id
      name
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
        cursor
        hasMore
        products {
          model
          images
          name
          price
          available
          main_image
          description
          slug
          colors {
            group
            color
            images
            quantity
          }
          variations {
            name
            images
            model
            description_short
            slug
          }
        }
      }
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
      main_image
      name
      breadcrumbs {
        name
        href
      }
      price
      available
      description_short
      model
      slug
      variations {
        slug
        color
        images
        quantity
        main_image
        model
      }
      availableColors {
        name
        images
        quantity
      }
      similar {
        name
        slug
      }
      images
      color
    }
  }
`

export const getProductsFeedQuery = gql`
  query getProducts(
    $colors: [String] = []
    $cursor: String
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
      cursor
      hasMore
      products {
        model
        images
        name
        price
        available
        main_image
        description
        slug
        variations {
          name
          images
          model
          description_short
          slug
        }
        colors {
          group
          color
          images
          quantity
        }
      }
    }
  }
`
