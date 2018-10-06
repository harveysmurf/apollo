import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import BagType from './bagtype'
import ColorFilter from './color_filter'
import PriceFilter from './price_filter'

export default class Sidebar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value : {
                min: 15,
                max: 55
            }
        }
    }
    render() {
        console.log(this.props.filters)
        return(
            <div className="col-sm-3 sidebar">
                <div>
                    <BagType category={this.props.category} url={this.props.url} />
                </div>
                <div>
                    <ColorFilter selected={this.props.filters.colors}/>
                </div>
                <div>
                    <PriceFilter price={this.props.filters.price}/>
                </div>
            </div>

        )
    }
}
