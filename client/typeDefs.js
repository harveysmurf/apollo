import { gql } from '@apollo/client'

export default gql`
  input PriceInput {
    max: Float
    min: Float
  }
`
