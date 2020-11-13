function _defineProperty(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

var qqmapsdk, QQMapWX = require("../../resource/js/qqmap-wx-jssdk.min.js"), app = getApp(),config = require("../../resource/js/config.js");

Page({
    data: {
        city: wx.getStorageSync("companyinfo").city,
        isCars: !0,
        isSort: !0,
        isPrice: !0,
        isType: !0,
        isType2: !0,
        loadMore: "",
        list: [],
        house_list: [],
        housetypelist: [],
        houseareaid: 0,
        housepriceid: 0,
        housetype: 0,
        page: 1,
        title: "",
        back: '',
        serviceStatus: 0,
        orderColumn: '',
        worklist:null
    },
    onLoad: function(t) {
        wx.setNavigationBarTitle({
            title: "选择技师"
        }), wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: "#3C9BDF",
            animation: {
                duration: 400,
                timingFunc: "easeIn"
            }
        });
        var pid = t.pid;
        this.requestNoteList(pid);
    },
    select: function(e){      
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];
        let note = e.currentTarget.dataset.note;
        prevPage.setData({
            selectnote:note
        })
        wx.navigateBack({
          delta: 1
        })
      },
    requestNoteList: function(pid){
        var _this = this;
        var data ={
          serviceStatus:1,
          contentPid:pid
        };
        console.log(data)
        app.util.request({
            url: "entry/wxapp/notePaging",
            data: data,
            success: function(t) {
                if(!t.data.message.errno){
                      if(t.data.data.list.length>0){
                        _this.calculateDistanceHandle(t.data.data.list,true);
                      }else{
                        _this.setData({
                            worklist:[]
                        })
                      }
                }
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
              console.log("算路成功")
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
    onShow: function(o){
        this.data.back = wx.getStorageSync('waiter')
    },
    onPullDownRefresh: function() {
    }
});