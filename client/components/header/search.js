import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { withRouter } from 'react-router'

class Search extends Component {
  state = {
    input: ''
  }
  handleClick = () => {
    this.props.history.push(`/search?q=${this.state.input}`)
  }
  render() {
    return (
      <div className="search">
        <div className="input-control-addon">
          <input
            aria-label="търсене"
            type="text"
            value={this.state.input}
            onChange={({ target: { value } }) =>
              this.setState({ input: value })
            }
            placeholder="Търси"
          />
          <button
            aria-label="търси"
            onClick={this.handleClick}
            className="button"
          >
            <FontAwesomeIcon icon="search" />
          </button>
        </div>
      </div>
    )
  }
}

export default withRouter(Search)
