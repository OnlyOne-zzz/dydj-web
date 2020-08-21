function _defineProperty(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

var qqmapsdk, QQMapWX = require("../../resource/js/qqmap-wx-jssdk.min.js"), app = getApp();

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
            key: "5D3BZ-J55WF-SFPJJ-NI6PG-YN2ZO-M4BHX"
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
        }), app.util.request({
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
                    }), console.log(t.data.data), e.setData({
                    worklist: t.data.data.worklist
                }));
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
    }
});