import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class MainNav extends Component {
  render() {
    return (
      <div className="main-nav">
        <div className="row row-center">
          <div className="col-lg-5 text-right">
            <Link to="/damski-chanti">Дамски Чанти</Link>
            <Link to="/koja">Естествена Кожа</Link>
          </div>
          <div className="col-lg-2">
            <div className="logo text-center">
              <Link to="/">
                <img src="/images/log.png" />
              </Link>
            </div>
          </div>
          <div className="col-lg-5 text-left">
            <Link to="/ranici">Раници</Link>
            <Link to="/about">За Нас</Link>
            <Link style={{ color: '#ce0000' }} to="/namalenia">
              Намаления
            </Link>
          </div>
        </div>
      </div>
    )
  }
}
