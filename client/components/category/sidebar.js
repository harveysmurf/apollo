import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import InputRange from 'react-input-range'
import BagType from './bagtype'
import ColorFilter from './color_filter'

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
        return(
            <div className="col-sm-3 sidebar">
                <div>
                    <BagType category={this.props.category} url={this.props.url} />
                </div>
                <div>
                    <ColorFilter selected={this.props.filters.colors}/>
                </div>

                <div>
                    <div className='slider'>
                        <b>Цена</b>
                        <InputRange
                            formatLabel={value => `${value}лв`}
                            maxValue={150}
                            minValue={10}
                            value={this.state.value}
                            onChange={value => this.setState({ value })}
                            />
                    </div>
                </div>
            </div>

        )
    }
}
