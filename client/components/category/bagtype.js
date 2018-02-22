import React, {Component} from 'react'
import { Link } from 'react-router-dom'
export default class BagType extends Component  {
    render() {
        if(this.props.category.subcategories.length < 1)
            return (null)
        return (
            <ul>
                <b>Тип</b>
                {this.props.category.subcategories.map((t, i) => {
                    return (
                        <li key={i}><Link to={`${this.props.category.slug}/${t.slug}`}>{t.name}</Link></li>
                    )
                })}
            </ul>
        )
    }
}