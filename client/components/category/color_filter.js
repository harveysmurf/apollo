import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Mutation } from 'react-apollo'
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { UpdateColors } from '../../mutations/local'

const colors = [
  { slug: 'sin', name: 'Сини', hex: '#0000ff' },
  { slug: 'cherven', name: 'Червени', hex: '#ff0000' },
  { slug: 'cheren', name: 'Черни', hex: '#000000' },
  { slug: 'byal', name: 'Бели', hex: '#ffffff' },
  { slug: 'jalt', name: 'Жълти', hex: 'yellow' },
  { slug: 'siv', name: 'Сиви', hex: '#808080' },
  { slug: 'bejov', name: 'Бежови', hex: '#f5f5dc' },
  { slug: 'kafyav', name: 'Кафяви', hex: '#A52A2A' },
  { slug: 'multi', name: 'Шарени', hex: '#f0f080' }
]

class ColorFilter extends Component {
  selectColor(slug) {
    const selected = [...this.props.selected]
    const index = selected.indexOf(slug)
    if (index === -1) {
      selected.push(slug)
    } else {
      selected.splice(index, 1)
    }
    this.props.updateColors({ variables: { colors: [...selected] } })
  }
  renderLink(color, i) {
    let active = false
    let check_color = 'white'
    switch (color.slug) {
      case 'byal':
      case 'jalt':
      case 'bejov':
        check_color = 'black'
        break
    }
    if (_.includes(this.props.selected, color.slug)) active = true

    return (
      <div
        className="color-link"
        key={i}
        onClick={e => {
          e.preventDefault()
          this.selectColor(color.slug)
        }}
        style={{
          backgroundColor: color.hex,
          color: check_color
        }}
      >
        <FontAwesomeIcon icon="check" />
      </div>
    )
  }

  clearFilter() {
    this.props.updateColors({
      variables: {
        colors: []
      }
    })
  }
  render() {
    return (
      <div className="color-filter">
        <div className="title-row">
          <b className="bottom-spacing-s">Цвят</b>
          <span onClick={_e => this.clearFilter()}>Изчисти</span>
        </div>
        <div>{colors.map((color, i) => this.renderLink(color, i))}</div>
      </div>
    )
  }
}
ColorFilter.propTypes = {
  selected: PropTypes.arrayOf(PropTypes.string),
  updateColors: PropTypes.func
}

const withColorMutation = WrappedComponent => ({ selected }) => (
  <Mutation mutation={UpdateColors}>
    {updateColors => (
      <WrappedComponent updateColors={updateColors} selected={selected} />
    )}
  </Mutation>
)
export default withColorMutation(ColorFilter)
