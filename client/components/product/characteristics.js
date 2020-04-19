import React from 'react'

export default ({ material, style, dimensions }) => {
  const [height, width, bottom, handle] = dimensions || []
  if ([height, width, bottom, handle, material, style].every(Boolean)) {
    return null
  }

  return (
    <>
      <h4 className="bottom-spacing-s">Характеристики</h4>
      <table className="horizontal no-gutters">
        <thead>
          <tr>
            {height && <th>Височина</th>}
            {width && <th>Широчина</th>}
            {bottom && <th>Дъно</th>}
            {handle && <th>Дръжка</th>}
            {material && <th>Материал</th>}
            {style && <th>Стил</th>}
          </tr>
        </thead>
        <tbody>
          <tr>
            {height && <td data-label="Височина">{height}</td>}
            {width && <td data-label="Широчина">{width}</td>}
            {bottom && <td data-label="Дъно">{bottom}</td>}
            {handle && <td data-label="Дръжка">{handle}</td>}
            {material && <td data-label="Материал">{material}</td>}
            {style && <td data-label="Стил">{style}</td>}
          </tr>
        </tbody>
      </table>
    </>
  )
}
