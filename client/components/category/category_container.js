import React, {Component} from 'react'
import Sidebar from './sidebar'
import ProductThumb from '../product/product_thumb'
import {graphql, Query } from 'react-apollo';
import gql from 'graphql-tag'
import ProductListContainer from './product_list_container'
import { lastViewed, similarProducts } from '../../../data/fixtures'
import { filtersQuery } from '../../queries/local'
import { categoryQuery } from '../../queries/remote'

const ar = [...lastViewed, ...similarProducts]

let fetchMoreProducts = (filters, cursor, fetchMore) => {
    return fetchMore(
        {
            variables: {
                cursor,
                colors: filters.colors
            },
            updateQuery(previousResult, { fetchMoreResult }) {
                const previousProductFeed = previousResult.getCategory.productFeed
                const newProductFeed = fetchMoreResult.getCategory.productFeed

                const newGetCategoryData = Object.assign({},previousResult.getCategory,{
                    productFeed: Object.assign({},previousResult.getCategory.productFeed,{
                        products: _.unionWith(
                            previousProductFeed.products,
                            newProductFeed.products,
                            _.isEqual
                        ),
                        cursor: newProductFeed.cursor,
                        hasMore: newProductFeed.hasMore
                    }),
                }) 
                const newData = Object.assign({},previousResult, {
                    getCategory: newGetCategoryData
                })
                
                return newData
            }
    })

}

let CategoryContainer = ({slug, url}) =>  (
    <Query query={filtersQuery}>
    {({ data: {filters}}) => {
        return [
        <Query query={categoryQuery} variables={{slug, ...filters }}>
        {
            ({ data: {getCategory}, loading, fetchMore}) => {
                if(loading) {
                    return <div>Loading...</div>
                }
                else {
                    return (
                    <div className="category row">
                        <Sidebar url={url} category={getCategory} filters={filters}/>
                        <div className='col-sm-8'>
                            <h3>{getCategory.name}</h3>
                            <div className="row">
                            {getCategory.productFeed.products.map((p, index) => {
                                return (
                                <div key={index} className="col-sm-3">
                                <ProductThumb 
                                color={filters.colors.length > 0 ? filters.colors[0] : null} 
                                product={p}/>
                                </div>
                                )
                            })}
                            </div>
                            <div className="row">
                            {getCategory.productFeed.hasMore ?
                            <button onClick={(e)=>fetchMoreProducts(filters, getCategory.productFeed.cursor,fetchMore)}>Load more</button> 
                            : ''
                            }
                            </div>
                        </div>
                    </div>
                    )
                }
            }
        }
        </Query>
        ]
    }}
    </Query>
        // const {url, filters, slug} = props
        // return (
        //     <ProductListContainer url={url} slug={slug} filters={filters} testerino={testerino}/>
        // )
) 

// let withFilters = graphql(filtersQuery, {
//     props: ({data}) => {
//     console.log(data)
//     if (data.loading || data.error) return { testerino: {} };
//     return {
//         filters: data.filters
//     }
//     }
// })
export default CategoryContainer

