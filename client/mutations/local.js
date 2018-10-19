import gql from "graphql-tag";

export const UpdateFilters = gql`
    mutation updateFilters($filters: FilterInput) {
        updateFilters(filters: $filters) @client
    }
`

export const UpdateColors = gql`
    mutation updateColors($colors: [String]) {
        updateColors(colors: $colors) @client
    }
`