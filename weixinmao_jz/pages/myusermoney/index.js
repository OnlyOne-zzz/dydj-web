var app = getApp();

Page({
    data: {
        moneyinfo: ""
    },
    onLoad: function(o) {
        var a = this;
        wx.setNavigationBarTitle({
            title: "申请提现"
        });
        var n = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/getusermoney",
            data: {
                sessionid: n.sessionid,
                uid: n.memberInfo.uid
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
                }), a.data.moneyinfo = o.data.data.moneyinfo, a.setData({
                    moneyinfo: o.data.data.moneyinfo,
                    msg: o.data.data.msg
                }));
            }
        });
    },
    toGetmoney: function(o) {
        var a = this.data.moneyinfo, n = parseFloat(o.detail.value.money);
        if (console.log(n), "" == n || isNaN(n) || n <= 0) wx.showModal({
            title: "提示",
            content: "请输入提现金额",
            showCancel: !1
        }); else if (console.log(a.totalmoney), n > a.totalmoney) wx.showModal({
            title: "提示",
            content: "提现金额大于余额",
            showCancel: !1
        }); else {
            var t = wx.getStorageSync("userInfo");
            app.util.request({
                url: "entry/wxapp/dealusermoneyrecord",
                data: {
                    sessionid: t.sessionid,
                    uid: t.memberInfo.uid,
                    money: n,
                    type: "getmoney"
                },
                success: function(o) {
                    if (!o.data.message.errno) return 0 == o.data.data.error ? void wx.showModal({
                        title: "提示",
                        content: o.data.data.msg,
                        showCancel: !1,
                        success: function() {
                            wx.navigateTo({
                                url: "/weixinmao_jz/pages/domoney/index"
                            });
                        }
                    }) : void wx.showModal({
                        title: "提示",
                        content: o.data.data.msg,
                        showCancel: !1
                    });
                }
            });
        }
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {}
});