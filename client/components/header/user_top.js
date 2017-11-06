import React, {Component} from 'react'
import {graphql } from 'react-apollo';
import gql from 'graphql-tag'
import { Link} from 'react-router-dom'
import { withRouter } from 'react-router'

const styles = {
    marginRight(amount) {
        return {
            marginRight: amount
        }
    }
}


const withLoggedInUserData = graphql(gql`query { loggedInUser { name } }`);



class UserTop extends Component {
    render() {
        const user = this.props.data.loggedInUser
            return (
                <div>
                    {!user &&
                        <Link to="/register" style={styles.marginRight(10)}>Регистрация</Link>
                    }
                    {user &&
                    <a href="#" className="dropdown" style={styles.marginRight(10)}>
                        <i className="fa fa-user" aria-hidden="true" style={styles.marginRight(3)}></i>
                        <span style={styles.marginRight(3)}>
                        Профил
                        </span>
                    </a>
                    }

                    {user && 
                    <a href="#" className="favorites" style={styles.marginRight(10)}>
                        <i className="fa fa-heart" aria-hidden="true" style={styles.marginRight(3)}></i>
                        Любими
                    </a>
                    }
                    <a href="#" className="top-cart">
                        <i className="fa fa-shopping-cart" aria-hidden="true" style={styles.marginRight(3)}></i>
                        Количка
                    </a>
                </div>
            )
    }
}

let UserTopWithData = withLoggedInUserData(UserTop)
export default UserTopWithData
