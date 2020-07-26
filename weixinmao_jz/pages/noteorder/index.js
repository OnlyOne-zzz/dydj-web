var R_htmlToWxml = require("../../resource/js/htmlToWxml.js"), imageUtil = require("../../resource/js/images.js"), app = getApp();

Page({
    data: {
        id: 0,
        ordertype: 1
    },
    onLoad: function(e) {
        var t = this;
        if (0 < t.data.id) t.data.id; else {
            e.id;
            t.data.id = e.id;
        }
    },
    onShow: function(e) {
        wx.setNavigationBarTitle({
            title: "客户预约订单"
        });
        this.setData({
            isshow: !0
        }), console.log("aaaa"), this.InitPage();
    },
    InitPage: function() {
        var t = this, e = wx.getStorageSync("userInfo"), o = wx.getStorageSync("loginid"), n = t.data.ordertype;
        t.data.id = n, app.util.request({
            url: "entry/wxapp/mynoteorder",
            data: {
                ordertype: n,
                loginid: o,
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
            },
            success: function(e) {
                e.data.message.errno || (e.data.data.intro.maincolor || (e.data.data.intro.maincolor = "#09ba07"), 
                wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: e.data.data.intro.maincolor,
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }), t.setData({
                    list: e.data.data.list,
                    ordertype: n,
                    intro: e.data.data.intro,
                    isshow: !1
                }));
            }
        });
    },
    onReady: function() {},
    tabClick: function(e) {
        var t = this, o = e.currentTarget.id;
        t.data.id = o;
        var n = wx.getStorageSync("userInfo"), a = wx.getStorageSync("loginid");
        app.util.request({
            url: "entry/wxapp/mynoteorder",
            data: {
                ordertype: o,
                loginid: a,
                sessionid: n.sessionid,
                uid: n.memberInfo.uid
            },
            success: function(e) {
                e.data.message.errno || t.setData({
                    list: e.data.data.list,
                    ordertype: o
                });
            }
        });
    },
    delOrder: function(e) {
        var n = this;
        this.checkuser({
            doServices: function() {
                var t = e.currentTarget.dataset.id, o = wx.getStorageSync("userInfo");
                wx.showModal({
                    title: "订单取消",
                    content: "确认取消订单？",
                    success: function(e) {
                        e.confirm && app.util.request({
                            url: "entry/wxapp/delOrder",
                            data: {
                                id: t,
                                sessionid: o.sessionid,
                                uid: o.memberInfo.uid
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
    getOrder: function(e) {
        var n = this;
        this.checkuser({
            doServices: function() {
                var t = e.currentTarget.dataset.id, o = wx.getStorageSync("userInfo");
                wx.showModal({
                    title: "接收订单",
                    content: "是否接收订单？",
                    success: function(e) {
                        e.confirm && app.util.request({
                            url: "entry/wxapp/getShopOrder",
                            data: {
                                id: t,
                                sessionid: o.sessionid,
                                uid: o.memberInfo.uid
                            },
                            success: function(e) {
                                console.log(e), n.onShow();
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
    doneOrder: function(e) {
        var t = this, o = e.currentTarget.dataset.id, n = e.currentTarget.dataset.status, a = wx.getStorageSync("userInfo");
        wx.showModal({
            title: "完成订单",
            content: "是否完成订单？",
            success: function(e) {
                e.confirm && app.util.request({
                    url: "entry/wxapp/doneShopOrder",
                    data: {
                        id: o,
                        sessionid: a.sessionid,
                        uid: a.memberInfo.uid,
                        status: n
                    },
                    success: function(e) {
                        console.log(e), t.onLoad();
                    },
                    fail: function(e) {
                        console.log(e);
                    }
                });
            }
        });
    },
    toSetCouponmoney: function(e) {
        var t = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_jz/pages/setcouponmoney/index?id=" + t
        });
    },
    toMymsgmoney: function(e) {
        var t = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_jz/pages/mymsgmoney/index?id=" + t
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    checkuser: function(t) {
        var o = this, e = (t = t, wx.getStorageSync("userInfo"));
        return console.log(e), e ? e.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
            },
            success: function(e) {
                console.log("payyyy"), 0 == e.data.data.error ? t.doServices() : 2 == e.data.data.error && t.doServices();
            }
        }) : (app.util.getUserInfo(), !1) : (app.util.getUserInfo(function(e) {
            o.InitPage();
        }), !1);
    }
});