var _data, _Page;

function _defineProperty(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var WxParse = require("../../resource/wxParse/wxParse.js"), app = getApp();

Page((_defineProperty(_Page = {
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
        currentmoney: []
    }, _defineProperty(_data, "title", ""), _defineProperty(_data, "showmsg", !0), _defineProperty(_data, "showuser", !0), 
    _defineProperty(_data, "companyid", 0), _defineProperty(_data, "listid", 0), _data),
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
        if (a.data.listid = a.data.id, 0 < a.data.shopid) var o = a.data.shopid; else {
            o = t.shopid;
            a.data.shopid = o;
        }
        a.getlethousedetail();
    },
    toShopinfo: function(t) {
        wx.navigateBack();
    },
    tabClick: function(t) {
        var a = this, e = t.currentTarget.dataset.id;
        a.data.currentid = e, console.log(e), a.doCurrentmoney(), a.setData({
            currentid: e
        });
    },
    toOrder: function(t) {
        var a = this;
        if (console.log(a.data.listid), "" != a.data.listid) {
            var e = wx.getStorageSync("userInfo"), o = t.detail.formId, i = {
                sessionid: e.sessionid,
                listid: a.data.listid,
                uid: e.memberInfo.uid,
                form_id: o
            };
            app.util.request({
                url: "entry/wxapp/newsaveorder",
                data: i,
                success: function(t) {
                    if (0 != t.data.errno) return wx.hideLoading(), void wx.showModal({
                        title: "失败",
                        content: "提交失败",
                        showCancel: !1
                    });
                    if (0 != t.data.data.error) return wx.hideLoading(), void wx.showModal({
                        title: "失败",
                        content: "提交失败",
                        showCancel: !1
                    });
                    var a = t.data.data.orderid;
                    wx.showToast({
                        title: "提交成功",
                        icon: "success",
                        duration: 2e3,
                        success: function(t) {
                            console.log(t), wx.navigateTo({
                                url: "/weixinmao_jz/pages/done/index?orderid=" + a
                            });
                        }
                    });
                }
            });
        } else wx.showModal({
            title: "提示",
            content: "请选择服务项目",
            showCancel: !1
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
        var t = this.data.currentid, a = this.data.shopid;
        console.log(a), wx.navigateTo({
            url: "/weixinmao_jz/pages/msgdone/index?currentid=" + t + "&shopid=" + a
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
    onShow: function() {},
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
    onShareAppMessage: function() {},
    getlethousedetail: function() {
        var a = this, t = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/Getcontentdetail",
            data: {
                id: a.data.id,
                sessionid: t.sessionid,
                uid: t.memberInfo.uid
            },
            success: function(t) {
                t.data.message.errno || (a.data.title = t.data.data.list.title, t.data.data.intro.maincolor || (t.data.data.intro.maincolor = "#09ba07"), 
                wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: t.data.data.intro.maincolor,
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }), wx.setNavigationBarTitle({
                    title: a.data.title
                }), a.setData({
                    data: t.data.data.list,
                    piclist: t.data.data.piclist,
                    content: WxParse.wxParse("article", "html", t.data.data.list.content, a, 5),
                    ispay: t.data.data.ispay,
                    intro: t.data.data.intro
                }));
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    }
}, "onShareAppMessage", function() {
    return {
        title: this.data.title,
        path: "/weixinmao_jz/pages/contentorderdetail/index?id=" + this.data.id
    };
}), _defineProperty(_Page, "checkuser", function(a) {
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
}), _defineProperty(_Page, "pay", function(t) {
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
}), _defineProperty(_Page, "myprice", function(t) {
    this.data.showmsg = !1, this.setData({
        showmsg: this.data.showmsg
    });
}), _defineProperty(_Page, "mynotice", function(t) {
    this.data.showuser = !1, this.setData({
        showuser: this.data.showuser
    });
}), _defineProperty(_Page, "savemessage", function(t) {
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
}), _defineProperty(_Page, "saveuserinfo", function(t) {
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
}), _defineProperty(_Page, "closemsg", function(t) {
    this.data.showmsg = !0, this.setData({
        showmsg: this.data.showmsg
    });
}), _defineProperty(_Page, "closeuser", function(t) {
    this.data.showuser = !0, this.setData({
        showuser: this.data.showuser
    });
}), _Page));