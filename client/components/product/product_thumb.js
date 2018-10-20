import React, {Component} from 'react'
import { Link} from 'react-router-dom'


export default class ProductThumb extends Component {
    constructor(props) {
        super(props)
    }
    getDisplayImage(product, color) {
        if(! color)
            return product.main_img
        else {
            let colorObj = _.find(product.colors, (c) => {
                return c.group == color
            })
            return colorObj.images.length > 0 ? colorObj.images[0] : product.main_img
        }

    }
    render() {
        let product = this.props.product
        let color = this.props.color
        return (
            <div className="text-center product-thumb">
                <div>
                    <Link to={product.slug}>
                <img width={150} height={150} src={this.getDisplayImage(product, color)}/>
                    </Link>
                </div>
                <div>
                    <a href="#">{product.name}</a>
                </div>
                <div className="text-left">
                    {product.description}
                </div>
                <div className="text-left">
                <b>{product.price.toFixed(2)} лв.</b>
                </div>
            </div>
        )
    }
}