import React, {Component} from 'react'
import {graphql } from 'react-apollo';
import gql from 'graphql-tag'

const query = gql`
query getCategoryQuery($slug: String) {
    getCategory(slug: $slug) {
        name
    }
}
`

const CategoryContainer = (props) => {
    return (
    <div className="category">
        <h3>Category</h3>
    </div>
    )
}

export default graphql(query, {
    options:({location}) => ({
        variables: {
            slug: location.pathname.substr(1)
        }
    })
})(CategoryContainer)

