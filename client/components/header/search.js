import React, {Component} from 'react'


export default class Search extends Component {
    render() {
        return (
            <div className="search">
                <div className="input-control-addon">
                    <input type="text" placeholder="Търси"/>
                    <button className="button">
                        <i className="fa fa-search" aria-hidden="true"></i>
                    </button>
                </div>
            </div>
        )
    }
}

