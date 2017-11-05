import React, {Component} from 'react'
import {graphql } from 'react-apollo';
import gql from 'graphql-tag'
import Social from './header/social'


const TopHeader = ({data: {loggedInUser, loading}}) => {
  if(loading)
    return <div>Loading</div>
  else
    return (
    <div className="top-nav">
        <div className="container">
            <div className="row">
                <div className="column column-30">
                    <Social/>
                </div>
                <h2>
                    {loggedInUser &&
                    <div>
                <i className="fa fa-bandcamp" aria-hidden="true">Logged in</i>
                Logged in
                    </div>
                    }
                </h2>
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

