import React, {Component} from 'react'
import {graphql } from 'react-apollo';
import gql from 'graphql-tag'
import Social from './header/social'
import TopSearch from './header/search'
import UserTop from './header/user_top'


const TopHeader = () => {
    return (
    <div className="top-nav">
        <div className="container">
            <div className="row row-center">
                <div className="col-md-3 col-lg-2 col-sm-12">
                    <Social/>
                </div>
                <div className="col-md-4 col-lg-6 col-sm-12">
                    <TopSearch/>
                </div>
                <div className="col-md-5 col-lg-4 col-sm-12 user-top text-right">
                    <UserTop/>
                </div>
            </div>
        </div>
    </div>
    )
}

export default TopHeader

