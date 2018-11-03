import React, {Component} from 'react'
import {graphql } from 'react-apollo';
import gql from 'graphql-tag'
import { Carousel } from 'react-responsive-carousel'
import { withRouter } from "react-router-dom";
import { compose } from 'recompose'
import InformationTabs from './information_tabs'
import ProductSlideshow from './products_slideshow'
import 'react-responsive-carousel/lib/styles/carousel.css'
import _ from 'lodash'
import {similarProducts, lastViewed } from '../../../data/fixtures'
import { getImageCachedSizePath } from '../../../utils/image_utils'


const updateSearchParams = (search, queryParams) => {
    let searchParams = new URLSearchParams(search);
    _.each(queryParams, (value, key) => searchParams.set(key, value))
    return searchParams.toString();
}
const query = gql`
query getProduct($slug: String!) {
    getProduct(slug: $slug) {
        name,
        price,
        available,
        description_short,
        colors {
            name,
            images,
            quantity
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
        images {
            color,
            image
        }
    }
}
`

class ProductContainer extends Component {
    getMainColorImage(color) {
        console.log(this.props.data.getProduct.images)
        console.log(color)
        // The index it matches in the ALL images array
        return _.findKey(this.props.data.getProduct.images, (value ) => {
            return value.color == color.name
        })
    }

    notifyMe() {
        if( !this.props.data.getProduct.available ||
            (this.state.selectedColor && this.state.selectedColor.quantity < 1)
        )
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

    getColor(colorName, colors) {
        return colors.find(c => c.name === colorName)
    }

    selectedColor() {
        const { color, data: {getProduct: { colors, availableColors } } } = this.props
        const selectedColor = color || (availableColors[0] && availableColors[0].name)

        return selectedColor ? this.getColor(selectedColor, colors): null 
    }

    onColorClick(color) {
        return () => {
            const { history, location } = this.props
            history.push(`${location.pathname}?${updateSearchParams(location.search, {color: color.name})}`)
        }
    }

    render() {
        const { data: {getProduct: { images, colors, availableColors }, getProduct } } = this.props
        const selectedColor = this.selectedColor()
        return (
        <div className="product row">
            <div className="col-sm-12 col-lg-5">
                <div className="product-gallery">
                    <Carousel
                        showStatus={false}
                        showIndicators={false}
                        autoPlay={false}
                        selectedItem={selectedColor ? this.getMainColorImage(selectedColor): 0}
                    >
                    {images.map((image, index) => {
                        return <img key={index} src={getImageCachedSizePath(image.image, 'm')}/>
                    })}
                    </Carousel>
                </div>
            </div>
            <div className="col-sm-12 col-lg-7">
                <div className="product-main">
                    <div>
                    <h1>{getProduct.name}</h1>
                    </div>
                    <div className="short-description">
                        {getProduct.description_short}
                    </div>
                    <div>
                        {getProduct.colors.map((c, idx) => {
                            const selected = selectedColor.name === c.name
                            let className = selected ? 'selected' : ''
                            className = className += ' color-image'
                            return (<div className="color-thumbnail" key={idx} >
                                <img className={className} onClick={this.onColorClick(c)} height="50" width="50" src={getImageCachedSizePath(c.images[0],'xs')}/>
                                {selected &&
                                <i className="fa fa-check" ></i>
                                }
                                </div>)
                        })}
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-sm-6 text-left">
                        <span className="price">{getProduct.price.toFixed(2).replace(".", ",")} лв</span>
                        </div>
                        <div className="col-sm-6 text-right">
                        {selectedColor && selectedColor.quantity < 1 &&
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
                        {this.notifyMe()}
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
