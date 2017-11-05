import React, {Component} from 'react'
import gql from 'graphql-tag'


export default class Social extends Component {
    render() {
        return (
            <div class="social">
            <a href="www.facebook.com">
                <i className="fa fa-facebook" aria-hidden="true"></i>
            </a>
            <a href="www.instagram.com">
                <i className="fa fa-instagram" aria-hidden="true"></i>
            </a>
            <a href="www.google.com">
                <i className="fa fa-youtube" aria-hidden="true"></i>
            </a>
            </div>
        )
    }
}

