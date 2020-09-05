var R_htmlToWxml = require("../../resource/js/htmlToWxml.js"), imageUtil = require("../../resource/js/images.js"), app = getApp();

Page({
    data: {
        id: 1,
        ordertype: 0,
        active: 0,
        back: ''
    },
    selectList(e){
        this.setData({
            active: e.target.dataset.index
        });
        var t = this, o = wx.getStorageSync("userInfo");
        console.log(e);
        var data = {
            uid: o.memberInfo.uid,
            state: e.target.dataset.index
        };
        this.loadConpenList(data);
    },
    onLoad: function(o) {
        var t = this;
        wx.setNavigationBarTitle({
            title: "我的优惠券"
        }), wx.getStorageSync("userInfo").sessionid ? t.InitPage() : app.util.getUserInfo(function() {
            t.InitPage();
        });
        t.data.back = o.back
    },
    onShow: function(o) {},
    employ: function(e){
        let card = {
            id: '0001',
            name: '大保健'
        }
        wx.setStorageSync("cardinfo",card);
        if(this.data.back){
            wx.navigateBack({delta: 1})
        } else {
            wx.switchTab({url:'/weixinmao_jz/pages/index/index'})
        }
    },
    InitPage: function() {
        var t = this, o = wx.getStorageSync("userInfo");
        var data = {
            uid: o.memberInfo.uid,
            state: 0
        };
        this.loadConpenList(data);
    },
    loadConpenList:function(data){
        var t = this, o = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/couponOrderUserList",
            data: data,
            success: function(res) {
                res.data.message.errno,
                wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: "#09ba07",
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }), t.setData({
                    list: res.data.data
                });
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