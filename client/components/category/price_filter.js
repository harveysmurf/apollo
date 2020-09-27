import React, { Component } from 'react'
import InputRange from 'react-input-range'
import { Mutation } from '@apollo/client/react/components'
import { UpdatePrice } from '../../mutations/local'

class PriceFilter extends Component {
  constructor(props) {
    super(props)
    const { price } = this.props
    this.state = {
      ...price
    }
  }
  onChange = value => {
    this.setState({ ...value })
  }
  render() {
    const { updatePrice } = this.props
    return (
      <div>
        <b>Цена</b>
        <div className="slider">
          <InputRange
            formatLabel={value => `${value}лв`}
            maxValue={150}
            minValue={10}
            value={this.state}
            onChange={this.onChange}
            onChangeComplete={values =>
              updatePrice({ variables: { price: values } })
            }
          />
        </div>
      </div>
    )
  }
}

let withFilterMutation = function(WrappedComponent) {
  return ({ price }) => (
    <Mutation mutation={UpdatePrice}>
      {updatePrice => (
        <WrappedComponent updatePrice={updatePrice} price={price} />
      )}
    </Mutation>
  )
}
export default withFilterMutation(PriceFilter)
