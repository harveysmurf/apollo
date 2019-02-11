import gql from 'graphql-tag';

export const ModifyCart = gql`
    mutation modifyCart($model: String, $quantity: Int) {
        modifyCart(model: $model, quantity: $quantity) {
            products {
                product {
                    name
                    price
                    color
                    images
                    available
                    quantity
                    model
                }
                quantity
                price
            }
            price
            quantity
        }
    }
`;
