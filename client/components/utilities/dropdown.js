import React, { Component } from 'react'

export default class Dropdown extends Component {
  constructor(props) {
    super(props)
    this.state = {
      open: false
    }
    this.toggle = this.toggle.bind(this)
  }
  toggle() {
    this.setState({
      open: !this.state.open
    })
  }
  render() {
    let status = this.state.open
    let button_content = this.props.button_content
    let dropdown_data = this.props.dropdown_data
    let dropdownClass = status ? 'open' : ''
    let className = 'dropdown-toggle ' + this.props.className || ''
    return (
      <div onClick={this.toggle} className={className}>
        {button_content}
        <div className={'dropdown ' + dropdownClass}>{dropdown_data}</div>
      </div>
    )
  }
}
