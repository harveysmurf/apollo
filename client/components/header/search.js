import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Search extends Component {
  render() {
    return (
      <div className="search">
        <div className="input-control-addon">
          <input type="text" placeholder="Търси" />
          <button className="button">
            <FontAwesomeIcon icon="search" />
          </button>
        </div>
      </div>
    )
  }
}
