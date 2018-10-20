import gql from 'graphql-tag'

export default gql`
    input PriceInput {
        max: Float
        min: Float
    }
`
