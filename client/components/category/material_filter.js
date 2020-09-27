import React from 'react'
import { Mutation } from '@apollo/client/react/components'
import { UpdateMaterials } from '../../mutations/local'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './material_filter.scss'

export const materials = {
  estestvena_koja: 'естествена кожа',
  izkustvena_koja: 'изкуствена кожа',
  textil: 'плат',
  polyester: 'полиестер'
}

const withMaterialMutation = WrappedComponent => props => (
  <Mutation mutation={UpdateMaterials}>
    {updateMaterials => (
      <WrappedComponent updateMaterials={updateMaterials} {...props} />
    )}
  </Mutation>
)
const Material = ({ name, isSelected, toggle }) => {
  return (
    <div className={styles['material-filter']} onClick={toggle}>
      {
        <FontAwesomeIcon
          icon={isSelected ? ['far', 'check-square'] : ['far', 'square']}
        />
      }
      <span>{name}</span>
    </div>
  )
}

const removeFromFilters = (slug, filters) =>
  filters.filter(filter => filter !== slug)

const MaterialFilter = ({ selectedMaterials, updateMaterials }) => {
  const toggleSelected = ({ slug, isSelected }) => () => {
    const materials = isSelected
      ? removeFromFilters(slug, selectedMaterials)
      : [...selectedMaterials, slug]
    updateMaterials({ variables: { materials } })
  }
  return (
    <div className={styles['material-filter-container']}>
      <b className="bottom-spacing-s">Материал</b>
      <div className="filter-content">
        {Object.entries(materials).map(([slug, name]) => {
          const isSelected = selectedMaterials.find(m => m === slug)
          return (
            <Material
              toggle={toggleSelected({ slug, isSelected })}
              key={slug}
              slug={slug}
              name={name}
              isSelected={isSelected}
            />
          )
        })}
      </div>
    </div>
  )
}
export default withMaterialMutation(MaterialFilter)
