import React, {Fragment} from 'react'
import { Query } from 'react-apollo';
import { cartQuery } from '../../queries/remote'

export default  props => (
    <Query query={cartQuery}>
    {({ data: { cart }}) => (
        <Fragment>
            {console.log(cart)}
        </Fragment>
    )}
    </Query>
)