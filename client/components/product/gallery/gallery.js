import React from 'react'
import { getImageCachedSizePath } from '../../../../utils/image_utils'
import { updateSelectedImage} from '../../../mutations/local'
import { mainImageQuery} from '../../../queries/local'
import { WithLoadingCheck, withMutation } from '../../shared/withQuery'
import { compose } from 'recompose'
import styles from './gallery.scss'
import classNames from 'classnames/bind'

const Gallery = ({images, data: {pdp: {mainImage}}, mutate}) => (
    (
    <div>
        <div className="main-image">
            <img 
                src={getImageCachedSizePath(images[mainImage], 'l')}
            />
        </div>
        <div className={styles['thumb-list']}>
            {images.map((image, key) => {
                return (
                <div onClick={() => mutate({variables: {index: key}})}
                key={key} 
                className={mainImage === key ? 'selected': ''}>
                    <img src={getImageCachedSizePath(image, 's')}/>
                </div>
                )
            })}
        </div>
    </div>
    )
)
export default compose(
    WithLoadingCheck(mainImageQuery),
    withMutation(updateSelectedImage)
)(Gallery) 