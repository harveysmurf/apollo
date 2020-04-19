import { screenSizeQuery } from '../queries/local'
import { useQuery } from '@apollo/react-hooks'
import { screens } from '../screen'

export function useScreenSize() {
  const {
    data: { screenSize }
  } = useQuery(screenSizeQuery)

  // in this case useEffect will execute only once because
  // it does not have any dependencies.

  return {
    isMobile: screenSize === screens.mobile,
    screenSize
  }
}
