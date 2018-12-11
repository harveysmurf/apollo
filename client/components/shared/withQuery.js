import React, {Component} from 'react'
import {graphql } from 'react-apollo';

export const WithLoadingCheck = (query, config={}) => WrappedComponent => (
    graphql(query, config)( props => {
            const resultName = config.name ? config.name : 'data'
            if(props[resultName].loading)
                return <div>Loading</div>
            const WithLoading = <WrappedComponent {...props}/>
            return WithLoading
    })
)

export const withMutation = (query, options) => graphql(query, options)