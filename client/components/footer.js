import React, {Component} from 'react'

const Footer = () => {
    return (
    <div className="footer">
        <div className="container">
            <div className="row row-center text-center information">
                <div className="col-lg-6 col-md-6 col-sm-12">
                <i className="fa fa-truck" aria-hidden="true"></i>
                <b className="uppercase">Безплатна доставка</b> за поръчки над 50лв
                </div>
                <div className="col-lg-6 col-md-6 col-sm-12">
                <i className="fa fa-dropbox" aria-hidden="true"></i>
                    <b className="uppercase">Проверка на пратката</b>
                </div>
            </div>
            <div className="row newsletter">
                <h4 className="col-sm-12">Абонирай се за бюлетина ни </h4><br/>
                <span className="col-sm-12">И получавай актуалните ни оферти директно на пощата си</span>
                <fieldset>
                <div className="input-group"><input type="email" value="" placeholder="Име"/>&nbsp;</div>
                <div className="input-group"><input type="password" value=""  placeholder="Имейл"/></div>
                <div className="input-group"><input type="button" value="Абонирам се"/></div>
                </fieldset>
            </div>
        </div>
        <div className="footer-nav">
            <div className="container">
                <div className="row">
                    <div className="col-sm-12 col-md-4 col-lg-4">
                        <h4>Поръчки и доставка</h4>
                        <ul>
                            <li><a href="#">Моят акаунт</a></li>
                            <li><a href="#">Как да поръчам онлайн</a></li>
                            <li><a href="#">Доставка на прочъките</a></li>
                            <li><a href="#">Проверка на пратката</a></li>
                        </ul>
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-4">
                        <h4>Връзка с нас</h4>
                        <ul>
                            <li><a href="#">Контакт</a></li>
                            <li><a href="#">Лоялни клиенти</a></li>
                            <li><a href="#">Връщане на продукт</a></li>
                            <li><a href="#">Рекламации и жалби</a></li>
                        </ul>
                    </div>
                    <div className="col-sm-12 col-md-4 col-lg-4">
                        <h4>Damskichanti.com</h4>
                        <ul>
                            <li><a href="#">Връзка с нас</a></li>
                            <li><a href="#">Условия за ползване</a></li>
                            <li><a href="#">Лични данни</a></li>
                            <li><a href="#">Често задавани въпроси</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}

export default Footer

