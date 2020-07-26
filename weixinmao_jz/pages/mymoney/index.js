var app = getApp();

Page({
    data: {
        moneyinfo: ""
    },
    onLoad: function(e) {
        var o = this;
        wx.setNavigationBarTitle({
            title: "申请提现"
        });
        var n = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/getmoney",
            data: {
                sessionid: n.sessionid,
                uid: n.memberInfo.uid
            },
            success: function(e) {
                e.data.message.errno || (o.data.moneyinfo = e.data.data.moneyinfo, o.setData({
                    moneyinfo: e.data.data.moneyinfo,
                    msg: e.data.data.msg
                }));
            }
        });
    },
    toGetmoney: function(e) {
        var o = this.data.moneyinfo, n = parseFloat(e.detail.value.money);
        if (console.log(n), "" == n || isNaN(n)) wx.showModal({
            title: "提示",
            content: "请输入提现金额",
            showCancel: !1
        }); else if (console.log(o.totalmoney), n > o.totalmoney) wx.showModal({
            title: "提示",
            content: "提现金额大于余额",
            showCancel: !1
        }); else {
            var a = wx.getStorageSync("userInfo");
            app.util.request({
                url: "entry/wxapp/dealmoneyrecord",
                data: {
                    sessionid: a.sessionid,
                    uid: a.memberInfo.uid,
                    money: n,
                    type: "getmoney"
                },
                success: function(e) {
                    if (!e.data.message.errno) return 0 == e.data.data.error ? void wx.showModal({
                        title: "提示",
                        content: e.data.data.msg,
                        showCancel: !1,
                        success: function() {
                            wx.navigateTo({
                                url: "/weixinmao_jz/pages/mymoneyrecord/index"
                            });
                        }
                    }) : void wx.showModal({
                        title: "提示",
                        content: e.data.data.msg,
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