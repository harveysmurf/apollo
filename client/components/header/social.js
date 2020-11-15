import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Social extends Component {
  render() {
    return (
      <div className="social">
        <a
          aria-label="facebook"
          href="https://www.facebook.com/DamskiChantiCom"
        >
          <FontAwesomeIcon icon={['fab', 'facebook']} />
        </a>
        <a aria-label="instagram" href="http://www.instagram.com">
          <FontAwesomeIcon icon={['fab', 'instagram']} />
        </a>
        <a
          aria-label="youtube"
          href="https://www.youtube.com/channel/UCSR0CNfEt_LMwYSxv1Ecrxw"
        >
          <FontAwesomeIcon icon={['fab', 'youtube']} />
        </a>
      </div>
    )
  }
}
