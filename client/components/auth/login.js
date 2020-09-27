import React, { Component } from 'react'
import axios from 'axios'
import { Query } from '@apollo/client/react/components'
import styles from './login.scss'
import { userQuery } from '../../queries/remote'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email: '',
      password: '',
      error: false
    }

    this.handleInputChange = this.handleInputChange.bind(this)
    this.login = this.login.bind(this)
  }

  login() {
    axios
      .post(
        'http://localhost:3000/login',
        {
          email: this.state.email,
          password: this.state.password
        },
        {
          withCredentials: true
        }
      )
      .then(res => {
        window.location = '/'
      })
      .catch(err => {
        this.setState({ error: true })
      })
  }

  handleInputChange(event) {
    const target = event.target
    const value = target.value
    const name = target.name

    this.setState({
      [name]: value
    })
  }

  render() {
    let error = this.state.error
    return (
      <div className={`${styles['login']} bottom-spacing-xl`}>
        {error && <span>Грешно потребителско име или парола</span>}
        <fieldset>
          <div className="row horizontal-align-center bottom-spacing-m">
            <div className="col-sm-3 col-md-3 text-right">
              <label>Имейл</label>
            </div>
            <div className="col-sm col-md">
              <input
                type="text"
                placeholder="example@abv.net"
                name="email"
                value={this.state.email}
                onChange={this.handleInputChange}
              />
            </div>
          </div>
          <div className="row horizontal-align-center bottom-spacing-m">
            <div className="col-sm-3 col-md-3 text-right">
              <label>Парола</label>
            </div>
            <div className="col-sm col-md">
              <input
                type="text"
                placeholder="Парола"
                name="password"
                value={this.state.password}
                onChange={this.handleInputChange}
              />
            </div>
          </div>
          <div className="row horizontal-align-center">
            <div className="col-sm-12">
              <input
                className="button-primary"
                type="submit"
                value="Login"
                onClick={this.login}
              />
            </div>
          </div>
        </fieldset>
      </div>
    )
  }
}
export default () => (
  <Query query={userQuery}>{props => <Login {...props} />}</Query>
)
