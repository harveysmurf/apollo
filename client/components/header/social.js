import React, { Component } from 'react'

export default class Social extends Component {
  render() {
    return (
      <div className="social">
        <a href="www.facebook.com">
          <i className="fab fa-facebook" aria-hidden="true" />
        </a>
        <a href="www.instagram.com">
          <i className="fab fa-instagram" aria-hidden="true" />
        </a>
        <a href="www.google.com">
          <i className="fab fa-youtube" aria-hidden="true" />
        </a>
      </div>
    )
  }
}
