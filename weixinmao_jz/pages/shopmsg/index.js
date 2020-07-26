var R_htmlToWxml = require("../../resource/js/htmlToWxml.js"), imageUtil = require("../../resource/js/images.js"), app = getApp();

Page({
    data: {
        showmsg: !0
    },
    onLoad: function(s) {
        wx.setNavigationBarTitle({
            title: "接收消息设置"
        });
    },
    onReady: function() {},
    onShow: function() {
        var e = this, s = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/getshopmsg",
            data: {
                sessionid: s.sessionid,
                uid: s.memberInfo.uid
            },
            success: function(s) {
                s.data.message.errno || e.setData({
                    msgcount: s.data.data.msgcount
                });
            }
        });
    },
    bindMsg: function(s) {
        var e = this, t = wx.getStorageSync("userInfo");
        (e = this).data.showmsg = !0;
        var o = s.detail.formId, a = (t = wx.getStorageSync("userInfo"), wx.getStorageSync("companyid"));
        app.util.request({
            url: "entry/wxapp/saveshopmsg",
            data: {
                form_id: o,
                sessionid: t.sessionid,
                uid: t.memberInfo.uid,
                companyid: a
            },
            success: function(s) {
                if (0 != s.data.errno) return wx.hideLoading(), void wx.showModal({
                    title: "失败",
                    content: s.data.msg,
                    showCancel: !1
                });
                wx.showToast({
                    title: "操作成功",
                    icon: "success",
                    duration: 2e3
                }), e.setData({
                    msgcount: s.data.data.msgcount
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    binduserinfo: function(s) {
        var e = this;
        e.data.showmsg = !1;
        var t = wx.getStorageSync("userInfo"), o = wx.getStorageSync("companyid");
        app.util.request({
            url: "entry/wxapp/getuserinfo",
            data: {
                companyid: o,
                sessionid: t.sessionid,
                uid: t.memberInfo.uid
            },
            success: function(s) {
                e.setData({
                    user: s.data.data,
                    showmsg: e.data.showmsg
                });
            }
        });
    },
    saveuserinfo: function(s) {
        var e = this, t = s.detail.value.name, o = s.detail.value.tel;
        e.data.showmsg = !0;
        var a = wx.getStorageSync("userInfo"), n = wx.getStorageSync("companyid");
        "" != t ? "" != o ? app.util.request({
            url: "entry/wxapp/saveshopuserinfo",
            data: {
                companyid: n,
                sessionid: a.sessionid,
                uid: a.memberInfo.uid,
                name: t,
                tel: o
            },
            success: function(s) {
                if (0 != s.data.errno) return wx.hideLoading(), void wx.showModal({
                    title: "失败",
                    content: s.data.msg,
                    showCancel: !1
                });
                wx.showToast({
                    title: "操作成功",
                    icon: "success",
                    duration: 2e3
                }), e.setData({
                    showmsg: e.data.showmsg
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
    closemsg: function(s) {
        this.data.showmsg = !0, this.setData({
            showmsg: this.data.showmsg
        });
    },
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    checkuser: function(e) {
        var t = this, s = (e = e, wx.getStorageSync("userInfo"));
        return s ? s.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: s.sessionid,
                uid: s.memberInfo.uid
            },
            success: function(s) {
                0 == s.data.data.error ? (console.log(e), e.doServices()) : 2 == s.data.data.error && e.doServices();
            }
        }) : (console.log("tmddddsssssqqqqs1111"), app.util.getUserInfo(function(s) {
            t.setData({
                userinfo: s
            });
        }), !1) : (console.log("tmddddssssss222222"), app.util.getUserInfo(function(s) {
            app.util.request({
                url: "entry/wxapp/checkuserinfo",
                data: {
                    sessionid: s.sessionid,
                    uid: s.memberInfo.uid
                },
                success: function(s) {
                    0 == s.data.data.error ? (console.log(e), e.doServices()) : 2 == s.data.data.error && e.doServices();
                }
            }), t.setData({
                userinfo: s
            });
        }), !1);
    }
});