import React, {Component} from 'react'
import {graphql } from 'react-apollo';
import gql from 'graphql-tag'
import Category from './category/category_container'
import Product from './product/product_container'

const query = gql`
query getRouteType($slug: String) {
    getRouteType(slug: $slug)
}
`

const RouteResolver = (props) => {
    let type = false
    let slug = props.match.params.param.split('/').pop()
    if(props.data != 'loading')
        type = props.data.getRouteType
    else
        return <div>Loading</div>

    if(!type)
        return <div>Page not found</div>
    else if(type == 'category')
        return <Category slug={slug}/>
    else 
        return <Product slug={slug}/>




    return <div>Middleware test</div>
}

export default graphql(query, {
    options:({match:{params:{param:path}}}) => {
        return ({
            variables: {
                slug: path.split('/').pop()
            }
        })
    }
})(RouteResolver)