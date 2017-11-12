import React, {Component} from 'react'
import {graphql } from 'react-apollo';
import gql from 'graphql-tag'
import { Link} from 'react-router-dom'
import { withRouter } from 'react-router'
import Dropdown from '../utilities/dropdown'


const withLoggedInUserData = graphql(gql`query { loggedInUser { name } }`);



class UserTop extends Component {
    render() {
        if(this.props.loading)
            return (<div>Loading...</div>)

        const user = this.props.data.loggedInUser
            return (
                <div>
                    <Dropdown className="user-link" button_content={
                            <div>
                                <i className="fa fa-phone" aria-hidden="true"></i>
                                <span>
                                За връзка
                                </span>
                            </div>
                            }
                            dropdown_data={
                                <div>
                                <div>0987 23 34 32</div>
                                <div>2323 34 32 23</div>
                                </div>
                            }
                    />
                    {!user &&
                        <Link to="/register" className="user-link" >
                        <i className="fa fa-user-plus" aria-hidden="true"></i>
                        Регистрация
                        </Link>
                    }
                    {!user &&
                        <Link to="/login" className="user-link" >
                        <i className="fa fa-sign-in" aria-hidden="true"></i>
                        Вход
                        </Link>
                    }
                    {user &&
                    <a href="#" className="user-link" >
                        <i className="fa fa-user" aria-hidden="true"></i>
                        <span >
                        Профил
                        </span>
                    </a>
                    }

                    {user && 
                    <a href="#"  className="favorites user-link">
                        <i className="fa fa-heart" aria-hidden="true" ></i>
                        Любими
                    </a>
                    }
                    <a href="#" className="top-cart user-link">
                        <i className="fa fa-shopping-cart" aria-hidden="true" ></i>
                        Количка
                    </a>
                </div>
            )
    }
}

let UserTopWithData = withLoggedInUserData(UserTop)
export default UserTopWithData
