import gql from 'graphql-tag'

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
          available
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
            images
            model
            description_short
            slug
            discount
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
      images
      color
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
        available
        main_image
        description
        slug
        discount
        sellPrice
        variations {
          name
          images
          model
          description_short
          slug
          discount
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
