var R_htmlToWxml = require("../../resource/js/htmlToWxml.js"), imageUtil = require("../../resource/js/images.js"), app = getApp();

Page({
    data: {
        showmsg: !0,
        isuser: !0,
        tel: ""
    },
    onLoad: function(e) {
        var o = this;
        wx.setNavigationBarTitle({
            title: "会员中心"
        }), app.util.request({
            url: "entry/wxapp/Intro",
            success: function(e) {
                if (!e.data.message.errno) {
                    if (wx.setStorageSync("companyinfo", e.data.data.intro), wx.setNavigationBarTitle({
                        title: wx.getStorageSync("companyinfo").name
                    }), e.data.data.intro.maincolor || (e.data.data.intro.maincolor = "#09ba07"), wx.setNavigationBarColor({
                        frontColor: "#ffffff",
                        backgroundColor: e.data.data.intro.maincolor,
                        animation: {
                            duration: 400,
                            timingFunc: "easeIn"
                        }
                    }), 0 == e.data.data.intro.isright) {
                        var a = wx.getStorageSync("userInfo");
                        console.log(a), a ? o.dealuserinfo() : (o.data.isuser = !0, console.log("mmmmmmm"));
                    } else o.dealuserinfo();
                    o.setData({
                        isuser: o.data.isuser
                    }), console.log(o.data.isuser), o.data.tel = e.data.data.intro.tel, o.setData({
                        intro: e.data.data.intro,
                        isshow: !1
                    });
                }
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
        var a = wx.getStorageSync("userInfo");
        if (console.log(a), a && a.hasOwnProperty("wxInfo")) {
            var t = a.memberInfo.uid;
            app.util.request({
                url: "entry/wxapp/sysInitUserinfo",
                data: {
                    uid: t
                },
                success: function(e) {
                    console.log("优惠券")
                    console.log(e)
                    e.data.message.errno || o.setData({
                        moneyrecordinfo: e.data.data.moneyrecordinfo,
                        couponCount:e.data.data.coupon_count
                    });
                }
            });
        }
        wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
    },
    toAgent: function() {
        var e = wx.getStorageSync("userInfo").memberInfo.uid;
        app.util.request({
            url: "entry/wxapp/Checkagent",
            data: {
                uid: e
            },
            success: function(e) {
                if (!e.data.message.errno) {
                    if (0 != e.data.data.error) return 1 == e.data.data.error ? void wx.showModal({
                        title: "提示",
                        content: e.data.data.msg,
                        showCancel: !1
                    }) : void wx.showModal({
                        title: "提示",
                        content: e.data.data.msg,
                        showCancel: !1,
                        success: function() {
                            wx.navigateTo({
                                url: "/weixinmao_jz/pages/regagent/index"
                            });
                        }
                    });
                    wx.navigateTo({
                        url: "/weixinmao_jz/pages/agentcenter/index"
                    });
                }
            }
        });
    },
    toGetusermoney: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/getusermoney/index"
        });
    },
    dealuserinfo: function() {
        var a = this, o = wx.getStorageSync("userInfo");
        if (console.log(o), o) if (o.hasOwnProperty("wxInfo")) {
            a.data.isuser = !1, console.log("eeeeeeeeeeeeesssss");
            var e = o.memberInfo.uid;
            app.util.request({
                url: "entry/wxapp/Checkusertel",
                data: {
                    uid: e
                },
                success: function(e) {
                    e.data.message.errno || (a.data.isphone = e.data.data.isphone, a.setData({
                        isphone: a.data.isphone,
                        userinfo: o,
                        moneyrecordinfo: e.data.data.moneyrecordinfo,
                        countinfo: e.data.data.countinfo
                    }));
                }
            });
        } else a.data.isuser = !1; else a.data.isuser = !1;
    },
    bindGetUserInfo: function(e) {
        var n = this;
        app.util.getUserInfo(function(a) {
            console.log(a), n.data.isuser = !0;
            var e = a.memberInfo.uid, o = a.wxInfo.nickName, t = a.wxInfo.avatarUrl;
            0 < (n.data.uid = e) && (n.setData({
                userinfo: a,
                isphone: !1,
                isuser: n.data.isuser
            }), app.util.request({
                url: "entry/wxapp/Updateuserinfo",
                data: {
                    uid: e,
                    nickname: o,
                    avatarUrl: t
                },
                success: function(e) {
                    e.data.message.errno || (n.data.isuser = !1, n.data.isphone = e.data.data.isphone, 
                    n.setData({
                        userinfo: a,
                        isphone: n.data.isphone,
                        isuser: n.data.isuser
                    }));
                }
            }));
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
    toDomoney: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/domoney/index"
        });
    },
    toLogin: function() {
        0 < wx.getStorageSync("companyid") ? wx.navigateTo({
            url: "/weixinmao_jz/pages/companylogin/index"
        }) : wx.navigateTo({
            url: "/weixinmao_jz/pages/login/index"
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
    doaddress: function(){
        wx.navigateTo({
            url: "/weixinmao_jz/pages/selectaddress/index"
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
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading(), this.onLoad();
    },
    binduserinfo: function(e) {
        var a = this;
        a.data.showmsg = !1;
        var o = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/getuserinfo",
            data: {
                sessionid: o.sessionid,
                uid: o.memberInfo.uid
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
        var a = this, o = e.detail.value.name, t = e.detail.value.tel;
        a.data.showmsg = !0;
        var n = wx.getStorageSync("userInfo");
        "" != o ? "" != t ? app.util.request({
            url: "entry/wxapp/saveuserinfo",
            data: {
                sessionid: n.sessionid,
                uid: n.memberInfo.uid,
                name: o,
                tel: t
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
        var o = this, e = (a = a, wx.getStorageSync("userInfo"));
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
            o.setData({
                userinfo: e
            });
        }), !1) : (console.log("tmddddssssss222222"), app.util.getUserInfo(function(e) {
            o.setData({
                userinfo: e
            });
        }), !1);
    }
});