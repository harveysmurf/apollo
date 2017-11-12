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
import MobileNav from './components/header/mobile_nav'

const screenSize = {
  md : 768,
  lg : 1280
}

class App extends React.Component {
  constructor(props) {
    super(props)

    let body = document.getElementsByTagName("body")[0];

    this.onScreenSizeChange = this.onScreenSizeChange.bind(this)
    body.onresize = this.onScreenSizeChange
    this.state = {
      screen : this.getScreenSize()
    }
  }

  onScreenSizeChange() {
    let screenSize = this.getScreenSize()
    if(this.state != screenSize)
      this.setState({
        screen: screenSize
      })
  }

  getScreenSize() {
    let width = window.innerWidth
      || document.documentElement.clientWidth
      || document.body.clientWidth;
    if(width > 768 && width < 1280)
      return 'm'
    else if(width > 1280)
      return 'l'
    else
      return 's'
  }
  render() {
    let size = this.state.screen
    return <div>
        <div className="app-container">
          <Router>
            <div>
              {size != 's' && 
              <Header size={size}/>
              }
              <div className="container main-container">
              <Route exact path="/" component={HomeComponent}/>
              <Route path="/about" component={AboutComponent}/>
              <Route path="/damski-chanti" component={CategoryComponent}/>
              <Route path="/login" component={LoginComponent}/>
              </div>
              <Footer/>
              {size == 's' && 
              <MobileNav size={size}/>
              }
            </div>
          </Router>
        </div>
      </div>
  }
}

export default App
