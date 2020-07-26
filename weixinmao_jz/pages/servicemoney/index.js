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
    onLoad: function(a) {
        var e = this;
        if (console.log(a.orderid), e.data.orderid = a.orderid, wx.setNavigationBarTitle({
            title: "服务报价"
        }), "" != this.data.orderid) this.data.orderid; else {
            a.orderid;
            this.data.orderid = a.orderid;
        }
        e.setData({
            isshow: !0
        }), e.oldhouseinit();
    },
    oldhouseinit: function(a) {
        var e = this, t = wx.getStorageSync("userInfo");
        console.log(e.data.orderid), app.util.request({
            url: "entry/wxapp/getCompanyOrderInfo",
            data: {
                orderid: e.data.orderid,
                sessionid: t.sessionid,
                uid: t.memberInfo.uid
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
                    orderinfo: a.data.data.orderinfo,
                    addressinfo: a.data.data.addressinfo,
                    order_detail: a.data.data.order_detail,
                    order_mark: a.data.data.order_mark,
                    intro: a.data.data.intro,
                    isshow: !1
                }));
            }
        });
    },
    pay: function(a) {
        var e = this.data.orderid, t = wx.getStorageSync("userInfo"), o = a.detail.value.content, i = a.detail.value.money, n = 0;
        "" != o ? "" != i ? (wx.getStorageSync("tid") && (n = wx.getStorageSync("tid")), 
        console.log(e), wx.showModal({
            title: "信息提示",
            content: "确认报价？",
            success: function(a) {
                a.confirm && app.util.request({
                    url: "entry/wxapp/setcouponmoney",
                    data: {
                        tid: n,
                        status: 3,
                        money: i,
                        content: o,
                        orderid: e,
                        sessionid: t.sessionid,
                        uid: t.memberInfo.uid
                    },
                    success: function(a) {
                        console.log(a), a.data && a.data.data && (1 == a.data.data.error ? wx.showModal({
                            title: "提示",
                            content: a.data.data.msg,
                            showCancel: !1,
                            success: function() {
                                wx.navigateTo({
                                    url: "/weixinmao_jz/pages/myorder/index"
                                });
                            }
                        }) : wx.navigateTo({
                            url: "/weixinmao_jz/pages/myorder/index"
                        }));
                    },
                    fail: function(a) {
                        console.log(a);
                    }
                });
            }
        })) : wx.showModal({
            title: "提示",
            content: "请填写报价金额",
            showCancel: !1
        }) : wx.showModal({
            title: "提示",
            content: "请填写报价需求",
            showCancel: !1
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
    bindDateChange: function(a) {
        this.data.date = a.detail.value, console.log(a.detail.value), this.setData({
            dates: a.detail.value
        });
    },
    bindTimeChange: function(a) {
        this.data.datetime = a.detail.value, console.log(a.detail.value), this.setData({
            datetime: a.detail.value
        });
    },
    uploadimg: function(a, i) {
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
            filePath: a[0],
            name: "file",
            header: {
                "Content-Type": "multipart/form-data"
            },
            formData: {
                session_token: wx.getStorageSync("session_token")
            },
            success: function(a) {
                var e = JSON.parse(a.data);
                if (200 == a.statusCode) for (var t = e.data.path, o = 0; o < n.data.uploadimagelist.length; o++) {
                    o + 1 == i && (n.data.uploadimagelist[o] = t);
                } else wx.showModal({
                    title: "提示",
                    content: "上传失败",
                    showCancel: !1
                });
            },
            fail: function(a) {
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
    checkboxChange: function(a) {
        var e = a.detail.value;
        this.data.special = e.join(",");
    },
    checkuser: function(e) {
        var t = this, a = (e = e, wx.getStorageSync("userInfo"));
        return console.log(a), a ? a.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: a.sessionid,
                uid: a.memberInfo.uid
            },
            success: function(a) {
                console.log("payyyy"), 0 == a.data.data.error ? e.doServices() : 2 == a.data.data.error && e.doElseServices();
            }
        }) : (app.util.getUserInfo(), !1) : (app.util.getUserInfo(function(a) {
            t.oldhouseinit();
        }), !1);
    }
});