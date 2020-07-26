var qqmapsdk, QQMapWX = require("../../resource/js/qqmap-wx-jssdk.min.js"), config = require("../../resource/js/config.js"), markersData = [], app = getApp();

Page({
    data: {
        autoplay: !0,
        interval: 3e3,
        duration: 1e3,
        showmsg: !0,
        date: "",
        jobdate: ""
    },
    onLoad: function(a) {
        wx.setNavigationBarTitle({
            title: "加入分销"
        }), app.util.request({
            url: "entry/wxapp/GetSysInit",
            data: {},
            success: function(a) {
                a.data.message.errno || (a.data.data.intro.maincolor || (a.data.data.intro.maincolor = "#3274e5"), 
                wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: a.data.data.intro.maincolor,
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }));
            },
            complete: function() {
                wx.hideNavigationBarLoading(), wx.stopPullDownRefresh();
            }
        });
    },
    bindDateChange: function(a) {
        this.data.date = a.detail.value, console.log(a.detail.value), this.setData({
            dates: a.detail.value
        });
    },
    bindDatejobChange: function(a) {
        this.data.jobdate = a.detail.value, console.log(a.detail.value), this.setData({
            jobdates: a.detail.value
        });
    },
    bindTimeChange: function(a) {
        this.data.datetime = a.detail.value, console.log(a.detail.value), this.setData({
            datetime: a.detail.value
        });
    },
    savepubinfo: function(a) {
        var t = wx.getStorageSync("userInfo"), e = a.detail.value.name, o = a.detail.value.tel, n = a.detail.value.weixin, i = a.detail.value.email, s = wx.getStorageSync("tid");
        if (s || (s = 0), "" != e) if ("" != o) if ("" != n) if ("" != i) {
            var l = {
                sessionid: t.sessionid,
                uid: t.memberInfo.uid,
                tid: s,
                name: e,
                weixin: n,
                tel: o,
                email: i
            };
            app.util.request({
                url: "entry/wxapp/saveregagent",
                data: l,
                success: function(a) {
                    if (0 != a.data.errno) return wx.hideLoading(), void wx.showModal({
                        title: "失败",
                        content: a.data.data.msg,
                        showCancel: !1
                    });
                    1 != a.data.data.error ? wx.showToast({
                        title: "提交成功",
                        icon: "success",
                        duration: 2e3,
                        success: function(a) {
                            console.log(a), wx.switchTab({
                                url: "/weixinmao_jz/pages/user/index"
                            });
                        }
                    }) : wx.showModal({
                        title: "提示",
                        content: a.data.data.msg,
                        showCancel: !1
                    });
                }
            });
        } else wx.showModal({
            title: "提示",
            content: "请输入您的电子邮箱",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请输入您的微信号",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请输入您的手机号",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请输入您的姓名",
            showCancel: !1
        });
    },
    toSaleLetPub: function(a) {
        var t = this;
        wx.navigateTo({
            url: "/weixinmao_wy/pages/saleletpub/index",
            success: function() {
                t.data.showmsg = !0, t.setData({
                    showmsg: t.data.showmsg
                });
            }
        });
    },
    goPub: function(a) {
        this.data.showmsg = !1, this.setData({
            showmsg: this.data.showmsg
        });
    },
    closemsg: function(a) {
        this.data.showmsg = !0, this.setData({
            showmsg: this.data.showmsg
        });
    },
    goMap: function(a) {
        wx.openLocation({
            latitude: parseFloat(wx.getStorageSync("companyinfo").lat),
            longitude: parseFloat(wx.getStorageSync("companyinfo").lng),
            scale: 18,
            name: wx.getStorageSync("companyinfo").name,
            address: wx.getStorageSync("companyinfo").address
        });
    },
    onReady: function() {},
    bindInput: function(a) {
        this.setData({
            inputValue: a.detail.value
        }), this.onShow();
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
        wx.showNavigationBarLoading(), this.onLoad();
    },
    doCall: function() {
        var a = this.data.textData.shop_tel;
        wx.makePhoneCall({
            phoneNumber: a
        });
    },
    onShareAppMessage: function() {
        return {
            title: wx.getStorageSync("companyinfo").name,
            path: "/weixinmao_wy/pages/index/index"
        };
    }
});