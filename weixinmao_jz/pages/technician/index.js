// weixinmao_jz/pages/technician.js
var qqmapsdk, QQMapWX = require("../../resource/js/qqmap-wx-jssdk.min.js"), app = getApp(),config = require("../../resource/js/config.js");
var app = getApp();
Page({
  data: {
    noteName:'',
    noteId:0 
},
  /**
   * 页面的初始数据
   */
  // data: {
  //   pageinfo:[{
  //     shopname: '小甜甜',
  //     avatarUrl: 'https://dss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3256100974,305075936&fm=26&gp=0.jpg',
  //     score: '4.5',
  //     desc:'足疗、推拿、泰式SPA'
  //   },
  //   {
  //     shopname: '红浪漫小红红',
  //     avatarUrl: 'https://dss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3140403455,2984550794&fm=26&gp=0.jpg',
  //     score: '4.0',
  //     desc:'足疗、推拿、泰式SPA'
  //   }
  // ]
  // },
  requestNoteList: function(){
    var _this = this;
    var data ={
      serviceStatus:1
    };
    app.util.request({
        url: "entry/wxapp/notePaging",
        data: data,
        success: function(t) {
          console.log("技师列表")
          console.log(t)
            t.data.message.errno,
                wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: "#09ba07",
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }), 
                _this.calculateDistanceHandle(t.data.data.list,true);
        },
        complete: function() {
            wx.hideNavigationBarLoading(), wx.stopPullDownRefresh(), _this.setData({
                loadMore: ""
            });
        }
    });
},
calculateDistanceHandle: function(wt, isDistanceToSort){
  console.log(wt);
  var qqmapsdk = new QQMapWX({
      key: config.Config.key // 必填
  });
  var e = this;
  var distanceTO = [];
  for(var i = 0;  i < wt.length; i++){
      distanceTO.push({'latitude': wt[i].lat, 'longitude': wt[i].lng});
  }
  console.log(distanceTO)
  qqmapsdk.calculateDistance({
      //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
      mode: 'driving',
      //from参数不填默认当前地址
      from: '', //若起点有数据则采用起点坐标，若为空默认当前地址
      to:  distanceTO, //终点坐标
      success: function(res) {//成功后的回调
        console.log(res);
        var res = res.result;
        for (var i = 0; i < res.elements.length; i++) {
         var dis = res.elements[i].distance;
         // 如果radius半径过小或者无法搜索到，则返回-1.给它默认赋值为100米
         if(dis == -1){
          wt[i].distance = 100;
         }else{
          wt[i].distance = res.elements[i].distance;
         }
        };
        //根据技师状态分组
        var serviceable = []; //可服务
        var inService = []; //服务中
        for (var i = 0; i < wt.length; i++) {
          var serviceStatus = wt[i].serviceStatus;
          if(serviceStatus == 1){
             serviceable.push(wt[i]);
          }else{
              inService.push(wt[i]);
          }
      }
       //是否需要根据距离排序
        if(isDistanceToSort){
             //冒泡排序
          for (var i = 0; i < serviceable.length - 1; i++) {
              for (var j = 0; j < serviceable.length - i -1; j++) {   // 这里说明为什么需要-1
                  if (serviceable[j].distance > serviceable[j + 1].distance) {
                      var temp = serviceable[j];
                      serviceable[j] = serviceable[j + 1];
                      serviceable[j + 1] = temp;
                  }
              }
          }
          for (var i = 0; i < inService.length - 1; i++) {
              for (var j = 0; j < inService.length - i -1; j++) {   // 这里说明为什么需要-1
                  if (inService[j].distance > inService[j + 1].distance) {
                      var temp = inService[j];
                      inService[j] = inService[j + 1];
                      inService[j + 1] = temp;
                  }
              }
          }
        }
      //单位转换
      for (var i = 0; i < inService.length; i++) {
          var dit = inService[i].distance;
          if(dis < 1000){
              inService[i].distance = inService[i].distance + "米";
          }else{
              var num = inService[i].distance / 1000;
              inService[i].distance = num.toFixed(1) + "公里";
          }
      }
      for (var i = 0; i < serviceable.length; i++) {
          var dit = serviceable[i].distance;
          if(dis < 1000){
              serviceable[i].distance = serviceable[i].distance + "米";
          }else{
              var num = serviceable[i].distance / 1000;
              serviceable[i].distance = num.toFixed(1) + "公里";
          }
      }

        e.setData({ //设置并更新distance数据
          worklist: serviceable.concat(inService)
        });
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
  });

  console.log(distanceTO);
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.requestNoteList();
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
    let noteObj = e.currentTarget.dataset.obj;
    console.log(noteObj)
    wx.setStorageSync('technician',noteObj)
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