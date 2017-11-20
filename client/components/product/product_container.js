import React, {Component} from 'react'
import {graphql } from 'react-apollo';
import gql from 'graphql-tag'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.css'
import _ from 'lodash'



const size = {
    xs: '50x50',
    s: '150x150',
    m: '300x300',
    l: '600x600',
    xl: '1200x1200'
}

const query = gql`
query getProduct($slug: String) {
    getProduct(slug: $slug) {
        name,
        price,
        description_short,
        colors {
            name,
            images,
            quantity
        }
    }
}
`
function cachedImage(src, format) {
    return  '/images/products' +src + '-' + size[format] + '.jpg'
}

class ProductContainer extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedImage : 0,
            selectedColor: false
        }
        this.colorClick = this.colorClick.bind(this)
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
                        return <img key={index} src={cachedImage(image.img,'m')}/>
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
                        {data.getProduct.colors.map((c, index) => {
                            // The index it matches in the ALL images array
                            let imageIndx = _.findKey(images, (value, index) => {
                                return value.name == c.name
                            })
                            let selected = this.state.selectedColor && this.state.selectedColor.name == c.name
                            let className = selected ? 'selected' : ''
                            className = className += ' color-image'
                            return (<div className="color-thumbnail">
                                <img className={className} onClick={() => this.colorClick(imageIndx, c)} key={imageIndx} height="50" width="50" src={cachedImage(c.images[0],'xs')}/>
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
                    <div className="product-social">
                    </div>
                </div>
            </div>
            {data.getProduct.name}
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

