import React from 'react'
import styles from './presentation.scss'

export default () => {
  return (
    <div className="row">
      <div className="col-sm-12 col-md-4 bottom-spacing-m">
        <a href="/damski-chanti" className={styles['crap-container']}>
          <img
            className="img-responsive"
            src="images/bags-home-2.jpg"
            alt="Дамски Чанти"
          />
          <div className={styles['crap-caption']}>
            <h2 id="cat">Дамски Чанти</h2>
            <p>Ежедневни, официални, вечерни, раници</p>
          </div>
          <div className={styles['blur']} />
        </a>
      </div>
      <div className="col-sm-12 col-md-4 bottom-spacing-m">
        <a href="/kojeni-damski-chanti" className={styles['crap-container']}>
          <img
            className="img-responsive"
            src="images/bags-home-3.jpg"
            alt="Дамски чанти от естествена кожа"
          />
          <div className={styles['crap-caption']}>
            <h2 id="cat">Естествена Кожа</h2>
            <p>Дамски чанти от естествена кожа произведени в Италия.</p>
            <p>Безплатна Доставка !</p>
          </div>
          <div className={styles['blur']} />
        </a>
      </div>
      <div className="col-sm-12 col-md-4 bottom-spacing-m">
        <a href="namalenia" className={styles['crap-container']}>
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
        </a>
      </div>
    </div>
  )
}
