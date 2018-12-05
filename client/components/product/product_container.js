import React, {Component} from 'react'
import {graphql } from 'react-apollo';
import gql from 'graphql-tag'
import { withRouter } from "react-router-dom";
import { compose } from 'recompose'
import { Link} from 'react-router-dom'
import InformationTabs from './information_tabs'
import ProductSlideshow from './products_slideshow'
import _ from 'lodash'
import {similarProducts, lastViewed } from '../../../data/fixtures'
import { getImageCachedSizePath } from '../../../utils/image_utils'

const updateSearchParams = (search, queryParams) => {
    let searchParams = new URLSearchParams(search);
    _.each(queryParams, (value, key) => searchParams.set(key, value))
    return searchParams.toString();
}


const ProductVariationThumb = ({name, selected, image, model}) => (
    <Link to={`${model}_${name}`} className="submit-button button text-center">
        <div className="color-thumbnail">
            <img className={`color-image ${selected ? 'selected': ''}`} height="50" width="50" src={getImageCachedSizePath(image,'xs')}/>
                {selected &&
                <i className="fa fa-check" ></i>
                }
        </div>
    </Link>
)
const query = gql`
query getProduct($slug: String!) {
    getProduct(slug: $slug) {
        name,
        price,
        available,
        description_short,
        model,
        colors {
            name,
            images,
            quantity,
            main_image
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

class ProductContainer extends Component {
    notifyMe(available) {
        if( !available)
        return (
            <div className="notify-me col-sm-6 col-md-7">
                <div>
                <i className="fa fa-bell-o" aria-hidden="true"></i>
                <span><b>Информирай ме</b></span>
                </div>
                <div>
                    <p>
                        Ако искате да получите имейл когато този продукт е наличен, моля 
                        въведете имейла си по-долу:
                    </p>
                </div>
                <div>
                    <input type="text" placeholder="имейл"/>
                    <button className="btn">Уведоми ме</button>
                </div>

            </div>
        )
    }

    onColorClick(color) {
        return () => {
            const { history, location } = this.props
            history.push(`${location.pathname}?${updateSearchParams(location.search, {color: color.name})}`)
        }
    }

    render() {
        const { 
            data: 
            {getProduct: { 
                images, 
                colors, 
                available,
                availableColors, 
                main_image,
                description_short,
                description,
                model,
                color,
                price
             } } } = this.props
        return (
        <div className="product row">
            <div className="col-sm-12 col-lg-5">
                <div className="product-gallery">
                
                </div>
            </div>
            <div className="col-sm-12 col-lg-7">
                <div className="product-main">
                    <div>
                    <h1>{name}</h1>
                    </div>
                    <div className="short-description">
                        {description_short}
                    </div>
                    <div>
                        {colors.map((c, idx) => {
                            console.log(idx)
                            const selected = c.name === color
                            return (
                            <ProductVariationThumb 
                            key={idx}
                            name={c.name} 
                            selected={selected} 
                            image={c.main_image}
                            model={model} 
                            />
                            )
                        })}
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-sm-6 text-left">
                        <span className="price">{price.toFixed(2).replace(".", ",")} лв</span>
                        </div>
                        <div className="col-sm-6 text-right">
                        {available &&
                            <span className="availability">
                                Няма в наличност
                            </span>
                        }
                        </div>
                    </div>
                    <div className="row product-buttons">
                        <button className="tertiary add-to-cart">
                            <i className="fa fa-cart-plus" aria-hidden="true"></i>
                            Добави в количката
                        </button>
                        <button className="">
                            <i className="fa fa-exchange" aria-hidden="true"></i>
                        </button>
                        <button>
                            <i className="fa fa-heart" aria-hidden="true"></i>
                        </button>
                    </div>
                    <hr/>
                    <div className="row delivery text-left">
                        <i className="fa fa-truck" aria-hidden="true"></i>
                        <span className="delivery">
                            Безплатна доставка за поръчки над 90 лв
                        </span>
                    </div>
                    <hr/>
                    <div className="row product-views row-center">
                        700 човека разгледаха продукта
                    </div>
                    <br/>
                    <div className="row">
                        <div className="col-sm-6 col-md-5 product-social">
                            <i className="fa fa-facebook-official" aria-hidden="true"></i>
                            <i className="fa fa-instagram" aria-hidden="true"></i>
                            <i className="fa fa-twitter" aria-hidden="true"></i>
                        </div>
                        {this.notifyMe(available)}
                    </div>
                </div>
            </div>
            <div className="col-sm-12 information-tabs">
                <InformationTabs/>
            </div>
            <div className="col-sm-12 similar">
                <ProductSlideshow products={similarProducts} title="Подобни продукти"/>
            </div>
            <div className="col-sm-12 last-viewed">
                <ProductSlideshow products={lastViewed} title="Последно разгледани"/>
            </div>
        </div>
        )
    }
}

const WithLoadingCheck = WrappedComponent => props => {
    if(props.data.loading)
        return <div>Loading</div>

    const WithLoading = <WrappedComponent {...props}/>
    return WithLoading
}

const withProductQuery = graphql(query, {
    options:(props) => ({
        variables: {
            slug: props.slug
        }
    })
})

export default compose(withProductQuery, WithLoadingCheck, withRouter)(ProductContainer)
