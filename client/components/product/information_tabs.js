import React, { Component } from 'react'

export default class InformationTabs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedTab: '0'
    }
    this.tabClicked = this.tabClicked.bind(this)
  }

  tabClicked(e) {
    this.setState({
      selectedTab: e.target.dataset.id
    })
  }

  render() {
    let selected = this.state.selectedTab
    return (
      <div>
        <div className="product-tabs">
          <span
            className={selected == '0' ? 'selected' : ''}
            onClick={this.tabClicked}
            data-id="0"
          >
            Характеристики
          </span>
          <span className="tab-devider">/</span>
          <span
            className={selected == '1' ? 'selected' : ''}
            onClick={this.tabClicked}
            data-id="1"
          >
            Основна Информация
          </span>
        </div>
        <div className="tab-container">
          <div className={selected == '0' ? 'selected' : ''}>test1</div>
          <div className={selected == '1' ? 'selected' : ''}>test2</div>
        </div>
      </div>
    )
  }
}
