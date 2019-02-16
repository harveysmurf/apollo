import React, { Component } from 'react'
import axios from 'axios'
import { Query } from 'react-apollo'
import { userQuery } from '../../queries/remote'

class Login extends Component {
  constructor(props) {
    super(props)
    console.log(props)
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
    console.log(this.props)
    return (
      <div>
        {error && <span>Грешно потребителско име или парола</span>}
        <fieldset>
          <label htmlFor="nameField">Email</label>
          <input
            type="text"
            placeholder="example@abv.net"
            name="email"
            value={this.state.email}
            onChange={this.handleInputChange}
          />

          <label htmlFor="nameField">Password</label>

          <input
            type="text"
            placeholder="type your password"
            name="password"
            value={this.state.password}
            onChange={this.handleInputChange}
          />

          <input
            className="button-primary"
            type="submit"
            value="Login"
            onClick={this.login}
          />
        </fieldset>
      </div>
    )
  }
}
export default () => (
  <Query query={userQuery}>{props => <Login {...props} />}</Query>
)
