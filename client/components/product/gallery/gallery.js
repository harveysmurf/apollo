import React from 'react'
import { getImageCachedSizePath } from '../../../../utils/image_utils'
import { updateSelectedImage} from '../../../mutations/local'
import { mainImageQuery} from '../../../queries/local'
import { WithLoadingCheck, withMutation } from '../../shared/withQuery'
import { compose } from 'recompose'
import styles from './gallery.scss'
import classNames from 'classnames/bind'
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
        this.onScroll({target: this.container.current})
    }
    componentDidUpdate() {
        this.onScroll()
    }
    onScroll = () => {
        const {current} = this.container
        const {isScrollableLeft, isScrollableRight} = this.state
        if(!current)
            return
        
        const newState = {
            isScrollableLeft: current.scrollLeft > 0,
            isScrollableRight: (current.scrollLeft + current.clientWidth) < current.scrollWidth
        }
        
        if(newState.isScrollableLeft === isScrollableLeft && newState.isScrollableRight === isScrollableRight) {
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
        const {images, data: { pdp: { mainImage }}, mutate} = this.props
        return (
            <div>
                <div className="main-image">
                    <img 
                        src={getImageCachedSizePath(images[mainImage], 'l')}
                    />
                </div>
                <div className="row">
                    <div className='col-sm-1'>
                        <div onClick={this.scrollLeft} className={css({
                            'scroll-buttons': true,
                            hidden: !this.state.isScrollableLeft
                        })}>
                            <i className={css(['fa','fa-caret-left'])}/>
                        </div>
                    </div>
                    <div className="col-sm-10">
                            <div onScroll={this.onScroll} ref={this.container} className={styles['thumb-list']}>
                                {images.map((image, key) => {
                                    return (
                                    <div onClick={() => mutate({variables: {index: key}})}
                                    key={key} 
                                    className={css({
                                        selected: key == mainImage
                                    })}>
                                        <img width='150px' src={getImageCachedSizePath(image, 's')}/>
                                    </div>
                                    )
                                })}
                            </div>
                    </div>
                    <div className='col-sm-1'>
                        <div onClick={this.scrollRight} className={css({
                            'scroll-buttons': true,
                            hidden: !this.state.isScrollableRight
                        })}>
                            <i className={css(['fa','fa-caret-right'])}/>
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}
export default compose(
    WithLoadingCheck(mainImageQuery),
    withMutation(updateSelectedImage)
)(Gallery) 