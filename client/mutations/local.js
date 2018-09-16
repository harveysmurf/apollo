import gql from "graphql-tag";

export const UpdateFilters = gql`
    mutation updateFilters($filters: FilterInput) {
        updateFilters(filters: $filters) @client
    }
`