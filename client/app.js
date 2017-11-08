// import './test.scss'
import 'mini.css/src/flavors/mini-default.scss'
import 'font-awesome/scss/font-awesome.scss'
import './scss/test.scss'
import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import HomeComponent from './components/home'
import AboutComponent from './components/about'
import LoginComponent from './components/auth/login'
import Header from './components/header'


class App extends React.Component {
  render() {
    return <div>
        <div className="app-container">
          <Router>
            <div>
              <Header/>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/login">About</Link></li>
              </ul>
              <hr/>
              <Route exact path="/" component={HomeComponent}/>
              <Route path="/about" component={AboutComponent}/>
              <Route path="/login" component={LoginComponent}/>
            </div>
          </Router>
        </div>
      </div>
  }
}

export default App
