import React, { Component } from 'react'
import { Link } from 'react-router-dom'
export default class BagType extends Component {
  render() {
    if (this.props.category.subcategories.length < 1) return null
    return (
      <div>
        <b>Тип</b>
        <div className="filter-content">
          {this.props.category.subcategories.map((t, i) => {
            return (
              <div key={i}>
                <Link to={t.slug}>{t.name}</Link>
              </div>
            )
          })}
        </div>
      </div>
    )
  }
}
