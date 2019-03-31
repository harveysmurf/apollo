import gql from 'graphql-tag'

export const categoryQuery = gql`
  query getCategory(
    $slug: String!
    $colors: [String] = []
    $cursor: String
    $material: String
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
        material: $material
        price: $price
      )
        @connection(
          key: "productFeed"
          filter: ["cursor", "colors", "materials", "price"]
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
        }
      }
    }
  }
`

export const userQuery = gql`
  query {
    loggedInUser {
      name
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
  ) {
    getProducts(
      cursor: $cursor
      colors: $colors
      material: $material
      price: $price
      search: $search
    )
      @connection(
        key: "productFeedSearch"
        filter: ["cursor", "colors", "material", "price", "search"]
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
      }
    }
  }
`
