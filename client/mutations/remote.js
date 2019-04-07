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
    $name: String
    $lastname: String
    $email: String
    $address: String
    $city: String
    $telephone: String
    $comment: String
    $consent: String
    $delivery: String
  ) {
    checkout(
      name: $name
      lastname: $lastname
      email: $email
      address: $address
      city: $city
      telephone: $telephone
      comment: $comment
      consent: $consent
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
    $register: String!
  ) {
    register(
      name: $name
      lastname: $lastname
      email: $email
      consent: $consent
      register: $register
    )
  }
`
