import React from 'react'
import { getImageCachedSizePath } from '../../../../utils/image_utils'
import styles from './gallery.scss'
import classNames from 'classnames/bind'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
const css = classNames.bind(styles)

class Gallery extends React.Component {
  state = {
    isScrollableLeft: null,
    isScrollableRight: null
  }
  constructor(props) {
    super(props)
    this.container = React.createRef()
  }
  componentDidMount() {
    this.onScroll({ target: this.container.current })
  }
  componentDidUpdate() {
    this.onScroll()
  }
  onScroll = () => {
    const { current } = this.container
    const { isScrollableLeft, isScrollableRight } = this.state
    if (!current) return

    const newState = {
      isScrollableLeft: current.scrollLeft > 0,
      isScrollableRight:
        current.scrollLeft + current.clientWidth < current.scrollWidth
    }

    if (
      newState.isScrollableLeft === isScrollableLeft &&
      newState.isScrollableRight === isScrollableRight
    ) {
      return
    }
    this.setState(newState)
  }
  scrollRight = () => {
    this.container.current.scrollLeft += 100
  }
  scrollLeft = () => {
    this.container.current.scrollLeft -= 100
  }
  render() {
    const { images, selected, setMainImage } = this.props
    return (
      <div>
        <div className="text-center">
          <img
            className={styles['main-image']}
            src={getImageCachedSizePath(images[selected], 'l')}
          />
        </div>
        <div className="row">
          <div className="col-sm-1">
            <div
              onClick={this.scrollLeft}
              className={css({
                'scroll-buttons': true,
                hidden: !this.state.isScrollableLeft
              })}
            >
              <FontAwesomeIcon icon={['fas','caret-left']}/>
            </div>
          </div>
          <div className="col-sm-10">
            <div
              onScroll={this.onScroll}
              ref={this.container}
              className={styles['thumb-list']}
            >
              {images.map((image, key) => {
                return (
                  <div
                    onClick={() => setMainImage(key)}
                    key={`${image}/${key}`}
                    className={css({
                      selected: key == selected
                    })}
                  >
                    <img src={getImageCachedSizePath(image, 's')} />
                  </div>
                )
              })}
            </div>
          </div>
          <div className="col-sm-1">
            <div
              onClick={this.scrollRight}
              className={css({
                'scroll-buttons': true,
                hidden: !this.state.isScrollableRight
              })}
            >
              <FontAwesomeIcon icon={['fas','caret-right']}/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default Gallery
