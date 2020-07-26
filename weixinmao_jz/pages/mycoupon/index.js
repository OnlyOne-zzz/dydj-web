var R_htmlToWxml = require("../../resource/js/htmlToWxml.js"), imageUtil = require("../../resource/js/images.js"), app = getApp();

Page({
    data: {
        id: 1,
        ordertype: 0
    },
    onLoad: function(o) {
        var t = this;
        wx.setNavigationBarTitle({
            title: "我的优惠券"
        }), wx.getStorageSync("userInfo").sessionid ? t.InitPage() : app.util.getUserInfo(function() {
            t.InitPage();
        });
    },
    onShow: function(o) {},
    InitPage: function() {
        var t = this, o = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/mycouponlist",
            data: {
                sessionid: o.sessionid,
                uid: o.memberInfo.uid
            },
            success: function(o) {
                o.data.message.errno || (o.data.data.intro.maincolor || (o.data.data.intro.maincolor = "#09ba07"), 
                wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: o.data.data.intro.maincolor,
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }), t.setData({
                    list: o.data.data.list,
                    intro: o.data.data.intro
                }));
            }
        });
    },
    onReady: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    checkuser: function(t) {
        var n = this, o = (t = t, wx.getStorageSync("userInfo"));
        return console.log(o), o ? o.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: o.sessionid,
                uid: o.memberInfo.uid
            },
            success: function(o) {
                console.log("payyyy"), 0 == o.data.data.error ? t.doServices() : 2 == o.data.data.error && t.doServices();
            }
        }) : (app.util.getUserInfo(), !1) : (app.util.getUserInfo(function(o) {
            n.InitPage();
        }), !1);
    }
});