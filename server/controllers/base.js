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

module.exports = {
    success,
    failed
}