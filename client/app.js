// import './test.scss'

import './scss/test.scss?raw'
import React from 'react'

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import SearchComponent from './components/search/search'
import HomeComponent from './components/home'
import AboutComponent from './components/about'
import LoginComponent from './components/auth/login'
import RegistrationComponent from './components/auth/signup'
import Header from './components/header'
import Footer from './components/footer'
import MobileNav from './components/header/mobile_nav'
import RouteResolver from './components/routeresolver'
import Cart from './components/cart/cart'
import Checkout from './components/checkout/checkout'
import ProductContainer from './components/product/product_container'
import TermsComponent from './components/terms.jsx'
import DeliveryComponent from './components/delivery.jsx'
import ReklamaciiComponent from './components/reklamacii.jsx'
import PrivacyComponent from './components/privacy.jsx'
import HowToOrderComponent from './components/howtoorder.jsx'

class App extends React.Component {
  constructor(props) {
    super(props)

    let body = document.getElementsByTagName('body')[0]

    this.onScreenSizeChange = this.onScreenSizeChange.bind(this)
    body.onresize = this.onScreenSizeChange
    this.state = {
      screen: this.getScreenSize()
    }
  }

  onScreenSizeChange() {
    let screenSize = this.getScreenSize()
    if (this.state != screenSize)
      this.setState({
        screen: screenSize
      })
  }

  getScreenSize() {
    let width =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth
    if (width > 768 && width < 1280) return 'm'
    else if (width > 1280) return 'l'
    else return 's'
  }
  render() {
    let size = this.state.screen
    return (
      <div>
        <Router>
          <div className="app-container">
            {size != 's' && <Header size={size} />}
            <div className="container main-container">
              <Switch>
                <Route exact path="/" component={HomeComponent} />
                <Route path="/about" component={AboutComponent} />
                <Route path="/terms" component={TermsComponent} />
                <Route path="/delivery" component={DeliveryComponent} />
                <Route path="/reklamacii" component={ReklamaciiComponent} />
                <Route path="/privacy" component={PrivacyComponent} />
                <Route path="/howtoorder" component={HowToOrderComponent} />
                <Route path="/login" component={LoginComponent} />
                <Route path="/register" component={RegistrationComponent} />
                <Route path="/cart" component={Cart} />
                <Route path="/checkout" component={Checkout} />
                <Route path="/search" component={SearchComponent} />
                <Route path="/profile" component={() => <h3>Profile</h3>} />
                <Route
                  path="/:seoSlug/:model([a-zA-Z]{2}[0-9]{4})"
                  component={ProductContainer}
                />
                <Route path="/:param*" component={RouteResolver} />
              </Switch>
              {/* <Route path="/damski-chanti" component={CategoryComponent}/> */}
            </div>
            <Footer />
            {size == 's' && <MobileNav size={size} />}
          </div>
        </Router>
      </div>
    )
  }
}

export default App
