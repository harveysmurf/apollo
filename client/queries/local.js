import gql from 'graphql-tag'

export const filtersQuery = gql`
query getFiltersQuery{
    filters @client {
        material,
        colors,
        styles,
        price {
            min,
            max
        }
    }
}
`