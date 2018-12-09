import React, {Component} from 'react'
import {graphql } from 'react-apollo';

export const withQuery = (query, variables) => graphql(query, {
    options:{
        variables
    }
})


export const WithLoadingCheck = (query, variables) => WrappedComponent => (
    withQuery(query, variables)( props => {
            if(props.data.loading)
                return <div>Loading</div>
            const WithLoading = <WrappedComponent {...props}/>
            return WithLoading
    })
)

export const withMutation = (query, options) => graphql(query, options)