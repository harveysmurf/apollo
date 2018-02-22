import React, {Component} from 'react'
import Sidebar from './sidebar'
import ProductThumb from '../product/product_thumb'
import {graphql } from 'react-apollo';
import gql from 'graphql-tag'
import ProductListContainer from './product_list_container'

import { lastViewed, similarProducts } from '../../../data/fixtures'
const ar = [...lastViewed, ...similarProducts]

const filtersQuery = gql`
query getFiltersQuery{
    filters @client {
        material
    }
}
`

let CategoryContainer = (props) =>  {
        const {url, filters, testerino, slug} = props
        return (
            <ProductListContainer url={url} slug={slug} filters={{...filters,...testerino}} testerino={testerino}/>
        )
} 

let withFilters = graphql(filtersQuery, {
    props: ({data}) => {
    if (data.loading || data.error) return { testerino: {} };
    return {
        testerino: data.filters
    }
    }
})
export default withFilters(CategoryContainer)

