import './scss/test.scss?raw'
import React from 'react'

import { Route, Switch } from 'react-router-dom'

import SearchComponent from './components/search/search'
import HomeComponent from './components/home'
import AboutComponent from './components/about/about'
import LoginComponent from './components/auth/login'
import RegistrationComponent from './components/auth/signup'
import Header from './components/header'
import Footer from './components/footer'
import MobileNav from './components/header/mobile_nav'
import Cart from './components/cart/cart'
import Checkout from './components/checkout/checkout'
import ProductContainer from './components/product/product_container'
import TermsComponent from './components/terms.jsx'
import DeliveryComponent from './components/delivery.jsx'
import ReklamaciiComponent from './components/reklamacii.jsx'
import PrivacyComponent from './components/privacy.jsx'
import HowToOrderComponent from './components/howtoorder.jsx'
import CheckoutSuccess from './components/checkout/checkoutsuccess.jsx'
import Profile from './components/profile/profile.jsx'
import CategoryContainer from './components/category/category_container'
import { useScreenSize } from './hooks'
import ResetPasswordPage from './components/auth/reset-password'
import ForgottenPasswordPage from './components/auth/forgotten-password'
import { useQuery } from '@apollo/client'
import { featuresQuery } from './queries/local'
const App = () => {
  const { isMobile } = useScreenSize()
  const {
    data
  } = useQuery(featuresQuery)
  const LOGIN_ENABLED = data && data.features.LOGIN_ENABLED
  return (
    <div>
      <div className="app-container">
        {!isMobile && <Header />}
        <div className="container main-container">
          <Switch>
            <Route exact path="/" component={HomeComponent} />
            <Route path="/about" component={AboutComponent} />
            <Route path="/checkoutsuccess" component={CheckoutSuccess} />
            <Route path="/terms" component={TermsComponent} />
            <Route path="/delivery" component={DeliveryComponent} />
            <Route path="/reklamacii" component={ReklamaciiComponent} />
            <Route path="/privacy" component={PrivacyComponent} />
            <Route path="/howtoorder" component={HowToOrderComponent} />
            <Route path="/cart" component={Cart} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/search" component={SearchComponent} />
            {LOGIN_ENABLED && (
              <>
                <Route path="/register" component={RegistrationComponent} />
                <Route path="/profile" component={Profile} />
                <Route path="/login" component={LoginComponent} />
                <Route
                  path="/forgotten-password"
                  component={ForgottenPasswordPage}
                />
                <Route
                  path="/reset-password/:resetPassToken"
                  component={ResetPasswordPage}
                />
              </>
            )}
            <Route
              path="/:seoSlug/:model([0-9]{4}[a-zA-Z]{2})"
              component={ProductContainer}
            />
            <Route path="/:categorySlug" component={CategoryContainer} />
          </Switch>
        </div>
        <Footer />
        {isMobile && <MobileNav />}
      </div>
    </div>
  )
}

export default App
