// weixinmao_jz/pages/technician.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageinfo:[{
      shopname: '小甜甜',
      avatarUrl: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3256100974,305075936&fm=26&gp=0.jpg',
      score: '4.5',
      desc:'足疗、推拿、泰式SPA'
    },
    {
      shopname: '红浪漫小红红',
      avatarUrl: 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3140403455,2984550794&fm=26&gp=0.jpg',
      score: '4.0',
      desc:'足疗、推拿、泰式SPA'
    }
  ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.oldhouseinit()
  },
  select: function(e){
    let index = e.currentTarget.dataset.index
    console.log(this.data.pageinfo[index])
    wx.setStorageSync('technician', this.data.pageinfo[index])
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  oldhouseinit: function(a) {
    var t = this, e = wx.getStorageSync("userInfo");
    app.util.request({
        url: "entry/wxapp/Getgooditems",
        data: {
            currentid: t.data.currentid,
            shopid: t.data.shopid,
            sessionid: e.sessionid,
            uid: e.memberInfo.uid
        },
        success: function(a) {
            a.data.message.errno || (a.data.data.intro.maincolor || (a.data.data.intro.maincolor = "#09ba07"), 
            wx.setNavigationBarColor({
                frontColor: "#ffffff",
                backgroundColor: a.data.data.intro.maincolor,
                animation: {
                    duration: 400,
                    timingFunc: "easeIn"
                }
            }), wx.setNavigationBarTitle({
                title: "选择技师"
            }), t.data.gooditems = a.data.data.gooditems, t.setData({
                msgcontent: a.data.data.msgcontent,
                gooditems: a.data.data.gooditems,
                addressinfo: a.data.data.addressinfo,
                intro: a.data.data.intro,
                isshow: !1
            }));
        }
    });
}

})