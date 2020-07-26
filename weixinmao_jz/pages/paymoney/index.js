var app = getApp();

Page({
    data: {
        id: 0,
        mycouponlist: [],
        totalmoney: 0,
        couponid: 0,
        payway: 0
    },
    onLoad: function(a) {
        var t = this;
        if (wx.setNavigationBarTitle({
            title: "支付尾款"
        }), 0 < t.data.id) var o = t.data.id; else {
            o = a.id;
            t.data.id = a.id;
        }
        var n = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/getcouponmoney",
            data: {
                sessionid: n.sessionid,
                uid: n.memberInfo.uid,
                couponmoneyid: o
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
                }), t.data.mycouponlist = a.data.data.mycouponlist, t.data.totalmoney = a.data.data.money, 
                console.log(a.data.data.mycouponlist), t.setData({
                    money: a.data.data.money,
                    money2: a.data.data.money,
                    id: t.data.id,
                    mycouponlist: a.data.data.mycouponlist
                }));
            }
        });
    },
    radioPayChange: function(a) {
        this.data.payway = a.detail.value;
    },
    bindCouponChange: function(a) {
        var t = this.data.mycouponlist, o = 0;
        console.log(this.data.totalmoney), t && (this.data.couponid = t[a.detail.value].id, 
        o = this.data.totalmoney - t[a.detail.value].money), console.log(t[a.detail.value]), 
        this.setData({
            mycouponlist: t,
            couponname: a.detail.value,
            money2: o
        });
    },
    paymoney: function(a) {
        var t = this, o = a.currentTarget.dataset.id, n = wx.getStorageSync("userInfo");
        0 == t.data.payway ? wx.showModal({
            title: "支付尾款",
            content: "是否确认支付尾款？",
            success: function(a) {
                a.confirm ? app.util.request({
                    url: "entry/wxapp/paycouponmoney",
                    data: {
                        id: o,
                        sessionid: n.sessionid,
                        uid: n.memberInfo.uid,
                        couponid: t.data.couponid
                    },
                    success: function(a) {
                        a.data && 0 == a.data.data.error && wx.requestPayment({
                            timeStamp: a.data.data.timeStamp,
                            nonceStr: a.data.data.nonceStr,
                            package: a.data.data.package,
                            signType: "MD5",
                            paySign: a.data.data.paySign,
                            success: function(a) {
                                wx.switchTab({
                                    url: "/weixinmao_jz/pages/myorderlist/index"
                                });
                            },
                            fail: function(a) {}
                        });
                    },
                    fail: function(a) {
                        console.log(a);
                    }
                }) : wx.showModal({
                    title: "提示",
                    content: a.data.data.msg,
                    showCancel: !1
                });
            }
        }) : app.util.request({
            url: "entry/wxapp/Paylastmoney",
            data: {
                id: o,
                sessionid: n.sessionid,
                uid: n.memberInfo.uid,
                couponid: t.data.couponid
            },
            success: function(a) {
                if (!a.data.message.errno) {
                    if (0 != a.data.data.error) return void wx.showModal({
                        title: "提示",
                        content: a.data.data.msg,
                        showCancel: !1
                    });
                    wx.showModal({
                        title: "提示",
                        content: a.data.data.msg,
                        showCancel: !1,
                        success: function() {
                            wx.switchTab({
                                url: "/weixinmao_jz/pages/myorderlist/index"
                            });
                        }
                    });
                }
            }
        });
    },
    toMymoneyrecord: function() {
        wx.navigateTo({
            url: "/weixinmao_zp/pages/mymoneyrecord/index"
        });
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});