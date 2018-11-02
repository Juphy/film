const CONF = {
    port: '5757',
    rootPathname: '',

    // 微信小程序 App ID
    appId: 'wx12f7ee2916dde013',

    // 微信小程序 App Secret
    appSecret: '844469ef019128ea533f7d08f1186543',

    // 是否使用腾讯云代理登录小程序
    useQcloudLogin: false,

    qcloudAppId: 1257935615,

    qcloudSecretId: 'AKIDiJk07Ej2q172mLxuthhVHwRktAJGDazG',

    qcloudSecretKey: 'Y4Ulw48VtCi9Wmx1whMvcBXjy8APi22y',

    // serverHost: 'https://www.applet.top',
    // tunnelServerUrl: 'http://tunnel.ws.qcloud.la',
    // tunnelSignatureKey: '27fb7d1c161b7ca52d73cce0f1d833f9f5b5ec89',

    /**
     * MySQL 配置，用来存储 session 和用户信息
     * 若使用了腾讯云微信小程序解决方案
     * 开发环境下，MySQL 的初始密码为您的微信小程序 appid
     */
    mysql: {
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        db: 'cAuth',
        pass: 'wx12f7ee2916dde013',
        char: 'utf8mb4'
    },

    cos: {
        /**
         * 地区简称
         * @查看 https://cloud.tencent.com/document/product/436/6224
         */
        region: 'ap-guangzhou',
        // Bucket 名称
        fileBucket: 'qcloudtest',
        // 文件夹
        uploadFolder: ''
    },

    // 微信登录态有效期
    wxLoginExpires: 7200,
    wxMessageToken: 'abcdefgh'
}

module.exports = CONF
