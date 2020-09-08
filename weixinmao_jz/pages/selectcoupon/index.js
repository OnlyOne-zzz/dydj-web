var  app = getApp();

Page({
    data: {
        id: 1,
        ordertype: 0,
        active: 0,
        back: '',
        contentid:0
    },
    onLoad: function(a) {
        var t = this;
        if(""!=t.data.contentid || 0!=t.data.contentid) this.data.contentid;else{
            this.data.contentid = a.contentid;
        }
        wx.setNavigationBarTitle({
            title: "可使用卡券"
        }), wx.getStorageSync("userInfo").sessionid ? t.InitPage() : app.util.getUserInfo(function() {
            t.InitPage();
        });
        t.data.back = a.back
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
            state: 1,
            contentId:t.data.contentid
        };
        this.loadConpenList(data);
    },
    loadConpenList:function(data){
        var t = this, o = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/couponOrderUserAvailableList",
            data: data,
            success: function(res) {
                console.log(res)
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
    select: function(e){
        let couponObj = e.currentTarget.dataset.obj;
        wx.setStorageSync('selectcoupon',couponObj)
        wx.navigateBack({
          delta: 1
        })
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