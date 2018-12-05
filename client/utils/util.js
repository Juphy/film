

//获取当前时间
var getNowTime=()=>{
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var time = date.getFullYear() + seperator1 + month + seperator1 + strDate
  return time;
}

//格式化时间
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//格式化数字
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}


// 显示繁忙提示
var showBusy = text => wx.showToast({
    title: text,
    icon: 'loading',
    duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
    title: text,
    icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
    wx.hideToast();

  if ("object" == typeof (content)){
    content=JSON.stringify(content)
  }

    wx.showModal({
        title,
      content: content,
        showCancel: false
    })
}

//手机号校验
var phoneNumberCheck=(phoneNumber)=>{
  return !!phoneNumber.match(/^(0|86|17951)?(13[0-9]|15[012356789]|17[3678]|18[0-9]|14[57])[0-9]{8}$/);
}
//输出到控制台
var showConsole=(msg)=>{
  console.log(msg)
}

function isCardNo(card) {
  // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X  
  var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;

  return reg.test(card)
}  


module.exports = { isCardNo, getNowTime,showConsole,formatTime, showBusy, showSuccess, showModel, phoneNumberCheck }
