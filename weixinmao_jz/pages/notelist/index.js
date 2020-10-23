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
        bigWrap: 0
    },
    onLoad: function(t) {

        var i = this;
        wx.setNavigationBarTitle({
            title: "技师列表" 
        }), wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: "#3C9BDF",
            animation: {
                duration: 400,
                timingFunc: "easeIn"
            }
        });
        // 校验用户是否已经授权定位
        this.getlocationsetting();
        i.setData({
            typeid: 0,
            carid: 0,
            priceid: 0,
            pricelist: [ {
                name: "企业",
                id: 1
            }, {
                name: "个人",
                id: 0
            } ]
        });
        var e = wx.getStorageSync("cityinfo");
        e ? (wx.setStorageSync("city", e.name), i.initpage()) : (qqmapsdk = new QQMapWX({
            key: config.Config.key
        }), wx.getLocation({
            type: "gcj02",
            success: function(t) {
                wx.setStorageSync("latitude", t.latitude), wx.setStorageSync("longitude", t.longitude),
                    qqmapsdk.reverseGeocoder({
                        location: {
                            latitude: t.latitude,
                            longitude: t.longitude
                        },
                        success: function(t) {
                            var e = t.result.address_component.city, a = e.substr(0, e.length - 1);
                            wx.setStorageSync("city", a), i.initpage();
                        }
                    });
            },
            fail: function() {
                i.initpage();
            },
            complete: function() {}
        }));
    },
    onShow: function(o){
        this.data.back = wx.getStorageSync('waiter')
    },
    initpage: function() {
        var e = this, t = wx.getStorageSync("cityinfo").id;
        app.util.request({
            url: "entry/wxapp/getinitinfo",
            success: function(t) {
                t.data.message.errno || e.setData(_defineProperty({
                    city: wx.getStorageSync("companyinfo").city,
                    arealist: t.data.data.arealist,
                    housepricelist: t.data.data.jobcatelist,
                    typelist: t.data.data.typelist,
                    title: "",
                    price: "",
                    typetitle: ""
                }, "city", wx.getStorageSync("cityinfo").name));
            }
        }), 
        app.util.request({
            url: "entry/wxapp/notePaging",
            data: {
                serviceStatus: e.data.serviceStatus
            },
            success: function(t) {
                // t.data.message.errno,
                e.calculateDistanceHandle(t.data.data.list, true);
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh(), e.setData({
                    loadMore: ""
                });
            }
        });
    },
    toNoteDetail: function(t) {
        var e = t.currentTarget.dataset.id;
        let index = t.currentTarget.dataset.index
        if(this.data.back){
            wx.setStorageSync('waiterinfo', this.data.worklist[index])
            wx.navigateBack({delta: 1})
        } else {
            wx.navigateTo({
                url: "/weixinmao_jz/pages/notedetail/index?id=" + e
            });
        }
    },
    toCompanyNoteDetail: function(t) {
        var e = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_jz/pages/companynotedetail/index?id=" + e
        });
    },
    toNotemessage: function(t) {
        var e = t.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_jz/pages/notemessage/index?id=" + e
        });
    },
    gethouselist: function(t) {
        var _this = this;
        var id= t.currentTarget.id;
        var obj = {
            "serviceStatus": _this.data.serviceStatus
        };
        if(id == 0 || id == 1){
            obj.orderColumn = '';
        }else if(id == 2){
            obj.orderColumn = "views"
        }
        obj.orderColumn = _this.data.orderColumn;
        this.getNodeList(obj);
    },
    selectcarsitem: function(t) {
        var _this = this;
        var id= t.currentTarget.id;
        this.setData({
            bigWrap: id
        })
        console.log(this.data.bigWrap)
        var obj = {
            "serviceStatus": _this.data.serviceStatus
        };
        if(id == 0 || id == 1){
            obj.orderColumn = '';
        }else if(id == 2){
            obj.orderColumn = "views"
        }
        _this.data.orderColumn = obj.orderColumn;
        this.getNodeList(obj);
    },
    selectpriceitem: function(t) {
        console.log(t.currentTarget.id);
        var e = t.currentTarget.id, a = t.currentTarget.dataset.title;
        console.log(t.currentTarget), this.setData({
            priceid: e,
            isPrice: !0,
            price: a
        })
        //, this.data.housepriceid = e, this.gethouselist();
    },
    selecttypeitem: function(t) {
        console.log(t.currentTarget.id);
        var e = t.currentTarget.id, a = t.currentTarget.dataset.title;
        console.log(t.currentTarget), this.setData({
            typeid: e,
            isType: !0,
            typetitle: a
        })
        //, this.data.housetype = e, this.gethouselist();
    },
    // onReachBottom: function(t) {
    //     this.setData({
    //         loadMore: "正在加载中..."
    //     })
    //     //, this.data.page = this.data.page + 1, this.gethouselist();
    // },
    clickSearch: function(t) {
        wx.switchTab({
            url: "/pages/search/search"
        });
    },
    clickList: function() {
        wx.navigateTo({
            url: "../cars/cars"
        });
    },
    selectCars: function(t) {
        this.setData({
            isSort: !0,
            isPrice: !0,
            isType: !0,
            isType2: !0,
            isCars: !this.data.isCars
        });
    },
    selectPrice: function() {
        
        this.setData({
            isSort: !0,
            isCars: !0,
            isType: !0,
            isType2: !0,
            isPrice: !this.data.isPrice,
            serviceStatus: 0
        });
        var _this = this;
        var obj = {
            "serviceStatus": _this.data.serviceStatus,
            "orderColumn": _this.data.orderColumn
        }
        this.getNodeList(obj);
    },
    selectType: function() {
        this.setData({
            isSort: !0,
            isCars: !0,
            isPrice: !0,
            isType2: !0,
            isType: !this.data.isType,
            serviceStatus: 1
        });
        var _this = this;
        var obj = {
            "serviceStatus": _this.data.serviceStatus,
            "orderColumn": _this.data.orderColumn
        }
        this.getNodeList(obj);
    },
    selectType2: function() {
        this.setData({
            isSort: !0,
            isCars: !0,
            isPrice: !0,
            isType: !0,
            isType2: !this.data.isType2,
            serviceStatus: 2
        });
        var _this = this;
        var obj = {
            "serviceStatus": _this.data.serviceStatus,
            "orderColumn": _this.data.orderColumn
        }
        this.getNodeList(obj);
    },
    selectSort: function() {
        this.setData({
            isCars: !0,
            isPrice: !0,
            isType: !0,
            isSort: !this.data.isSort
        });
    },
    selectBrand: function() {
        wx.navigateTo({
            url: "../brand/brand"
        });
    },
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading(), this.onLoad();
    },
    onShareAppMessage: function() {
        return {
            title: "预约服务-" + wx.getStorageSync("companyinfo").name,
            path: "/weixinmao_jz/pages/notelist/index"
        };
    },
//分页排序实现
    getNodeList: function(obj){
        var _this = this;
        //排序名称
        var orderColumn = obj.orderColumn;
        //排序类型
        var orderType = 'desc';
        //客服务状态  0：所有，1：客服务，2:服务中
        var serviceStatus = obj.serviceStatus;
        //前端参数获取  
        var data = {
            serviceStatus:serviceStatus
        };
        //按距离排序
        if(orderColumn == 'distance'){
            _this.requestNoteList(data, function(result){
                _this.calculateDistanceHandle(result, true);
            });
        }else{
            data.orderColumn = orderColumn;
            data.orderType = orderType;
            console.log(data);
            _this.requestNoteList(data, function(result){
                _this.calculateDistanceHandle(result, false);
            });
        }
    },
    getInputValue(e){
        console.log(e.detail)// {value: "ff", cursor: 2}  
        var _this = this;
        var name = e.detail.value;
        console.log(name);
        app.util.request({
            url: "entry/wxapp/nameSearch",
            data: {
                name: name
            },
            success: function(t) {
                // t.data.message.errno,
                _this.calculateDistanceHandle(t.data.data.list, false)
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh(), _this.setData({
                    loadMore: ""
                });
            }
        });
    },
    requestNoteList: function(data, call){
        var e = this;
        app.util.request({
            url: "entry/wxapp/notePaging",
            data: data,
            success: function(t) {
                console.log("技师列表")
                console.log(t)
                // t.data.message.errno,
                call(t.data.data.list);
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh(), e.setData({
                    loadMore: ""
                });
            }
        });
    },
    getlocationsetting:function(){
        var _this=this;
        wx.getSetting({
            withSubscriptions: false,
            success (res) {
                console.log(res)
              if(res.authSetting['scope.userLocation']){
                  console.log("定位授权了")
              }else{
                wx.showModal({
                    title: '位置信息授权',
                    content:'您未授权位置信息无法正常使用是否重新授权',
                    success:function(res){
                        console.log(res)
                        if (res.confirm) {
                            wx.openSetting({
                                success (res) {
                                    if(res.authSetting['scope.userLocation']){
                                        _this.onLoad();
                                    }
                                  }
                            });
                          } else if (res.cancel) {
                            console.log('用户点击取消')
                          }
                    }
                })
            }
            }
          })
    },
    calculateDistanceHandle: function(wt, isDistanceToSort){
        var qqmapsdk = new QQMapWX({
            key: config.Config.key // 必填
        });
        var e = this;
        var distanceTO = [];
        if(!wt || wt.length == 0){
            console.log(wt);
            e.setData({
                worklist:[]
            });
            return;
        }
        console.log(wt);
        for(var i = 0;  i < wt.length; i++){
            distanceTO.push({'latitude': wt[i].lat, 'longitude': wt[i].lng});
        }
        qqmapsdk.calculateDistance({
            //mode: 'driving',//可选值：'driving'（驾车）、'walking'（步行），不填默认：'walking',可不填
            mode: 'driving',
            //from参数不填默认当前地址
            from: '', //若起点有数据则采用起点坐标，若为空默认当前地址
            to:  distanceTO, //终点坐标
            success: function(res) {//成功后的回调
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
                if(dit < 1000){
                    inService[i].distance = inService[i].distance + "米";
                }else{
                    var num = inService[i].distance / 1000;
                    inService[i].distance = num.toFixed(1) + "公里";
                }
            }
            for (var i = 0; i < serviceable.length; i++) {
                var dit = serviceable[i].distance;
                if(dit < 1000){
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
    }
});