import React, { Component } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { getImageCachedSizePath } from '../../../utils/image_utils'

export default class ColorVariationThumb extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nav1: null,
      nav2: null
    }
  }

  componentDidMount() {
    this.setState({
      nav1: this.slider1,
      nav2: this.slider2
    })
  }

  render() {
    const { images } = this.props
    return (
      <div>
        <h2>Slider Syncing (AsNavFor)</h2>
        <h4>First Slider</h4>
        <Slider
          asNavFor={this.state.nav2}
          ref={slider => (this.slider1 = slider)}
        >
          {images.map(image => (
            <div key={image}>
              <img src={getImageCachedSizePath(image, 'm')} />
            </div>
          ))}
        </Slider>
        <h4>Second Slider</h4>
        <Slider
          asNavFor={this.state.nav1}
          ref={slider => (this.slider2 = slider)}
          slidesToShow={5}
          swipeToSlide={true}
          focusOnSelect={true}
        >
          {images.map(image => (
            <div key={image}>
              <img src={getImageCachedSizePath(image, 's')} />
            </div>
          ))}
        </Slider>
      </div>
    )
  }
}
