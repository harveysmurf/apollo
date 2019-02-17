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

export const Checkout = gql`
  mutation checkout(
    $name: String
    $lastname: String
    $email: String
    $city: String
    $comment: String
    $consent: String
    $delivery: String
  ) {
    checkout(
      name: $name
      lastname: $lastname
      email: $email
      city: $city
      comment: $comment
      consent: $consent
      delivery: $delivery
    )
  }
`
