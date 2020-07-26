var R_htmlToWxml = require("../../resource/js/htmlToWxml.js"), imageUtil = require("../../resource/js/images.js"), app = getApp();

Page({
    data: {
        showmsg: !0,
        isuser: !0,
        tel: ""
    },
    onLoad: function(e) {
        var a = this;
        a.setData({
            isshow: !0
        });
        var t = {
            sessionid: "",
            wxInfo: "",
            memberInfo: ""
        };
        t = wx.getStorageSync("userInfo");
        console.log(t), t && t.hasOwnProperty("wxInfo") ? (a.data.isuser = !0, a.setData({
            userinfo: t
        })) : a.data.isuser = !1, a.setData({
            isuser: a.data.isuser
        }), wx.setNavigationBarTitle({
            title: "会员中心"
        }), app.util.request({
            url: "entry/wxapp/Intro",
            success: function(e) {
                e.data.message.errno || (wx.setStorageSync("companyinfo", e.data.data.intro), wx.setNavigationBarTitle({
                    title: wx.getStorageSync("companyinfo").name
                }), e.data.data.intro.maincolor || (e.data.data.intro.maincolor = "#09ba07"), wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: e.data.data.intro.maincolor,
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }), a.data.tel = e.data.data.intro.tel, a.setData({
                    intro: e.data.data.intro,
                    isshow: !1
                }));
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    bindGetUserInfo: function(e) {
        var a = this;
        app.util.getUserInfo(function(e) {
            console.log(e), a.data.isuser = !0, a.setData({
                userinfo: e,
                isuser: a.data.isuser
            });
        }, e.detail);
    },
    onReady: function() {},
    toOrderlist: function(e) {
        var a = e.currentTarget.dataset.id;
        console.log(a), wx.navigateTo({
            url: "/weixinmao_wy/pages/orderlist/index?id=" + a
        });
    },
    toMycoupon: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/mycoupon/index"
        });
    },
    toMyOrder: function() {
        wx.switchTab({
            url: "/weixinmao_jz/pages/myorderlist/index"
        });
    },
    doCall: function() {
        var e = this.data.tel;
        wx.makePhoneCall({
            phoneNumber: e
        });
    },
    toBindUser: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/binduser/index"
        });
    },
    toMymessageorder: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/mymsgorder/index"
        });
    },
    toMyletpub: function(e) {
        var a = e.currentTarget.dataset.id;
        console.log(a), wx.navigateTo({
            url: "/weixinmao_jz/pages/myletpub/index?id=" + a
        });
    },
    toMysalepub: function(e) {
        var a = e.currentTarget.dataset.id;
        console.log(a), wx.navigateTo({
            url: "/weixinmao_jz/pages/mysalepub/index?id=" + a
        });
    },
    toMyHouse: function(e) {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/myhouse/index"
        });
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    binduserinfo: function(e) {
        var a = this;
        a.data.showmsg = !1;
        var t = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/getuserinfo",
            data: {
                sessionid: t.sessionid,
                uid: t.memberInfo.uid
            },
            success: function(e) {
                a.setData({
                    user: e.data.data,
                    showmsg: a.data.showmsg
                });
            }
        });
    },
    saveuserinfo: function(e) {
        var a = this, t = e.detail.value.name, o = e.detail.value.tel;
        a.data.showmsg = !0;
        var n = wx.getStorageSync("userInfo");
        "" != t ? "" != o ? app.util.request({
            url: "entry/wxapp/saveuserinfo",
            data: {
                sessionid: n.sessionid,
                uid: n.memberInfo.uid,
                name: t,
                tel: o
            },
            success: function(e) {
                if (0 != e.data.errno) return wx.hideLoading(), void wx.showModal({
                    title: "失败",
                    content: e.data.msg,
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
            content: "请填写您的姓名",
            showCancel: !1
        });
    },
    closemsg: function(e) {
        this.data.showmsg = !0, this.setData({
            showmsg: this.data.showmsg
        });
    },
    onReachBottom: function() {},
    toMycouponlist: function(e) {
        wx.navigateTo({
            url: "/weixinmao_wy/pages/couponlist/index"
        });
    },
    Puboldhouse: function(e) {
        wx.navigateTo({
            url: "/weixinmao_wy/pages/pub/index"
        });
    },
    onShareAppMessage: function() {},
    checkuser: function(a) {
        var t = this, e = (a = a, wx.getStorageSync("userInfo"));
        return e ? e.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
            },
            success: function(e) {
                0 == e.data.data.error ? (console.log(a), a.doServices()) : 2 == e.data.data.error && a.doServices();
            }
        }) : (console.log("tmddddsssssqqqqs1111"), app.util.getUserInfo(function(e) {
            t.setData({
                userinfo: e
            });
        }), !1) : (console.log("tmddddssssss222222"), app.util.getUserInfo(function(e) {
            t.setData({
                userinfo: e
            });
        }), !1);
    }
});