var R_htmlToWxml = require("../../resource/js/htmlToWxml.js"), imageUtil = require("../../resource/js/images.js"), app = getApp();

Page({
    data: {
        id: 0
    },
    onLoad: function(t) {
        wx.setNavigationBarTitle({
            title: "我的点单详情"
        });
        var e = this;
        console.log(t), this.checkuser({
            doServices: function() {
                var a = wx.getStorageSync("userInfo");
                if (0 < e.data.id) e.data.id; else e.data.id = t.id;
                app.util.request({
                    url: "entry/wxapp/GetOrderInfo",
                    data: {
                        orderid: e.data.id,
                        sessionid: a.sessionid,
                        uid: a.memberInfo.uid
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
                        }), e.setData({
                            data: a.data.data.orderinfo,
                            list: a.data.data.order_detail
                        }));
                    }
                });
            }
        });
    },
    onReady: function() {},
    tabClick: function(e) {
        var o = this;
        this.checkuser({
            doServices: function() {
                var t = e.currentTarget.id, a = wx.getStorageSync("userInfo");
                app.util.request({
                    url: "entry/wxapp/myroomorderlist",
                    data: {
                        ordertype: t,
                        sessionid: a.sessionid,
                        uid: a.memberInfo.uid
                    },
                    success: function(a) {
                        a.data.message.errno || o.setData({
                            list: a.data.data,
                            ordertype: t
                        });
                    }
                });
            }
        });
    },
    delOrder: function(a) {
        var o = this;
        this.checkuser({
            doServices: function() {
                var t = a.currentTarget.dataset.id, e = wx.getStorageSync("userInfo");
                wx.showModal({
                    title: "订单取消",
                    content: "确认取消订单？",
                    success: function(a) {
                        a.confirm && app.util.request({
                            url: "entry/wxapp/delOrder",
                            data: {
                                id: t,
                                sessionid: e.sessionid,
                                uid: e.memberInfo.uid
                            },
                            success: function(a) {
                                console.log(a), o.onLoad();
                            },
                            fail: function(a) {
                                console.log(a);
                            }
                        });
                    }
                });
            }
        });
    },
    RepayOrder: function(a) {
        var o = this;
        this.checkuser({
            doServices: function() {
                var t = a.currentTarget.dataset.id, e = wx.getStorageSync("userInfo");
                wx.showModal({
                    title: "订单支付",
                    content: "是否确认订单？",
                    success: function(a) {
                        a.confirm && app.util.request({
                            url: "entry/wxapp/repay",
                            data: {
                                id: t,
                                sessionid: e.sessionid,
                                uid: e.memberInfo.uid
                            },
                            success: function(a) {
                                a.data && a.data.data && wx.requestPayment({
                                    timeStamp: a.data.data.timeStamp,
                                    nonceStr: a.data.data.nonceStr,
                                    package: a.data.data.package,
                                    signType: "MD5",
                                    paySign: a.data.data.paySign,
                                    success: function(a) {
                                        o.onLoad();
                                    },
                                    fail: function(a) {}
                                });
                            },
                            fail: function(a) {
                                console.log(a);
                            }
                        });
                    }
                });
            }
        });
    },
    onShow: function() {
        var t = this, a = wx.getStorageSync("shopinfo");
        if (a) wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: a.navcolor,
            animation: {
                duration: 400,
                timingFunc: "easeIn"
            }
        }); else {
            var e = wx.getStorageSync("storeid");
            e || (e = 0), app.util.request({
                url: "entry/wxapp/shopinfo",
                data: {
                    storeid: e
                },
                success: function(a) {
                    a.data.message.errno || (wx.setStorageSync("shopinfo", a.data.data.intro), wx.setNavigationBarColor({
                        frontColor: "#ffffff",
                        backgroundColor: a.data.data.intro.navcolor,
                        animation: {
                            duration: 400,
                            timingFunc: "easeIn"
                        }
                    }), 0 < a.data.data.storeid && (wx.setStorageSync("storeid", a.data.data.storeid), 
                    wx.setStorageSync("storename", a.data.data.storename)), wx.setNavigationBarTitle({
                        // title: wx.getStorageSync("storename") + "-" + wx.getStorageSync("shopinfo").name
                        title: `${wx.getStorageSync("storename") ? `${wx.getStorageSync("storename")} - `:''}`
                    }), t.setData({
                        shopinfo: wx.setStorageSync("shopinfo"),
                        contact: a.data.data.intro,
                        showmsg: t.data.showmsg,
                        scrollTop: t.data.scrollTop
                    }));
                }
            });
        }
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    checkuser: function(t) {
        t = t;
        var a = wx.getStorageSync("userInfo");
        return a && a.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: a.sessionid,
                uid: a.memberInfo.uid
            },
            success: function(a) {
                0 == a.data.data.error ? (console.log(t), t.doServices()) : 2 == a.data.data.error && t.doServices();
            }
        }) : (app.util.getUserInfo(), !1);
    }
});