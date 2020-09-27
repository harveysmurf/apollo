import { screenSizeQuery } from '../queries/local'
import { useQuery } from '@apollo/client'
import { screens } from '../screen'

export function useScreenSize() {
  const {
    data: { screenSize }
  } = useQuery(screenSizeQuery)

  // in this case useEffect will execute only once because
  // it does not have any dependencies.
  const isPhone = screenSize === screens.phone
  const isMobile = isPhone || screenSize === screens.mobile
  const isSmall = isMobile || screenSize === screens.small
  return {
    isPhone,
    isMobile,
    isSmall,
    screenSize
  }
}
