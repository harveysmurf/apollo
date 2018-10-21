import React, {Component} from 'react'
import {graphql } from 'react-apollo';
import gql from 'graphql-tag'
import { Carousel } from 'react-responsive-carousel'
import InformationTabs from './information_tabs'
import ProductSlideshow from './products_slideshow'
import 'react-responsive-carousel/lib/styles/carousel.css'
import _ from 'lodash'
import {similarProducts, lastViewed } from '../../../data/fixtures'
import { getImageCachedSizePath } from '../../../utils/image_utils'



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
        similarProducts {
            name,
            slug
        }
    }
}
`

class ProductContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedImage : 0,
            selectedColor: false
        }
        this.colorClick = this.colorClick.bind(this)
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

    colorClick(index, color) {
        this.setState({
            selectedColor: color,
            selectedImage: parseInt(index)
        })
    }

    render() {
    let data = this.props.data

    if(data.loading)
        return (<div>Loading</div>)
    else 
    {
        let images = data.getProduct.colors.reduce((images, c) => {
        
            let arr = c.images.map((img) => {
                return {
                    name: c.name,
                    img: img
                }
            })
            return images.concat(arr)
        }, [])
        return (
        <div className="product row">
            <div className="col-sm-12 col-lg-5">
                <div className="product-gallery">
                    <Carousel
                        showStatus={false}
                        showIndicators={false}
                        autoPlay={false}
                        selectedItem={this.state.selectedImage}
                    >
                    {images.map((image, index) => {
                        return <img key={index} src={getImageCachedSizePath(image.img, 'm')}/>
                    })}
                    </Carousel>
                </div>
            </div>
            <div className="col-sm-12 col-lg-7">
                <div className="product-main">
                    <div>
                    <h1>{data.getProduct.name}</h1>
                    </div>
                    <div className="short-description">
                        {data.getProduct.description_short}
                    </div>
                    <div>
                        {data.getProduct.colors.map((c) => {
                            // The index it matches in the ALL images array
                            console.log(images)
                            let imageIndx = _.findKey(images, (value ) => {
                                return value.name == c.name
                            })
                            let selected = this.state.selectedColor && this.state.selectedColor.name == c.name
                            let className = selected ? 'selected' : ''
                            className = className += ' color-image'
                            return (<div className="color-thumbnail">
                                <img className={className} onClick={() => this.colorClick(imageIndx, c)} key={imageIndx} height="50" width="50" src={getImageCachedSizePath(c.images[0],'xs')}/>
                                {this.state.selectedColor && this.state.selectedColor.name == c.name &&
                                <i className="fa fa-check" ></i>
                                }
                                </div>)
                        })}
                    </div>
                    <hr/>
                    <div className="row">
                        <div className="col-sm-6 text-left">
                        <span className="price">{data.getProduct.price.toFixed(2).replace(".", ",")} лв</span>
                        </div>
                        <div className="col-sm-6 text-right">
                        {this.state.selectedColor && this.state.selectedColor.quantity < 1 &&
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
            {console.log(similarProducts)}
            {console.log(lastViewed)}
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
}

export default graphql(query, {
    options:(props) => ({
        variables: {
            slug: props.slug
        }
    })
})(ProductContainer)

