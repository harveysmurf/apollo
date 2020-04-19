import { screenSizeQuery } from './queries/local'

export const screens = {
  mobile: 'mobile',
  tablet: 'tablet',
  desktop: 'desktop'
}
const { mobile, tablet, desktop } = screens
const screenSizes = {
  [mobile]: '500px',
  [tablet]: '960px',
  [desktop]: '1280px'
}

const mediaQueryDesktop = () =>
  window.matchMedia(`(min-width: ${screenSizes[mobile]})`)

const mediaQueryTablet = () =>
  window.matchMedia(`(min-width: ${screenSizes[tablet]})`)

export const getScreenSize = () => {
  if (mediaQueryDesktop().matches) {
    return desktop
  } else if (mediaQueryTablet().matches) {
    return tablet
  } else {
    return mobile
  }
}

const setScreenSize = (client, screenSize) => {
  client.writeQuery({
    query: screenSizeQuery,
    data: {
      screenSize
    }
  })
}
export function subscribeClientToScreenSizeChange(client) {
  mediaQueryDesktop().addListener(() => {
    setScreenSize(client, getScreenSize())
  })

  mediaQueryTablet().addListener(() => {
    setScreenSize(client, getScreenSize())
  })
}
