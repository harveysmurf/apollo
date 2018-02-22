import React, {Component} from 'react'
import Sidebar from './sidebar'
import ProductThumb from '../product/product_thumb'
import {graphql } from 'react-apollo';
import gql from 'graphql-tag'

import { lastViewed, similarProducts } from '../../../data/fixtures'
const ar = [...lastViewed, ...similarProducts]

const query = gql`
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

class ProductListContainer extends Component {
    render() {
        const { data, url, filters, loadMoreProducts } = this.props

        if(data.loading)
            return (<div>Loading</div>)
        else {
            return (
            <div className="category row">

                <Sidebar url={url} category={data.getCategory} filters={filters}/>
                <div className='col-sm-8'>
                    <h3>{data.getCategory.name}</h3>
                    <div className="row">
                    {data.getCategory.productFeed.products.map((p, index) => {
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
                    {data.getCategory.productFeed.hasMore ?
                    <button onClick={(e)=>loadMoreProducts(filters)}>Load more</button> 
                    : ''
                    }
                    </div>
                </div>
            </div>
            )
        }
    }
} 

export default graphql(query, {
    options:(props) => {
        return {
            variables: {
                slug: props.slug,
                colors: props.filters.colors,
                materials: props.filters.materials
            }
        }
    },
    props: (props) => {
        return {
            data: props.data,
            loadMoreProducts: (filters) => {
                return props.data.fetchMore(
                    {
                        variables: {
                            cursor: props.data.getCategory.productFeed.cursor,
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
        }
    }
})(ProductListContainer)

