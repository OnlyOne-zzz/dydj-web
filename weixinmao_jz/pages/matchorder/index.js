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
        orderid: "",
        tel: ""
    },
    onLoad: function(a) {
        var t = this;
        if (console.log(a.orderid), t.data.orderid = a.orderid, wx.setNavigationBarTitle({
            title: "订单进度"
        }), "" != this.data.orderid) this.data.orderid; else {
            a.orderid;
            this.data.orderid = a.orderid;
        }
        t.setData({
            isshow: !0
        }), t.oldhouseinit();
    },
    oldhouseinit: function(a) {
        var t = this, e = wx.getStorageSync("userInfo");
        console.log("orderid")
        console.log( t.data.orderid)
        app.util.request({
            url: "entry/wxapp/MatchOrderInfo",
            data: {
                orderid: t.data.orderid,
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
            },
            success: function(a) {
                console.log(a)
                a.data.message.errno || (a.data.data.intro.maincolor || (a.data.data.intro.maincolor = "#09ba07"), 
                wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: a.data.data.intro.maincolor,
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }), t.data.tel = a.data.data.intro.tel, t.setData({
                    orderinfo: a.data.data.orderinfo,
                    addressinfo: a.data.data.addressinfo,
                    order_detail: a.data.data.order_detail,
                    intro: a.data.data.intro,
                    noteinfo: a.data.data.noteinfo,
                    isshow: !1
                }));
            }
        });
    },
    doCall: function() {
        var a = this.data.tel;
        wx.makePhoneCall({
            phoneNumber: a
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
    setcomment: function(e) {
        var a = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_jz/pages/setcomment/index?orderId=" + a
        });
    },
    paymoney: function(e) {
        var t = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_jz/pages/paylastmoney/index?id=" + t
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
        var t = app.util.geturl({
            url: "entry/wxapp/upload"
        });
        i = i;
        wx.showToast({
            icon: "loading",
            title: "正在上传"
        });
        var n = this;
        wx.uploadFile({
            url: t,
            filePath: a[0],
            name: "file",
            header: {
                "Content-Type": "multipart/form-data"
            },
            formData: {
                session_token: wx.getStorageSync("session_token")
            },
            success: function(a) {
                var t = JSON.parse(a.data);
                if (200 == a.statusCode) for (var e = t.data.path, o = 0; o < n.data.uploadimagelist.length; o++) {
                    o + 1 == i && (n.data.uploadimagelist[o] = e);
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
        var t = a.detail.value;
        this.data.special = t.join(",");
    },
    checkuser: function(t) {
        var e = this, a = (t = t, wx.getStorageSync("userInfo"));
        return console.log(a), a ? a.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: a.sessionid,
                uid: a.memberInfo.uid
            },
            success: function(a) {
                console.log("payyyy"), 0 == a.data.data.error ? t.doServices() : 2 == a.data.data.error && t.doElseServices();
            }
        }) : (app.util.getUserInfo(), !1) : (app.util.getUserInfo(function(a) {
            e.oldhouseinit();
        }), !1);
    }
});