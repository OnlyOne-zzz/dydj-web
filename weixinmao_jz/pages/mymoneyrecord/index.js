var color, sucmoney, app = getApp(), money = 0, b = 0, yajinid = 0;

Page({
    data: {},
    onLoad: function() {
        wx.setNavigationBarTitle({
            title: "我的账户流水"
        });
        var t = this, a = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/getmoneyrecord",
            data: {
                sessionid: a.sessionid,
                uid: a.memberInfo.uid
            },
            success: function(a) {
                a.data.message.errno || (a.data.data.intro.maincolor || (a.data.data.intro.maincolor = "#09ba07"), 
                wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: a.data.data.intro.maincolor,
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }), t.setData({
                    list: a.data.data.moneyrecordlist
                }));
            }
        });
    }
});