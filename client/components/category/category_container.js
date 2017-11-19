import React, {Component} from 'react'
import {graphql } from 'react-apollo';
import gql from 'graphql-tag'

const query = gql`
query getCategoryQuery($slug: String) {
    getCategory(slug: $slug) {
        name,
        products {
            name
        }

    }
}
`

const CategoryContainer = ({data}) => {
    if(data.loading)
        return (<div>Loading</div>)
    else
        return (
        <div className="category">
            <h3>Category</h3>
            {data.getCategory.products.map((product) => {
                return <span>{product.name}</span>
            })}
        </div>
        )
}

export default graphql(query, {
    options:(props) => ({
        variables: {
            slug: props.slug
        }
    })
})(CategoryContainer)

