import React, {Component} from 'react'
import {graphql } from 'react-apollo';
import gql from 'graphql-tag'
import Social from './header/social'
import TopSearch from './header/search'
import UserTop from './header/user_top'


const TopHeader = ({data: {loggedInUser, loading}}) => {
  if(loading)
    return <div>Loading</div>
  else
    return (
    <div className="top-nav">
        <div className="container">
            <div className="row row-center">
                <div className="column column-20">
                    <Social/>
                </div>
                <div className="column column-40">
                    <TopSearch/>
                </div>
                <div className="column column-40 user-top">
                    <UserTop/>
                </div>
            </div>
        </div>
    </div>
    )
}
console.log

const MyQuery = gql`query {
  loggedInUser
  {
    name
  }
}`;

export default graphql(MyQuery)(TopHeader);

