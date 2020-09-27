import { useQuery } from '@apollo/client'
import React from 'react'
import { cartQuery } from '../../queries/remote'

export default () => {
  const { data } = useQuery(cartQuery, { fetchPolicy: 'network-only' })
  console.log(data)
  return (
    <div className="row">
      <div className="col-sm-12 bottom-spacing-xl">
        <h1 className="text-center">Успешна поръчка !</h1>
      </div>
      <div className="col-sm-12">
        <p className="bottom-spacing-m">
          Очаквайте обаждане от наш служитеш за потвърждаване на поръчката.
        </p>
        <p>
          Детайли за вашата поръчка бяха изпратени на предоставеният от вас
          имейл.
        </p>
      </div>
    </div>
  )
}
