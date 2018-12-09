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
            },
            lastcolor
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

export const mainImageQuery = gql`
    query getMainImageQuery {
        pdp {
            mainImage
        }
    }
`