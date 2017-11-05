import React, {Component} from 'react'
import axios from 'axios'

export default class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            email: '',
            password: '',
            error: false

        }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.login = this.login.bind(this)
    }

    login() {
        axios.post('http://localhost:4000/login', {
            email: this.state.email,
            password: this.state.password
        },
        {
            withCredentials: true
        }
    ).then((res) => {
            window.location = '/'
        }).catch((err) => {
            console.log('hiiii')
            this.setState({error: true})
        })
    }


    handleInputChange(event) {
        const target = event.target;
        const value = target.value
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    render() {
        let error = this.state.error
        return (
            <div>
                {error &&
                <span>Unsuccesfull login</span>
                }
                <fieldset>
                    <label htmlFor="nameField">Email</label>
                    <input type="text" 
                    placeholder="example@abv.net" 
                    name="email"
                    value={this.state.email}
                    onChange={this.handleInputChange}
                    />

                    <label htmlFor="nameField">Password</label>

                    <input type="text" 
                    placeholder="type your password" 
                    name="password"
                    value={this.state.password}
                    onChange={this.handleInputChange}
                    />

                    <input className="button-primary" type="submit" value="Login" onClick={this.login}/>
                 </fieldset> 
            </div>
        )
    }
}