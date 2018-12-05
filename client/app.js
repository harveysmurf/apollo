// import './test.scss'
import 'font-awesome/scss/font-awesome.scss'
import './scss/test.scss'
import React from 'react'

import {
  BrowserRouter as Router,
  Route,
  Switch
} from 'react-router-dom'

import HomeComponent from './components/home'
import AboutComponent from './components/about'
import LoginComponent from './components/auth/login'
import Header from './components/header'
import Footer from './components/footer'
import MobileNav from './components/header/mobile_nav'
import RouteResolver from './components/routeresolver'
import Cart from './components/cart/cart'
import Checkout from './components/checkout/checkout'

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
              <Switch>
              <Route exact path="/" component={HomeComponent}/>
              <Route path="/about" component={AboutComponent}/>
              <Route path="/login" component={LoginComponent}/>
              <Route path="/cart" component={Cart}/>
              <Route path="/checkout" component={Checkout}/>
              <Route path="/:param*" component={RouteResolver}/>
              </Switch>
              {/* <Route path="/damski-chanti" component={CategoryComponent}/> */}
              
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
