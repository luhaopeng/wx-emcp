import MobileDetect from 'mobile-detect'
const detect = new MobileDetect(window.navigator.userAgent)

const isDev = process.env.NODE_ENV === 'development'
const isProd = process.env.NODE_ENV === 'production'
const isTest = process.env.NODE_ENV === 'test'

const isWeChat = detect.match(/micromessenger/i)
const isIOS = detect.match(/iphone|ipad|ipod/i)

const appid = 'wx9881a033828453e0'

const devUrl = 'http://localhost:8080/wxemcp'
const testUrl = 'http://testpay.pwpa.energyman.cn:8022/wxemcp'
const prodUrl = 'http://hl.energyman.cn/wxemcp'

const devBase = '/'
const testBase = '/wxemcp/test'
const prodBase = '/wxemcp/wx'

const testRedirect = `${prodUrl}/test/`
const prodRedirect = `${prodUrl}/wx/`
const authUrl = (appId = appid, state = 'none') => {
  return (
    'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
    appId +
    '&redirect_uri=' +
    encodeURIComponent(isTest ? testRedirect : prodRedirect) +
    '&response_type=code&state=' +
    state +
    '&scope=snsapi_base#wechat_redirect'
  )
}

const urlPrefix = isDev ? devUrl : isTest ? testUrl : prodUrl
const basename = isDev ? devBase : isTest ? testBase : prodBase

export {
  urlPrefix,
  basename,
  authUrl,
  prodUrl,
  isWeChat,
  isIOS,
  isDev,
  isProd,
  isTest,
}
