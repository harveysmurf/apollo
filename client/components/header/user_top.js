import React from 'react'
import { Query, Mutation } from '@apollo/client/react/components'
import { withApollo } from '@apollo/client/react/hoc'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import { WithLoadingCheck } from '../shared/withQuery'
import Dropdown from '../utilities/dropdown'
import { userQuery, cartQuery } from '../../queries/remote'
import { featuresQuery } from '../../queries/local'
import { Logout } from '../../mutations/remote'
import { compose } from 'recompose'

const UserTop = props => {
  const user = props.data.loggedInUser
  const loginIsEnabled =
    props.getFeatures && props.getFeatures.features.LOGIN_ENABLED
  return (
    <div>
      <Dropdown
        className="user-link"
        button_content={
          <div>
            <FontAwesomeIcon icon="phone" />
            <span>За връзка</span>
          </div>
        }
        dropdown_data={
          <div>
            <div>
              <a href="tel:0887 52 38 74">0887 52 38 74</a>
            </div>
            <div>
              <a href="tel:0897 78 90 54">0897 78 90 54</a>
            </div>
          </div>
        }
      />
      {!user && loginIsEnabled && (
        <Link to="/register" className="user-link">
          <FontAwesomeIcon icon="user-plus" />
          Регистрация
        </Link>
      )}
      {!user && loginIsEnabled && (
        <Link to="/login" className="user-link">
          <FontAwesomeIcon icon="sign-in-alt" />
          Вход
        </Link>
      )}
      {user && loginIsEnabled && (
        <Link to="/profile" className="user-link">
          <FontAwesomeIcon icon="user" />
          <span>Профил</span>
        </Link>
      )}

      {user && loginIsEnabled && (
        <a href="#" className="favorites user-link">
          <FontAwesomeIcon icon="heart" />
          Любими
        </a>
      )}
      <Query query={cartQuery} ssr={false}>
        {({ data }) => {
          const cart = data && data.cart
          return (
            <Link to="/checkout" className="top-cart user-link">
              <FontAwesomeIcon icon="shopping-cart" />
              Количка <b>{cart && !!cart.quantity && ` (${cart.quantity})`}</b>
            </Link>
          )
        }}
      </Query>
      {user && loginIsEnabled && (
        <Mutation
          onCompleted={data => {
            if (data && data.logout) {
              props.client.clearStore()
              props.client.resetStore()
            }
          }}
          mutation={Logout}
        >
          {(logout, { _data }) => (
            <a
              onClick={e => {
                e.preventDefault()
                logout()
              }}
              href="#"
              className="favorites user-link"
            >
              <FontAwesomeIcon icon="sign-out-alt" />
              Изход
            </a>
          )}
        </Mutation>
      )}
    </div>
  )
}

const withFeaturesQuery = WithLoadingCheck(featuresQuery, {
  name: 'getFeatures'
})
const withUserQuery = WrappedComponent => props => {
  const loginIsEnabled =
    props.getFeatures && props.getFeatures.features.LOGIN_ENABLED

  if (loginIsEnabled) {
    const Comp = WithLoadingCheck(userQuery)(WrappedComponent)
    return <Comp {...props} />
  } else {
    return <WrappedComponent data={{ loggedInUser: null }} {...props} />
  }
}

export default compose(
  withFeaturesQuery,
  withUserQuery,
  withApollo
)(UserTop)
