import React, {Component} from 'react'
import {
  Link
} from 'react-router-dom'

const MobileNav = (props) => {
    return (
    <div className="mobile-nav text-center">
        <Link to="/" className="mobile-nav-link">
            <div>
                <i className="fa fa-home" aria-hidden="true"></i>
            </div>
            Начало
        </Link>
        <Link to="/damski-chanti" className="mobile-nav-link">
            <div>
                <i className="fa fa-shopping-bag" aria-hidden="true"></i>
            </div>
            Продукти

        </Link>
        <Link to="/damski-chanti" className="mobile-nav-link">
            <div>
                <i className="fa fa-user" aria-hidden="true"></i>
            </div>
            Профил

        </Link>
        <Link to="/" className="mobile-nav-link">
            <div>
                <i className="fa fa-heart" aria-hidden="true"></i>
            </div>
            Любими
        </Link>
        <Link to="/" className="mobile-nav-link">
            <div>
                <i className="fa fa-shopping-cart" aria-hidden="true"></i>
            </div>
            Количка
        </Link>
    </div>
    )
}

export default MobileNav

