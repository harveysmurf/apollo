import React, { Component } from 'react'
import ProductThumb from './product_thumb'

export default class ProductsSlideshow extends Component {
  render() {
    const { title, products } = this.props
    return (
      <div className="row">
        <h3 className="col-sm-12">{title}</h3>

        {products.map(p => {
          return (
            <div className="col-sm-2">
              <ProductThumb product={p} />
            </div>
          )
        })}
      </div>
    )
  }
}
