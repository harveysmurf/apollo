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

export const colorsQuery = gql`
    query getColorsQuery {
        filters @client {
            colors
        }
    }
`