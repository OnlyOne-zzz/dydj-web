var app = getApp();

Page({
    data: {
        title: "",
        special: "",
        imagelist: [],
        uploadimagelist: [ "", "", "", "", "", "" ],
        true1: !0,
        true2: !0,
        true3: !0,
        true4: !0,
        true5: !0,
        true6: !0,
        arealist: [],
        toplist: [],
        areaid: 0,
        toplistid: 0,
        date: "",
        datetime: "",
        orderid: ""
    },
    onLoad: function(t) {
        if (console.log(t.id), wx.setNavigationBarTitle({
            title: "报价列表"
        }), "" != this.data.orderid) this.data.orderid; else {
            t.id;
            this.data.orderid = t.id;
        }
        this.setData({
            isshow: !0
        }), this.oldhouseinit();
    },
    oldhouseinit: function(t) {
        var e = this, a = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/getmsgmoney",
            data: {
                orderid: e.data.orderid,
                sessionid: a.sessionid,
                uid: a.memberInfo.uid
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
                }), e.setData({
                    moneylist: t.data.data.moneylist,
                    intro: t.data.data.intro,
                    isshow: !1
                }));
            }
        });
    },
    doagree: function(t) {
        var e = this, a = t.currentTarget.dataset.id, o = wx.getStorageSync("userInfo");
        wx.showModal({
            title: "信息提示",
            content: "确定同意报价？",
            success: function(t) {
                t.confirm && app.util.request({
                    url: "entry/wxapp/AgreeMsgmoney",
                    data: {
                        id: a,
                        status: 3,
                        sessionid: o.sessionid,
                        uid: o.memberInfo.uid
                    },
                    success: function(t) {
                        t.data.message.errno || e.oldhouseinit();
                    }
                });
            }
        });
    },
    dounagree: function(t) {
        var e = this, a = t.currentTarget.dataset.id, o = wx.getStorageSync("userInfo");
        wx.showModal({
            title: "信息提示",
            content: "确定拒绝报价？",
            success: function(t) {
                t.confirm && app.util.request({
                    url: "entry/wxapp/AgreeMsgmoney",
                    data: {
                        id: a,
                        status: -3,
                        sessionid: o.sessionid,
                        uid: o.memberInfo.uid
                    },
                    success: function(t) {
                        t.data.message.errno || e.oldhouseinit();
                    }
                });
            }
        });
    },
    pay: function(t) {
        var e = this.data.orderid, a = wx.getStorageSync("userInfo");
        console.log(e), wx.showModal({
            title: "确认支付",
            content: "确认支付？",
            success: function(t) {
                t.confirm && app.util.request({
                    url: "entry/wxapp/pay",
                    data: {
                        orderid: e,
                        sessionid: a.sessionid,
                        uid: a.memberInfo.uid
                    },
                    success: function(t) {
                        console.log(t), t.data && t.data.data && wx.requestPayment({
                            timeStamp: t.data.data.timeStamp,
                            nonceStr: t.data.data.nonceStr,
                            package: t.data.data.package,
                            signType: "MD5",
                            paySign: t.data.data.paySign,
                            success: function(t) {
                                console.log(t), wx.switchTab({
                                    url: "/weixinmao_jz/pages/matchorder/index"
                                });
                            },
                            fail: function(t) {
                                console.log("取消支付");
                            }
                        });
                    },
                    fail: function(t) {
                        console.log(t);
                    }
                });
            }
        });
    },
    getaddress: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/getaddress/index"
        });
    },
    selectaddress: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/selectaddress/index"
        });
    },
    onReady: function() {},
    onShow: function() {
        this.setData({
            addressinfo: wx.getStorageSync("addressinfo")
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    bindDateChange: function(t) {
        this.data.date = t.detail.value, console.log(t.detail.value), this.setData({
            dates: t.detail.value
        });
    },
    bindTimeChange: function(t) {
        this.data.datetime = t.detail.value, console.log(t.detail.value), this.setData({
            datetime: t.detail.value
        });
    },
    uploadimg: function(t, i) {
        var e = app.util.geturl({
            url: "entry/wxapp/upload"
        });
        i = i;
        wx.showToast({
            icon: "loading",
            title: "正在上传"
        });
        var n = this;
        wx.uploadFile({
            url: e,
            filePath: t[0],
            name: "file",
            header: {
                "Content-Type": "multipart/form-data"
            },
            formData: {
                session_token: wx.getStorageSync("session_token")
            },
            success: function(t) {
                var e = JSON.parse(t.data);
                if (200 == t.statusCode) for (var a = e.data.path, o = 0; o < n.data.uploadimagelist.length; o++) {
                    o + 1 == i && (n.data.uploadimagelist[o] = a);
                } else wx.showModal({
                    title: "提示",
                    content: "上传失败",
                    showCancel: !1
                });
            },
            fail: function(t) {
                wx.showModal({
                    title: "提示",
                    content: "上传失败",
                    showCancel: !1
                });
            },
            complete: function() {
                wx.hideToast();
            }
        });
    },
    checkboxChange: function(t) {
        var e = t.detail.value;
        this.data.special = e.join(",");
    },
    checkuser: function(e) {
        var a = this, t = (e = e, wx.getStorageSync("userInfo"));
        return console.log(t), t ? t.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: t.sessionid,
                uid: t.memberInfo.uid
            },
            success: function(t) {
                console.log("payyyy"), 0 == t.data.data.error ? e.doServices() : 2 == t.data.data.error && e.doElseServices();
            }
        }) : (app.util.getUserInfo(), !1) : (app.util.getUserInfo(function(t) {
            a.oldhouseinit();
        }), !1);
    }
});