import React, { useState } from 'react'
import BagType from './bagtype'
import ColorFilter from './color_filter'
import PriceFilter from './price_filter'
import MaterialFilter from './material_filter'
import { useScreenSize } from '../../hooks'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// TODO hide filters on mobile
// TODO sidebar fixed on desktop
const MobileSideBar = ({ category, filters }) => (
  <div className="col-sm-12 devider no-gutters sidebar">
    <Collapsible title="Филтри" opened={false}>
      <>
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
      </>
    </Collapsible>
  </div>
)

const Collapsible = ({ children, title, opened = false }) => {
  const [open, setOpen] = useState(opened)
  const toggleOpen = () => setOpen(!open)
  return (
    <div className="collapsible">
      <div onClick={toggleOpen} className="title bottom-spacing-m">
        <b>{title}</b>
        <span>
          {open ? (
            <FontAwesomeIcon icon="minus" />
          ) : (
            <FontAwesomeIcon icon="plus" />
          )}
        </span>
      </div>
      {open && <div>{children}</div>}
    </div>
  )
}

const DesktopSideBar = ({ category, filters }) => (
  <div className="col-md-3 sidebar">
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
export default ({ filters, category }) => {
  const { isSmall } = useScreenSize()
  return isSmall ? (
    <MobileSideBar filters={filters} category={category} />
  ) : (
    <DesktopSideBar filters={filters} category={category} />
  )
}
