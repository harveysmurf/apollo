// import './test.scss'
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
import Footer from './components/footer'
import CategoryComponent from './components/category/category_container'

class App extends React.Component {
  render() {
    return <div>
        <div className="app-container">
          <Router>
            <div>
              <Header/>
              <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/damski-chanti">Home</Link></li>
                <li><Link to="/about">About</Link></li>
                <li><Link to="/login">About</Link></li>
              </ul>
              <hr/>
              <Route exact path="/" component={HomeComponent}/>
              <Route path="/about" component={AboutComponent}/>
              <Route path="/damski-chanti" component={CategoryComponent}/>
              <Route path="/login" component={LoginComponent}/>

              <Footer/>
            </div>
          </Router>
        </div>
      </div>
  }
}

export default App
