import { screenSizeQuery } from './queries/local'

export const screens = {
  phone: 'phone',
  mobile: 'mobile',
  small: 'small',
  tablet: 'tablet',
  desktop: 'desktop'
}
const { phone, mobile, small, tablet, desktop } = screens
const screenSizes = {
  [mobile]: '500px',
  [small]: '767px',
  [tablet]: '960px',
  [desktop]: '1280px'
}

const mediaQueryDesktop = () =>
  window.matchMedia(`(min-width: ${screenSizes[desktop]})`)

const mediaQueryTablet = () =>
  window.matchMedia(`(min-width: ${screenSizes[tablet]})`)

const mediaQuerySmall = () =>
  window.matchMedia(`(min-width: ${screenSizes[small]})`)

const mediaQueryMobile = () =>
  window.matchMedia(`(min-width: ${screenSizes[mobile]})`)

export const getScreenSize = () => {
  if (mediaQueryDesktop().matches) {
    return desktop
  } else if (mediaQueryTablet().matches) {
    return tablet
  } else if (mediaQuerySmall().matches) {
    return small
  } else if (mediaQueryMobile().matches) {
    return mobile
  } else {
    return phone
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
  console.log('ad listener')
  mediaQueryDesktop().addListener(() => {
    console.log('h3')
    setScreenSize(client, getScreenSize())
  })

  mediaQueryTablet().addListener(() => {
    setScreenSize(client, getScreenSize())
  })

  mediaQuerySmall().addListener(() => {
    setScreenSize(client, getScreenSize())
  })

  mediaQueryMobile().addListener(() => {
    setScreenSize(client, getScreenSize())
  })
}
