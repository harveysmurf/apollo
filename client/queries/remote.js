import gql from 'graphql-tag'

export const categoryQuery = gql`
query getCategoryQuery($slug: String, $colors: [String] = [], $cursor: String, $material: String) {
    getCategory(slug: $slug) {
        name,
        slug,
        subcategories {
            name,
            slug
        },
        productFeed(cursor: $cursor, colors: $colors, material: $material ) @connection(key: "productFeed", filter: ["colors", "materials"]){
            cursor,
            hasMore,
            products {
                name,
                price,
                available,
                main_img,
                description,
                colors {
                    group,
                    name,
                    images,
                    quantity
                }
            }
        }
    }
}
`