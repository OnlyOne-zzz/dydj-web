var app = getApp();

Page({
    data: {
        addresslist: {}
    },
    onLoad: function(a) {
        var i = this;
        wx.setNavigationBarTitle({
            title: "我的地址"
        });
        var t = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/myaddresslist",
            data: {
                sessionid: t.sessionid,
                uid: t.memberInfo.uid
            },
            success: function(a) {
                if (!a.data.message.errno) {
                    a.data.data.intro.maincolor || (a.data.data.intro.maincolor = "#09ba07"), wx.setNavigationBarColor({
                        frontColor: "#ffffff",
                        backgroundColor: a.data.data.intro.maincolor,
                        animation: {
                            duration: 400,
                            timingFunc: "easeIn"
                        }
                    });
                    for (var t = a.data.data.list, n = i.data.addresslist, o = 0; o < t.length; o++) n[t[o].id] = t[o];
                    i.data.addresslist = n, console.log(i.data.addresslist), i.setData({
                        list: a.data.data.list,
                        intro: a.data.data.intro
                    });
                }
            }
        });
    },
    onReady: function() {},
    selectaddress: function(a) {
        var t = a.currentTarget.dataset.id, n = this.data.addresslist;
        wx.setStorageSync("addressinfo", n[t]), wx.navigateBack({
            changed: !0
        });
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});