import React from 'react'
import { Mutation } from 'react-apollo'
import { UpdateMaterials } from '../../mutations/local'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styles from './material_filter.scss'

const materialsList = [
  {
    slug: 'estestvena-koja',
    name: 'ествествена кожа'
  },
  {
    slug: 'izkustvena-koja',
    name: 'Еко кожа'
  },
  {
    slug: 'textil',
    name: 'плат'
  },
  {
    slug: 'silikon',
    name: 'силикон'
  },
  {
    slug: 'poliester',
    name: 'полиестер'
  }
]

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
      <span>
        {<FontAwesomeIcon icon={isSelected ? 'check-square' : 'square'} />}
      </span>
      <div>{name}</div>
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
      <h4 className="bottom-spacing-s">Материал</h4>
      {materialsList.map(({ slug, name }, i) => {
        const isSelected = selectedMaterials.find(m => m === slug)
        return (
          <Material
            toggle={toggleSelected({ slug, isSelected })}
            key={i}
            slug={slug}
            name={name}
            isSelected={isSelected}
          />
        )
      })}
    </div>
  )
}
export default withMaterialMutation(MaterialFilter)
