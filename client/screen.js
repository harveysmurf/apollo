import { screenSizeQuery } from './queries/local'

export const screens = {
  mobile: 'mobile',
  small: 'small',
  tablet: 'tablet',
  desktop: 'desktop'
}
const { mobile, small, tablet, desktop } = screens
const screenSizes = {
  [mobile]: '500px',
  [small]: '767px',
  [tablet]: '960px',
  [desktop]: '1280px'
}

const mediaQueryDesktop = () =>
  window.matchMedia(`(min-width: ${screenSizes[mobile]})`)

const mediaQueryTablet = () =>
  window.matchMedia(`(min-width: ${screenSizes[tablet]})`)

const mediaQuerySmall = () =>
  window.matchMedia(`(min-width: ${screenSizes[small]})`)

export const getScreenSize = () => {
  if (mediaQueryDesktop().matches) {
    return desktop
  } else if (mediaQueryTablet().matches) {
    return tablet
  } else if (mediaQuerySmall().matches) {
    return small
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

  mediaQuerySmall().addListener(() => {
    setScreenSize(client, getScreenSize())
  })
}
