import React from 'react'
import { Link } from 'react-router-dom'
import styles from './presentation.scss'

export default () => {
  return (
    <div className="row">
      <div className="col-sm-12 col-md-4 bottom-spacing-m">
        <Link to="/damski-chanti" className={styles['crap-container']}>
          <img
            className="img-responsive"
            src="images/bags-home-2.jpg"
            alt="Дамски Чанти"
          />
          <div className={styles['crap-caption']}>
            <h2 id="cat">Дамски Чанти</h2>
            <p>Ежедневни, официални, вечерни, раници.</p>
          </div>
          <div className={styles['blur']} />
        </Link>
      </div>
      <div className="col-sm-12 col-md-4 bottom-spacing-m">
        <Link to="/kojeni-damski-chanti" className={styles['crap-container']}>
          <img
            className="img-responsive"
            src="images/bags-home-3.jpg"
            alt="Дамски чанти от естествена кожа"
          />
          <div className={styles['crap-caption']}>
            <h2 id="cat">Естествена Кожа</h2>
            <p>Дамски чанти от естествена кожа произведени в Италия.</p>
          </div>
          <div className={styles['blur']} />
        </Link>
      </div>
      <div className="col-sm-12 col-md-4 bottom-spacing-m">
        <Link to="namalenia" className={styles['crap-container']}>
          <img
            className="img-responsive"
            src="images/bags-home-1.jpg"
            alt="Намаления на дамски чанти"
          />
          <div className={styles['crap-caption']}>
            <h2 id="cat">Намаления</h2>
            <p>Отстъпки до 50% !</p>
          </div>
          <div className={styles['blur']} />
        </Link>
      </div>
    </div>
  )
}
