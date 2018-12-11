import React from 'react'

export const WithLoadingCheck = WrappedComponent => props => {
    if(props.data.loading)
        return <div>Loading</div>
    const WithLoading = <WrappedComponent {...props} />
    return WithLoading
}