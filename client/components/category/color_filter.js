import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import urijs from 'urijs'
import queryString from 'query-string'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router'

const colors = [
    {slug: 'sin', name:'Сини', hex: '#0000ff'},
    {slug: 'cherven', name:'Червени', hex: '#ff0000'},
    {slug: 'cheren', name:'Черни', hex: '#000000'},
    {slug: 'byal', name:'Бели', hex: '#ffffff'},
    {slug: 'jalt', name:'Жълти', hex: 'yellow'},
    {slug: 'siv', name:'Сиви', hex: '#808080'},
    {slug: 'bejov', name:'Бежови', hex: '#f5f5dc'},
    {slug: 'kafyav', name: 'Кафяви', hex: '#A52A2A'}
]


class ColorFilter extends Component {
    setUrl(value, query) {
        query.colors = value
        return this.props.location.pathname + '?' + queryString.stringify(query)

    }
    renderLink(color, query, i) {
        let active = false
        let check_color = 'white'
        switch(color.slug) {
            case 'byal':
            case 'jalt':
            case 'bejov':
                check_color = 'black';
                break;
        }
        if(_.includes(this.props.selected, color.slug))
            active = true
        
        return (
            <li 
            key={i}
            style={{
                display: 'inline-block',
                border: '1px solid black',
                backgroundColor: color.hex,
                width: 30,
                height: 30,
                borderRadius: 50
            }}
            >
            <Link 
                style={{
                    display: 'block',
                    height: '100%',
                    textAlign: 'center',
                }}
                className={active?'active':''} 
                to={this.setUrl(color.slug, query)}>
                    <i style={{
                        color: check_color,
                        verticalAlign: 'middle'
                    }} className="fa fa-check" aria-hidden="true"></i>
                </Link>
            </li>
        )
    }

    clearFilter(query) {
        delete query.colors
        if(_.isEmpty(query)) 
            this.props.history.push(this.props.location.pathname)
        else {
            let url =  this.props.location.pathname + '?' + queryString(query)
            this.props.history.push(url)
        }
    }
    render() {
        const uri = urijs(window.location)
        const  query = queryString.parse((this.props.location.search))

        // console.log(this.props)
        // console.log(urijs(window.location))
        return (
        <ul className="color-filter">
            <div className="row">
                <div className="col-sm-6">
                    <b>Цвят</b>
                </div>
                <div className="col-sm-6 text-right">
                    <span onClick={(e)=>this.clearFilter(Object.assign({},query))}>Изчисти</span>
                </div>
            </div>
            {colors.map((color,i) => this.renderLink(color, Object.assign({},query), i))}
        </ul>
        )
    }
}
ColorFilter.propTypes = {
        match: PropTypes.object.isRequired,
        location: PropTypes.object.isRequired,
        history: PropTypes.object.isRequired
}
export default withRouter(ColorFilter)