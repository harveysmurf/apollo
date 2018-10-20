import gql from "graphql-tag";

export const UpdateColors = gql`
    mutation updateColors($colors: [String]) {
        updateColors(colors: $colors) @client
    }
`

export const UpdatePrice = gql`
    mutation updatePrice($price: PriceInput) {
        updatePrice(price: $price) @client
    }
`