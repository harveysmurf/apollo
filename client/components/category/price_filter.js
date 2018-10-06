import React, {Component} from 'react'
import InputRange from 'react-input-range'
import { Mutation } from "react-apollo";
import { UpdateFilters } from '../../mutations/local'
import gql from "graphql-tag";

const PriceFilter = ({price, updateFilters}) => (
    <div className='slider'>
        <b>Цена</b>
        <InputRange
            formatLabel={value => `${value}лв`}
            maxValue={150}
            minValue={10}
            value={{...price}}
            onChange={value => updateFilters({variables: {filters: {price: value}}})}
            />
    </div>
)

let withFilterMutation = function(WrappedComponent) {
    return ({price}) => (
        <Mutation mutation={UpdateFilters} >
            {(updateFilters, { data }) => (
                <WrappedComponent updateFilters={updateFilters} price={price}/>
            )}
        </Mutation>
    )
}
export default withFilterMutation(PriceFilter)