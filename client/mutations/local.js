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

export const updateSelectedImage = gql`
    mutation updateSelectedImage($index: Int) {
        updateSelectedImage(index: $index) @client
    }
`
export const resetState = gql`
    mutation resetState {
        resetState @client
    }
`