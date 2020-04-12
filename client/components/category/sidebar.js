import React from 'react'
import BagType from './bagtype'
import ColorFilter from './color_filter'
import PriceFilter from './price_filter'
import MaterialFilter from './material_filter'
// TODO hide filters on mobile
// TODO sidebar fixed on desktop
export default ({ className, filters, category }) => (
  <div className={`${className} sidebar`}>
    {category && (
      <div>
        <BagType category={category} />
      </div>
    )}
    <div>
      <ColorFilter selected={filters.colors} />
    </div>
    <div>
      <PriceFilter price={filters.price} />
    </div>
    <div>
      <MaterialFilter selectedMaterials={filters.materials} />
    </div>
  </div>
)
