import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Social extends Component {
  render() {
    return (
      <div className="social">
        <a href="www.facebook.com">
          <FontAwesomeIcon icon={['fab', 'facebook']} />
        </a>
        <a href="www.instagram.com">
          <FontAwesomeIcon icon={['fab', 'instagram']} />
        </a>
        <a href="www.google.com">
          <FontAwesomeIcon icon={['fab', 'youtube']} />
        </a>
      </div>
    )
  }
}
