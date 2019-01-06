import gql from 'graphql-tag'

export const categoryQuery = gql`
query getCategory($slug: String!, $colors: [String] = [], $cursor: String, $material: String, $price: PriceInput) {
    getCategory(slug: $slug) {
        name,
        slug,
        subcategories {
            name,
            slug
        },
        productFeed(cursor: $cursor, colors: $colors, material: $material, price: $price ) @connection(key: "productFeed", filter: ["colors", "materials", "price"]){
            cursor,
            hasMore,
            products {
                name,
                price,
                available,
                main_image,
                description,
                slug,
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

export const userQuery = gql`
    query { 
        loggedInUser 
        { 
            name,
            email
        } 
    }
`
export const cartQuery = gql`
    query {
        cart {
            products {
                product {
                    name
                    price
                }
                color
                quantity
                available
                productColor {
                    images
                    name
                }
            },
            price
            quantity
        }
    }
`
export const getProductQuery = gql`
    query getProduct($model: String!) {
        getProduct(model: $model) {
            name,
            price,
            available,
            description_short,
            model,
            slug,
            colors {
                slug,
                name,
                images,
                quantity,
                main_image
                model
            }
            availableColors {
                name,
                images,
                quantity
            }
            similarProducts {
                name,
                slug
            },
            images,
            color

        }
    }
`