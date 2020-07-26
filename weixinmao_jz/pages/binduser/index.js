var qqmapsdk, QQMapWX = require("../../resource/js/qqmap-wx-jssdk.min.js"), config = require("../../resource/js/config.js"), markersData = [], app = getApp();

Page({
    data: {},
    onLoad: function(e) {
        wx.setNavigationBarTitle({
            title: "绑定手机号"
        });
    },
    onReady: function() {},
    onShow: function() {
        var o = this;
        this.checkuser({
            doServices: function() {
                var e = wx.getStorageSync("userInfo");
                console.log(e.wxInfo), o.setData({
                    userinfo: e
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    checkuser: function(o) {
        var n = this, e = (o = o, wx.getStorageSync("userInfo"));
        return e ? e.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
            },
            success: function(e) {
                0 == e.data.data.error ? (console.log(o), o.doServices()) : 2 == e.data.data.error && o.doServices();
            }
        }) : (console.log("tmddddsssssqqqqs1111"), app.util.getUserInfo(function(e) {
            n.setData({
                userinfo: e
            });
        }), !1) : (console.log("tmddddssssss222222"), app.util.getUserInfo(function(e) {
            n.setData({
                userinfo: e
            });
        }), !1);
    }
});