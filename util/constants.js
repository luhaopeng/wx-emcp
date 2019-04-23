import MobileDetect from 'mobile-detect'
const detect = new MobileDetect(window.navigator.userAgent)

// env
const isDev = process.env.NODE_ENV === 'development'
const isTest = process.env.NODE_ENV === 'test'

// platform
const isWeChat = detect.match(/micromessenger/i)
let isIOS = detect.match(/iphone|ipad|ipod/i)

// appid
const appid = 'wx9881a033828453e0'

// url
const devUrl = 'http://localhost:8080/wxemcp'
const testUrl = 'http://testpay.pwpa.energyman.cn:8022/wxemcp'
const prodUrl = 'http://hl.energyman.cn/wxemcp'

// basename
const devBase = '/'
const testBase = '/wxemcp/test'
const prodBase = '/wxemcp'

// redirect
const testRedirect = `${prodUrl}/test`
// wechat auth url
const authUrl =
    'https://open.weixin.qq.com/connect/oauth2/authorize?appid=' +
    appid +
    '&redirect_uri=' +
    encodeURIComponent(isTest ? testRedirect : prodUrl) +
    '&response_type=code&scope=snsapi_base#wechat_redirect'

// export
const urlPrefix = isDev ? devUrl : isTest ? testUrl : prodUrl
const basename = isDev ? devBase : isTest ? testBase : prodBase

export { urlPrefix, basename, authUrl, isWeChat, isIOS, isDev, isTest, prodUrl }
