var R_htmlToWxml = require("../../resource/js/htmlToWxml.js"), imageUtil = require("../../resource/js/images.js"), app = getApp();

Page({
    data: {
        id: 0
    },
    onLoad: function(e) {
        wx.setNavigationBarTitle({
            title: "分销记录"
        });
        var a = this;
        wx.getStorageSync("userInfo").sessionid ? a.initpage() : app.util.getUserInfo(function() {
            a.initpage();
        });
    },
    initpage: function() {
        var a = this, e = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/myfxrecord",
            data: {
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
            },
            success: function(e) {
                e.data.message.errno || (e.data.data.intro.maincolor || (e.data.data.intro.maincolor = "#3274e5"), 
                wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: e.data.data.intro.maincolor,
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }), a.setData({
                    list: e.data.data.list,
                    totalmoney: e.data.data.totalmoney,
                    dtotalmoney: e.data.data.dtotalmoney
                }));
            }
        });
    },
    toGetmoney: function() {
        wx.navigateTo({
            url: "/weixinmao_zp/pages/getmoney/index"
        });
    },
    toJob: function(e) {
        var a = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_zp/pages/jobdetail/index?id=" + a
        });
    },
    addcompanyjob: function(e) {
        wx.navigateTo({
            url: "/weixinmao_zp/pages/addCompanyjob/index"
        });
    },
    onReady: function() {},
    tabClick: function(t) {
        var n = this;
        this.checkuser({
            doServices: function() {
                var a = t.currentTarget.id, e = wx.getStorageSync("userInfo");
                app.util.request({
                    url: "entry/wxapp/myorderlist",
                    data: {
                        ordertype: a,
                        sessionid: e.sessionid,
                        uid: e.memberInfo.uid
                    },
                    success: function(e) {
                        e.data.message.errno || n.setData({
                            list: e.data.data,
                            ordertype: a
                        });
                    }
                });
            }
        });
    },
    cancleSave: function(e) {
        var n = this;
        this.checkuser({
            doServices: function() {
                var a = e.currentTarget.dataset.id, t = wx.getStorageSync("userInfo");
                wx.showModal({
                    title: "取消收藏",
                    content: "确认取消收藏？",
                    success: function(e) {
                        e.confirm && app.util.request({
                            url: "entry/wxapp/cancleSave",
                            data: {
                                id: a,
                                sessionid: t.sessionid,
                                uid: t.memberInfo.uid
                            },
                            success: function(e) {
                                console.log(e), n.onLoad();
                            },
                            fail: function(e) {
                                console.log(e);
                            }
                        });
                    }
                });
            }
        });
    },
    RepayOrder: function(e) {
        var n = this;
        this.checkuser({
            doServices: function() {
                var a = e.currentTarget.dataset.id, t = wx.getStorageSync("userInfo");
                wx.showModal({
                    title: "订单支付",
                    content: "是否确认订单？",
                    success: function(e) {
                        e.confirm && app.util.request({
                            url: "entry/wxapp/repay",
                            data: {
                                id: a,
                                sessionid: t.sessionid,
                                uid: t.memberInfo.uid
                            },
                            success: function(e) {
                                e.data && e.data.data && wx.requestPayment({
                                    timeStamp: e.data.data.timeStamp,
                                    nonceStr: e.data.data.nonceStr,
                                    package: e.data.data.package,
                                    signType: "MD5",
                                    paySign: e.data.data.paySign,
                                    success: function(e) {
                                        n.onLoad();
                                    },
                                    fail: function(e) {}
                                });
                            },
                            fail: function(e) {
                                console.log(e);
                            }
                        });
                    }
                });
            }
        });
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    checkuser: function(a) {
        a = a;
        var e = wx.getStorageSync("userInfo");
        return e && e.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
            },
            success: function(e) {
                0 == e.data.data.error ? (console.log(a), a.doServices()) : 2 == e.data.data.error && a.doServices();
            }
        }) : (app.util.getUserInfo(), !1);
    }
});