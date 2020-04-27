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
        <div className="bottom-spacing-m">
          <BagType category={category} />
        </div>
        <div className="devider bottom-spacing-m" />
      </div>
    )}
    <div className="bottom-spacing-m">
      <ColorFilter selected={filters.colors} />
    </div>
    <div className="devider bottom-spacing-m" />
    <div className="bottom-spacing-m">
      <PriceFilter price={filters.price} />
    </div>
    <div className="devider bottom-spacing-m" />
    <div className="bottom-spacing-m">
      <MaterialFilter selectedMaterials={filters.materials} />
    </div>
    <div className="devider" />
  </div>
)
