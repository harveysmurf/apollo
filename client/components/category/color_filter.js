import React, { Component } from 'react'
import { Mutation } from "react-apollo";
import gql from "graphql-tag";


const UpdateFilters = gql`
    mutation updateFilters($filters: FilterInput) {
        updateFilters(filters: $filters) @client
    }
`

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
    selectColor() {
        console.log('select color')
    }
    renderLink(color, i) {
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
            <a 
                onClick={(e)=> this.selectColor}
                href="#"
                style={{
                    display: 'block',
                    height: '100%',
                    textAlign: 'center',
                }}
                className={active?'active':''} 
                >
                    <i style={{
                        color: check_color,
                        verticalAlign: 'middle'
                    }} className="fa fa-check" aria-hidden="true"></i>
                </a>
            </li>
        )
    }

    clearFilter() {
        this.props.updateFilters({
            variables: {
                filters: {
                    material: '',
                    colors: [],
                    styles: []
                }
            }
        })
    }
    render() {
        return (
        <ul className="color-filter">
            <div className="row">
                <div className="col-sm-6">
                    <b>Цвят</b>
                </div>
                <div className="col-sm-6 text-right">
                    <span onClick={ e => this.clearFilter()}>Изчисти</span>
                </div>
            </div>
            {colors.map((color,i) => this.renderLink(color, i))}
        </ul>
        )
    }
}

let withColorMutation = function(WrappedComponent) {
    return ({selected}) => (
        <Mutation mutation={UpdateFilters} >
            {(updateFilters, { data }) => (
                <WrappedComponent updateFilters={updateFilters} selected={selected}/>
            )}
        </Mutation>
    )
}
export default withColorMutation(ColorFilter)