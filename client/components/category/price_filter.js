import React, {Component} from 'react'
import InputRange from 'react-input-range'
import { Mutation } from "react-apollo";
import { UpdatePrice } from '../../mutations/local'

const PriceFilter = ({price, updatePrice}) => (
    <div className='slider'>
        <b>Цена</b>
        <InputRange
            formatLabel={value => `${value}лв`}
            maxValue={150}
            minValue={10}
            value={{...price}}
            onChange={value => updatePrice({variables: {price: value}})}
            />
    </div>
)

let withFilterMutation = function(WrappedComponent) {
    return ({price}) => (
        <Mutation mutation={UpdatePrice} >
            {(updatePrice, { data }) => (
                <WrappedComponent updatePrice={updatePrice} price={price}/>
            )}
        </Mutation>
    )
}
export default withFilterMutation(PriceFilter)