let success = (data, msg = '', attr = '') => {
  return {
    res: data,
    msg: msg,
    attr: attr,
    code: 200
  }
}

let failed = (msg = '', attr = '') => {
  return {
    res: null,
    msg: msg,
    attr: attr,
    code: 400
  }
}

let authFailed = () => {
  return {
    res: null,
    msg: '未登录或登录失效',
    attr: '',
    code: 403
  }
}


module.exports = {
  success,
  failed,
  authFailed
}