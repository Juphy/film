//index.js
//我要参与
//获取应用实例

Page({
  data: {
    date: '2016-09-01',
    endDate:'',
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var date=this.getNowTime();
    this.setData({
      endDate: date
    });

  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endDate: e.detail.value
    })
  },
  getNowTime: function() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if(month >= 1 && month <= 9) {
  month = "0" + month;
}
if (strDate >= 0 && strDate <= 9) {
  strDate = "0" + strDate;
}
var time = date.getFullYear() + seperator1 + month + seperator1 + strDate
return time;
},



})