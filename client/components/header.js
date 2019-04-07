import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import gql from 'graphql-tag'
import Social from './header/social'
import TopSearch from './header/search'
import UserTop from './header/user_top'
import MainNav from './header/main_nav'

const Header = props => {
  return (
    <div className="header">
      <div className="top-nav">
        <div className="container">
          <div className="row row-center">
            <div className="col-md-2 col-lg-2 col-sm-12">
              <Social />
            </div>
            <div className="col-md-4 col-lg-5 col-sm-12">
              <TopSearch />
            </div>
            <div className="col-md-6 col-lg-5 col-sm-12 user-top text-right">
              <UserTop />
            </div>
          </div>
        </div>
      </div>
      <MainNav />
    </div>
  )
}

export default Header
