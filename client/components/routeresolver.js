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
const filters = [
    'colors','material', 'price'
]

function parseFilters(params) {
    let result = {}
    filters.map((f) => {
        result[f] = params.get(f) ? params.get(f).split(',') : []
    })
    return result
}

const RouteResolver = (props) => {
    let type = false
    // Parse query params
    const search = props.location.search; // could be '?foo=bar'
    const params = new URLSearchParams(search);
    const filters = parseFilters(params)

    if(props.data.loading)
        return <div>Loading</div>
    else
        type = props.data.getRouteType

    if(!type)
        return <div>Page not found</div>
    else if(type == 'category')
        return <Category filters={filters} slug={props.data.variables.slug} url={props.match.url}/>
    else 
        return <Product slug={props.data.variables.slug}/>
}

export default graphql(query, {
    options:({match:{params:{param:path}}}) => ({
            variables: {
                slug: path.split('/').pop()
            }
    })
})(RouteResolver)