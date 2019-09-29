import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import BagType from './bagtype'
import ColorFilter from './color_filter'
import PriceFilter from './price_filter'
import MaterialFilter from './material_filter'

export default ({ className, filters, category, url }) => (
  <div className={`${className} sidebar`}>
    {category && (
      <div>
        <BagType category={category} url={url} />
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
