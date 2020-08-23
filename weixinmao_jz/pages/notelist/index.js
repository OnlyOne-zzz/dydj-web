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
        loadMore: "",
        list: [],
        house_list: [],
        housetypelist: [],
        houseareaid: 0,
        housepriceid: 0,
        housetype: 0,
        page: 1,
        title: "",
        back: ''
    },
    onLoad: function(t) {

        var i = this;
        wx.setNavigationBarTitle({
            title: "预约技师-" + wx.getStorageSync("companyinfo").name
        });
        i.setData({
            housetypelist: [ {
                name: "初中",
                id: 1
            }, {
                name: "高中",
                id: 2
            }, {
                name: "中技",
                id: 3
            }, {
                name: "中专",
                id: 4
            }, {
                name: "大专",
                id: 5
            }, {
                name: "本科",
                id: 6
            }, {
                name: "硕士",
                id: 7
            }, {
                name: "博士",
                id: 8
            }, {
                name: "博后",
                id: 9
            } ],
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
            url: "entry/wxapp/Getnotelist",
            data: {
                cityid: t,
                houseareaid: e.data.houseareaid,
                housepriceid: e.data.housepriceid,
                housetype: e.data.housetype
            },
            success: function(t) {
                
                t.data.message.errno || (t.data.data.intro.maincolor || (t.data.data.intro.maincolor = "#09ba07"),
                    wx.setNavigationBarColor({
                        frontColor: "#ffffff",
                        backgroundColor: t.data.data.intro.maincolor,
                        animation: {
                            duration: 400,
                            timingFunc: "easeIn"
                        }
                    }), 
                    console.log(t.data.data), 
                    e.calculateDistanceHandle(t.data.data.worklist, true)
                    );
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
    toSearch: function(t) {
        wx.navigateTo({
            url: "/weixinmao_zp/pages/search/index"
        });
    },
    gethouselist: function(t) {
        var e = this, a = wx.getStorageSync("cityinfo").id;
        app.util.request({
            url: "entry/wxapp/Getnotelist",
            data: {
                cityid: a,
                page: e.data.page,
                houseareaid: e.data.houseareaid,
                housepriceid: e.data.housepriceid,
                housetype: e.data.housetype
            },
            success: function(t) {
                t.data.message.errno || (console.log(t.data.data), e.setData({
                    worklist: t.data.data.worklist
                }));
            },
            complete: function() {
                e.setData({
                    loadMore: ""
                });
            }
        });
    },
    selectcarsitem: function(t) {
        console.log(t.currentTarget.id);
        var e = t.currentTarget.id, a = t.currentTarget.dataset.title;
        console.log(t.currentTarget), this.setData({
            carid: e,
            isCars: !0,
            title: a
        }), this.data.houseareaid = e, this.gethouselist();
    },
    selectpriceitem: function(t) {
        console.log(t.currentTarget.id);
        var e = t.currentTarget.id, a = t.currentTarget.dataset.title;
        console.log(t.currentTarget), this.setData({
            priceid: e,
            isPrice: !0,
            price: a
        }), this.data.housepriceid = e, this.gethouselist();
    },
    selecttypeitem: function(t) {
        console.log(t.currentTarget.id);
        var e = t.currentTarget.id, a = t.currentTarget.dataset.title;
        console.log(t.currentTarget), this.setData({
            typeid: e,
            isType: !0,
            typetitle: a
        }), this.data.housetype = e, this.gethouselist();
    },
    onReachBottom: function(t) {
        this.setData({
            loadMore: "正在加载中..."
        }), this.data.page = this.data.page + 1, this.gethouselist();
    },
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
            isCars: !this.data.isCars
        });
    },
    selectPrice: function() {
        this.setData({
            isSort: !0,
            isCars: !0,
            isType: !0,
            isPrice: !this.data.isPrice
        });
    },
    selectType: function() {
        this.setData({
            isSort: !0,
            isCars: !0,
            isPrice: !0,
            isType: !this.data.isType
        });
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
        var orderName = obj.orderName;
        //排序类型
        var orderType = obj.orderType;
        //客服务状态  0：所有，1：客服务，2:服务中
        var serviceStatus = obj.serviceStatus;
        //前端参数获取  
        var data = {
            orderName:orderName,
            orderType:orderType,
            serviceStatus:serviceStatus
        };
        //按距离排序
        if(orderName == 'distance'){
            _this.requestNoteList(data, function(result){
                _this.calculateDistanceHandle(result, true);
            });
        }else{
            _this.requestNoteList(data, function(result){
                _this.calculateDistanceHandle(result, false);
            });
        }
    },
    requestNoteList: function(data, call){
        app.util.request({
            url: "entry/wxapp/Getnotelist",
            data: data,
            success: function(t) {
                t.data.message.errno || (t.data.data.intro.maincolor || (t.data.data.intro.maincolor = "#09ba07"),
                    wx.setNavigationBarColor({
                        frontColor: "#ffffff",
                        backgroundColor: t.data.data.intro.maincolor,
                        animation: {
                            duration: 400,
                            timingFunc: "easeIn"
                        }
                    }), 
                    call(t.data.data.worklist)
                    );
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh(), e.setData({
                    loadMore: ""
                });
            }
        });
    },
    calculateDistanceHandle: function(wt, isDistanceToSort){
        var qqmapsdk = new QQMapWX({
            key: config.Config.key // 必填
        });
        var e = this;
        var distanceTO = [];
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
             //是否需要根据距离排序
              if(isDistanceToSort){
                   //冒泡排序
                for (var i = 0; i < wt.length - 1; i++) {
                    for (var j = 0; j < wt.length - i -1; j++) {   // 这里说明为什么需要-1
                        if (wt[j].distance > wt[j + 1].distance) {
                            var temp = wt[j];
                            wt[j] = wt[j + 1];
                            wt[j + 1] = temp;
                        }
                    }
                }
              }
            //单位转换
            for (var i = 0; i < wt.length; i++) {
                var dit = wt[i].distance;
                if(dis < 1000){
                    wt[i].distance = wt[i].distance + "米";
                }else{
                    var num = wt[i].distance / 1000;
                    wt[i].distance = num.toFixed(1) + "公里";
                }
            }

              e.setData({ //设置并更新distance数据
                worklist: wt
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