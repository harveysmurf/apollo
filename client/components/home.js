import React from 'react'
import Latest from './home/latest'
import { Helmet } from 'react-helmet'
import Presentation from './home/presentation'
import Featured from './home/featured.jsx'
export default () => (
  <div className="confined-container">
    <Helmet>
      <title>
        Дамски Чанти Онлайн | Естествена Кожа | Многообразие от Модели
      </title>
      <meta
        name="description"
        content="Пазарувайте дамски чанти онлайн. Eстествена кожа, официални, ежедневни, вечерни. Разнообразни цветове. Достъпни цени. Срок за връщане до 15 дена!"
      />
    </Helmet>
    <Presentation />
    <Latest />
    <Featured />
  </div>
)
