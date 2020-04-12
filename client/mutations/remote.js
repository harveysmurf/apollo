import gql from 'graphql-tag'

export const ModifyCart = gql`
  mutation modifyCart($model: String, $quantity: Int) {
    modifyCart(model: $model, quantity: $quantity) {
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
      quantity
      price
    }
  }
`
export const AddToCart = gql`
  mutation modifyCart($model: String, $quantity: Int) {
    addToCart(model: $model, quantity: $quantity) {
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
      quantity
      price
    }
  }
`

export const RemoveItemFromCart = gql`
  mutation removeItemFromCart($model: String) {
    removeItemFromCart(model: $model) {
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
      quantity
      price
    }
  }
`

export const Checkout = gql`
  mutation checkout(
    $email: String
    $address: AddressInput
    $telephone: String
    $comment: String
    $delivery: String
  ) {
    checkout(
      email: $email
      address: $address
      telephone: $telephone
      comment: $comment
      delivery: $delivery
    )
  }
`

export const Register = gql`
  mutation register(
    $name: String!
    $lastname: String!
    $email: String!
    $consent: Boolean!
    $password: String!
  ) {
    register(
      name: $name
      lastname: $lastname
      email: $email
      consent: $consent
      password: $password
    ) {
      name
      email
    }
  }
`

export const Logout = gql`
  mutation logout {
    logout
  }
`
