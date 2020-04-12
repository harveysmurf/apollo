import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { featuresQuery } from '../queries/local'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <Query query={featuresQuery}>
      {({
        data: {
          features: { NEWSLETTER_SUBSCRIBE }
        }
      }) => (
        <div className="footer">
          <div className="container no-gutters">
            <div className="row row-center text-center information">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <i className="fa fa-truck" aria-hidden="true" />
                <b className="uppercase">Безплатна доставка</b> за поръчки над
                50лв
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <i className="fa fa-dropbox" aria-hidden="true" />
                <b className="uppercase">Проверка на пратката</b>
              </div>
            </div>
            {NEWSLETTER_SUBSCRIBE && (
              <div className="row newsletter">
                <h4 className="col-sm-12">Абонирай се за бюлетина ни </h4>
                <br />
                <span className="col-sm-12">
                  И получавай актуалните ни оферти директно на пощата си
                </span>
                <fieldset>
                  <div className="input-group">
                    <input type="email" value="" placeholder="Име" />
                    &nbsp;
                  </div>
                  <div className="input-group">
                    <input type="password" value="" placeholder="Имейл" />
                  </div>
                  <div className="input-group">
                    <input type="button" value="Абонирам се" />
                  </div>
                </fieldset>
              </div>
            )}
          </div>
          <div className="footer-nav">
            <div>
              <h4>Поръчки и доставка</h4>
              <ul>
                {/* <li>
                      <a href="#">Моят акаунт</a>
                    </li> */}
                <li>
                  <Link to="/howtoorder">Как да поръчам онлайн</Link>
                </li>
                <li>
                  <Link to="/delivery">Доставка на прочъките</Link>
                </li>
                <li>
                  <Link to="/reklamacii">Рекламации и жалби</Link>
                </li>
              </ul>
            </div>
            {/* <div className="col-sm-12 col-md-4 col-lg-4">
                  <h4>Връзка с нас</h4>
                  <ul>
                    <li>
                      <a href="#">Контакт</a>
                    </li>
                    <li>
                      <a href="#">Връщане на продукт</a>
                    </li>
                  </ul>
                </div> */}
            <div>
              <h4>Полезна информация</h4>
              <ul>
                <li>
                  <Link to="/about">За нас</Link>
                </li>
                <li>
                  <Link to="/terms">Условия за ползване</Link>
                </li>
                <li>
                  <Link to="/privacy">Лични данни</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </Query>
  )
}

export default Footer
