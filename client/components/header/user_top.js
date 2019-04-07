import React from 'react'
import gql from 'graphql-tag'
import { Query, Mutation, withApollo } from 'react-apollo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Link } from 'react-router-dom'
import Dropdown from '../utilities/dropdown'
import { userQuery, cartQuery } from '../../queries/remote'
import { Logout } from '../../mutations/remote'

const UserTop = props => {
  if (props.loading) return <div>Loading...</div>

  const user = props.data.loggedInUser
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
            <div>0987 23 34 32</div>
            <div>2323 34 32 23</div>
          </div>
        }
      />
      {!user && (
        <Link to="/register" className="user-link">
          <FontAwesomeIcon icon="user-plus" />
          Регистрация
        </Link>
      )}
      {!user && (
        <Link to="/login" className="user-link">
          <FontAwesomeIcon icon="sign-in-alt" />
          Вход
        </Link>
      )}
      {user && (
        <Link to="/profile" className="user-link">
          <FontAwesomeIcon icon="user" />
          <span>Профил</span>
        </Link>
      )}

      {user && (
        <a href="#" className="favorites user-link">
          <FontAwesomeIcon icon="heart" />
          Любими
        </a>
      )}
      <Query query={cartQuery}>
        {({ data: { cart } }) => (
          <Link to="/checkout" className="top-cart user-link">
            <FontAwesomeIcon icon="shopping-cart" />
            Количка <b>{cart && !!cart.quantity && ` (${cart.quantity})`}</b>
          </Link>
        )}
      </Query>
      {user && (
        <Mutation
          onCompleted={data => {
            if (data && data.logout) {
              props.client.clearStore()
              props.client.resetStore()
            }
          }}
          mutation={Logout}
        >
          {(logout, { data }) => (
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

export default withApollo(props => (
  <Query query={userQuery} {...props}>
    {UserTop}
  </Query>
))
