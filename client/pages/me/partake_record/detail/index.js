//index.js 
//参与记录
//获取应用实例
const app = getApp()

Page({
  data: {
    title: "动物世界",
    partakeRecordList: [{
        date: '2018-01-01',
        filmName: '华影国际',
        address: '海淀区花园路甲12号院B层',
        demo: '爱丽丝的非拉开圣诞节从i阿胶拉萨扩大解放爱丽丝的咖啡机',
        images: ['/images/dwsj.jpg', '/images/dwsj.jpg', '/images/dwsj.jpg', '/images/dwsj.jpg']
      },
      {
        date: '2018-01-01',
        filmName: '华影国际',
        address: '海淀区花园路甲12号院B层',
        demo: '爱丽丝的非拉开圣诞节从i阿胶拉萨扩大解放爱丽丝的咖啡机',
        images: ['/images/dwsj.jpg', '/images/dwsj.jpg', '/images/dwsj.jpg', '/images/dwsj.jpg']
      },
      {
        date: '2018-01-01',
        filmName: '华影国际',
        address: '海淀区花园路甲12号院B层',
        demo: '爱丽丝的非拉开圣诞节从i阿胶拉萨扩大解放爱丽丝的咖啡机',
        images: ['/images/dwsj.jpg', '/images/dwsj.jpg', '/images/dwsj.jpg', '/images/dwsj.jpg']
      },
      {
        date: '2018-01-01',
        filmName: '华影国际',
        address: '海淀区花园路甲12号院B层',
        demo: '爱丽丝的非拉开圣诞节从i阿胶拉萨扩大解放爱丽丝的咖啡机',
        images: ['/images/dwsj.jpg', '/images/dwsj.jpg', '/images/dwsj.jpg', '/images/dwsj.jpg']
      }

    ]
  },

  onLoad: function() {

  },
  onClickDel: function(e) {

    wx.showModal({
      title: '提示',
      content: '您确定要删除该记录吗？',
    })

  }


})