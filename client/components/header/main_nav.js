import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Dropdown } from '../shared/dropdown.jsx'
import styles from './main_nav.scss'
export default class MainNav extends Component {
  render() {
    return (
      <div className={styles['main-nav']}>
        <div className="row row-center">
          <Dropdown
            label={
              <Link className={styles['nav-link']} to="/damski-chanti">
                Дамски Чанти
              </Link>
            }
          >
            <div className={styles['mega-menu-content']}>
              <div>
                <b>Стил</b>
                <div className={styles['links']}>
                  <Link to="/damski-ranici">Дамски Раници</Link>
                  <Link to="/oficialni">Официялни & Клъч</Link>
                  <Link to="/ramenni-damski-chanti">Раменни & Totes</Link>
                  <Link to="/rachni-damski-chanti">Ръчни & Satchel</Link>
                  <Link to="/damski-chanti-za-prez-ramo">Чанти през Рамо</Link>
                </div>
              </div>
              <div>
                <b>Цветове</b>
                <div className={styles['links']}>
                  <Link to="/damski-chanti">ЖЪлт</Link>
                  <Link to="/damski-chanti">Черен</Link>
                  <Link to="/damski-chanti">раници</Link>
                  <Link to="/damski-chanti">drugi</Link>
                </div>
              </div>
            </div>
          </Dropdown>
          <Link className={styles['nav-link']} to="/kojeni-damski-chanti">
            Естествена Кожа
          </Link>
          <div className={`${styles['logo']} text-center`}>
            <Link className="nav-link" to="/">
              <img src="/images/log.png" />
            </Link>
          </div>
          <Link className={styles['nav-link']} to="/damski-ranici">
            Раници
          </Link>
          <Link className={styles['nav-link']} to="/about">
            За Нас
          </Link>
          <Link
            className={styles['nav-link']}
            style={{ color: '#ce0000' }}
            to="/namalenia"
          >
            Намаления
          </Link>
        </div>
      </div>
    )
  }
}
