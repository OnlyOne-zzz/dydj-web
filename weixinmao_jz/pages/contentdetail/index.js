var _data;

function _defineProperty(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var WxParse = require("../../resource/wxParse/wxParse.js"), app = getApp();

Page(_defineProperty({
    data: (_data = {
        images: {},
        autoplay: !0,
        interval: 3e3,
        duration: 1e3,
        hdimg: [],
        circular: !0,
        indicatorDots: !1,
        indicatorcolor: "#000",
        vertical: !1,
        imgheights: [],
        imgwidth: 750,
        current: 0,
        showpay: !0,
        paytype: 0,
        swiperCurrent: 0,
        title: "",
        address: "",
        lat: 0,
        lng: 0,
        id: 0,
        shopid: 0,
        currentid: 0,
        currentmoney: [],
        noteId:0
    }, _defineProperty(_data, "title", ""), _defineProperty(_data, "showmsg", !0), _defineProperty(_data, "showuser", !0), 
    _defineProperty(_data, "companyid", 0), _data),
    imageLoad: function(t) {
        var a = t.detail.width, e = a / (o = t.detail.height);
        console.log(a, o);
        var o = 750 / e, i = this.data.imgheights;
        i.push(o), this.setData({
            imgheights: i
        });
    },
    onLoad: function(t) {
        wx.setNavigationBarTitle({
            title: wx.getStorageSync("companyinfo").name
        });
        var a = this;
        if (0 < a.data.id) var e = a.data.id; else {
            e = t.id;
            a.data.id = e;
        }
        if (0 < a.data.shopid) var o = a.data.shopid; else {
            o = t.shopid;
            a.data.shopid = o;
        }
        if (0 < a.data.noteId) var n = a.data.noteId; else {
            n = t.noteId;
            a.data.noteId = n;
        }
        a.getlethousedetail();
    },
    toShopinfo: function(t) {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/notedetail/index?id=" + this.data.shopid
        });
    },
    tabClick: function(t) {
        var a = this, e = t.currentTarget.dataset.id;
        a.data.currentid = e, console.log(e), a.doCurrentmoney(), a.setData({
            currentid: e
        });
    },
    doOrder: function() {
        this.setData({
            is_add_cart_view: !0
        });
    },
    add_cart_close_bind: function() {
        this.setData({
            is_add_cart_view: !1
        });
    },
    swiperChange: function(t) {
        console.log(t), this.setData({
            swiperCurrent: t.detail.current
        });
    },
    toMsgdone: function() {
        var t = this.data.currentid, a = this.data.shopid , n = this.data.noteId;
        console.log(a), wx.navigateTo({
            url: "/weixinmao_jz/pages/msgdone/index?currentid=" + t + "&shopid=" + a +"&noteId=" +n
        });
    },
    goMap: function(t) {
        var a = this;
        console.log("ffffff"), wx.openLocation({
            latitude: parseFloat(a.data.lat),
            longitude: parseFloat(a.data.lng),
            scale: 18,
            name: a.data.title,
            address: a.data.address
        });
    },
    doCall: function(t) {
        var a = t.currentTarget.dataset.tel;
        wx.makePhoneCall({
            phoneNumber: a,
            success: function(t) {
                console.log("拨打电话成功！");
            },
            fail: function(t) {
                console.log(t), console.log("拨打电话失败！");
            }
        });
    },
    doSavecar: function(t) {
        var e = this, a = t.currentTarget.dataset.id;
        console.log(a), this.checkuser({
            doElseServices: function() {
                var t = wx.getStorageSync("userInfo");
                console.log(t);
                var a = e.data.id;
                app.util.request({
                    url: "entry/wxapp/savecar",
                    data: {
                        jobid: a,
                        sessionid: t.sessionid,
                        uid: t.memberInfo.uid
                    },
                    success: function(t) {
                        if (!t.data.message.errno) {
                            if (0 != t.data.data.error) return t.data.data.error, void wx.showModal({
                                title: "提示",
                                content: t.data.data.msg,
                                showCancel: !1
                            });
                            wx.showToast({
                                title: "收藏成功!",
                                icon: "success",
                                duration: 2e3
                            }), e.setData({
                                savestatus: 1
                            });
                        }
                    }
                });
            }
        });
    },
    onReady: function() {},
    onShow: function() {
        wx.removeStorageSync('cardinfo')
        wx.removeStorageSync('technician')
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading(), this.onLoad();
    },
    doCurrentmoney: function() {
        for (var t = this.data.currentmoney, a = this.data.currentid, e = 0; e < t.length; e++) t[e].id == a && this.setData({
            money: t[e].money
        });
    },
    onReachBottom: function() {},
    getlethousedetail: function() {
        var e = this, t = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/Getmsgcontentdetail",
            data: {
                id: e.data.id,
                sessionid: t.sessionid,
                uid: t.memberInfo.uid
            },
            success: function(t) {
                console.log(t)
                if (!t.data.message.errno) {
                    e.data.title = t.data.data.list.title, t.data.data.intro.maincolor || (t.data.data.intro.maincolor = "#09ba07"), 
                    wx.setNavigationBarColor({
                        frontColor: "#ffffff",
                        backgroundColor: t.data.data.intro.maincolor,
                        animation: {
                            duration: 400,
                            timingFunc: "easeIn"
                        }
                    }), wx.setNavigationBarTitle({
                        title: e.data.title + "-" + wx.getStorageSync("companyinfo").name
                    });
                    var a = t.data.data.gooditemslist;
                    e.data.currentmoney = a, e.data.currentid = a[0].id, e.setData({
                        data: t.data.data.list,
                        piclist: t.data.data.piclist,
                        gooditemslist: t.data.data.gooditemslist,
                        money: a[0].money,
                        currentid: a[0].id,
                        content: WxParse.wxParse("article", "html", t.data.data.list.content, e, 5),
                        ispay: t.data.data.ispay,
                        intro: t.data.data.intro
                    });
                }
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    onShareAppMessage: function() {
        return {
            title: this.data.title,
            path: "/weixinmao_jz/pages/contentdetail/index?id=" + this.data.id
        };
    },
    checkuser: function(a) {
        var e = this, t = (a = a, wx.getStorageSync("userInfo"));
        return console.log(t), t ? t.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: t.sessionid,
                uid: t.memberInfo.uid
            },
            success: function(t) {
                console.log("payyyy"), 0 == t.data.data.error ? a.doServices() : 2 == t.data.data.error && a.doElseServices();
            }
        }) : (app.util.getUserInfo(), !1) : (app.util.getUserInfo(function(t) {
            e.getlethousedetail();
        }), !1);
    },
    pay: function(t) {
        var o = this;
        o.checkuser({
            doServices: function() {
                o.data.showmsg = !1, o.setData({
                    showmsg: o.data.showmsg
                });
            },
            doElseServices: function() {
                var a = o.data.id, e = wx.getStorageSync("userInfo");
                wx.showModal({
                    title: "确认支付",
                    content: "确认支付定金？",
                    success: function(t) {
                        t.confirm && app.util.request({
                            url: "entry/wxapp/pay",
                            data: {
                                ordertype: "lethouse",
                                pid: a,
                                sessionid: e.sessionid,
                                uid: e.memberInfo.uid
                            },
                            success: function(t) {
                                console.log(t), t.data && t.data.data && wx.requestPayment({
                                    timeStamp: t.data.data.timeStamp,
                                    nonceStr: t.data.data.nonceStr,
                                    package: t.data.data.package,
                                    signType: "MD5",
                                    paySign: t.data.data.paySign,
                                    success: function(t) {
                                        console.log(t), o.setData({
                                            ispay: 1
                                        });
                                    },
                                    fail: function(t) {}
                                });
                            },
                            fail: function(t) {
                                console.log(t);
                            }
                        });
                    }
                });
            }
        });
    },
    myprice: function(t) {
        this.data.showmsg = !1, this.setData({
            showmsg: this.data.showmsg
        });
    },
    mynotice: function(t) {
        this.data.showuser = !1, this.setData({
            showuser: this.data.showuser
        });
    },
    savemessage: function(t) {
        var a = this, e = t.detail.value.name, o = t.detail.value.tel;
        a.data.showmsg = !0;
        var i = a.data.id;
        "" != e ? "" != o ? app.util.request({
            url: "entry/wxapp/savemessage",
            data: {
                money: e,
                tel: o,
                pid: i
            },
            success: function(t) {
                if (0 != t.data.errno) return wx.hideLoading(), void wx.showModal({
                    title: "失败",
                    content: t.data.msg,
                    showCancel: !1
                });
                wx.showToast({
                    title: "操作成功",
                    icon: "success",
                    duration: 2e3
                }), a.setData({
                    showmsg: a.data.showmsg
                });
            }
        }) : wx.showModal({
            title: "提示",
            content: "请填写您的手机号",
            showCancel: !1
        }) : wx.showModal({
            title: "提示",
            content: "请输入您的报价",
            showCancel: !1
        });
    },
    saveuserinfo: function(t) {
        var a = this, e = t.detail.value.name, o = t.detail.value.tel;
        a.data.showuser = !0;
        var i = a.data.id;
        "" != e ? "" != o ? app.util.request({
            url: "entry/wxapp/savebaoming",
            data: {
                name: e,
                tel: o,
                pid: i
            },
            success: function(t) {
                if (0 != t.data.errno) return wx.hideLoading(), void wx.showModal({
                    title: "失败",
                    content: t.data.msg,
                    showCancel: !1
                });
                wx.showToast({
                    title: "操作成功",
                    icon: "success",
                    duration: 2e3
                }), a.setData({
                    showuser: a.data.showuser
                });
            }
        }) : wx.showModal({
            title: "提示",
            content: "请填写您的手机号",
            showCancel: !1
        }) : wx.showModal({
            title: "提示",
            content: "请填写您的姓名",
            showCancel: !1
        });
    },
    closemsg: function(t) {
        this.data.showmsg = !0, this.setData({
            showmsg: this.data.showmsg
        });
    },
    closeuser: function(t) {
        this.data.showuser = !0, this.setData({
            showuser: this.data.showuser
        });
    }
}, "onShareAppMessage", function() {
    return console.log(this.data.id), {
        title: this.data.title,
        path: "/weixinmao_jz/pages/contentdetail/index?id=" + this.data.id
    };
}));