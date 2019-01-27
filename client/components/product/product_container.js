import React, {Component} from 'react'
import { withRouter } from "react-router-dom";
import { compose } from 'recompose'
import { Link} from 'react-router-dom'
import InformationTabs from './information_tabs'
import ProductSlideshow from './products_slideshow'
import _ from 'lodash'
import ProductGallery from './gallery/gallery'
import { WithLoadingCheck } from '../shared/withQuery'
import { withMutation } from '../shared/withQuery'
import { resetState } from '../../mutations/local'
import { getProductQuery } from '../../queries/remote'
import { featuresQuery } from '../../queries/local'
import {similarProducts, lastViewed } from '../../../data/fixtures'
import { getImageCachedSizePath } from '../../../utils/image_utils'

const updateSearchParams = (search, queryParams) => {
    let searchParams = new URLSearchParams(search);
    _.each(queryParams, (value, key) => searchParams.set(key, value))
    return searchParams.toString();
}


const ProductVariationThumb = ({name, selected, image, model, slug}) => (
    <Link to={`/${slug}/${model}`} className="text-center">
        <div className="color-thumbnail">
            <img className={`color-image ${selected ? 'selected': ''}`} height="50" width="50" src={getImageCachedSizePath(image,'xs')}/>
                {selected &&
                <i className="fa fa-check" ></i>
                }
        </div>
    </Link>
)

class ProductContainer extends Component {
    constructor(props) {
        super(props)
        this.props.resetState()
    }


    componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if(prevProps.model !== this.props.model)
        this.props.resetState()
    }
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

    render() {
        const { 
            getFeatures: {features},
            data: 
            {getProduct: { 
                slug,
                name,
                images, 
                colors, 
                available,
                availableColors, 
                main_image,
                description_short,
                description,
                variations,
                model,
                color,
                price
             } } } = this.props
        return (
        <div className="product row">
            <div className="col-sm-12 col-lg-5">
                <div className="product-gallery">
                    <ProductGallery images={images} selected={0}/>
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
                        {variations.map((c, idx) => {
                            const selected = c.model === model
                            return (
                            <ProductVariationThumb 
                            key={idx}
                            name={c.name} 
                            selected={selected} 
                            image={c.images.length && c.images[0]}
                            model={c.model} 
                            slug={c.slug}
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
                        {!available &&
                            <span className="availability">
                                Няма в наличност
                            </span>
                        }
                        </div>
                    </div>
                    <div className="row product-buttons">
                        {available && (
                            <button className="tertiary add-to-cart">
                                <i className="fa fa-cart-plus" aria-hidden="true"></i>
                                Добави в количката
                            </button>
                        )}
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
            {features.PDP_SIMILAR_PRODUCTS && (
            <div className="col-sm-12 similar">
                <ProductSlideshow products={similarProducts} title="Подобни продукти"/>
            </div>
            )}
            {features.PDP_LAST_VIEWED && (
                <div className="col-sm-12 last-viewed">
                    <ProductSlideshow products={lastViewed} title="Последно разгледани"/>
                </div>
            )}

        </div>
        )
    }
}

const withProductQuery = WithLoadingCheck(getProductQuery, {
    options:(props) => ({
        variables: {
            model: props.match.params.model
        }
    })
})

const withFeaturesQuery = WithLoadingCheck(featuresQuery, {name: 'getFeatures'})

export default compose(
    withFeaturesQuery,
    withProductQuery, 
    withMutation(resetState, {name: 'resetState'}), 
    )(ProductContainer)
