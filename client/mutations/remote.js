import { gql } from '@apollo/client'

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
    $name: String
    $lastname: String
    $email: String
    $delivery: DeliveryInput
    $comment: String
    $telephone: String
  ) {
    checkout(
      name: $name
      lastname: $lastname
      email: $email
      delivery: $delivery
      comment: $comment
      telephone: $telephone
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

export const Login = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        name
      }
      errors {
        field
        message
      }
    }
  }
`

export const ResetPassword = gql`
  mutation resetPassword($email: String!) {
    resetPassword(email: $email)
  }
`
export const UpdatePassword = gql`
  mutation updatePassword($token: String!, $password: String!) {
    updatePassword(token: $token, password: $password) {
      success
      error
    }
  }
`