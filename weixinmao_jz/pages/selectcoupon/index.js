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
        wx.setNavigationBarTitle({
            title: "选择优惠券"
        }), wx.setNavigationBarColor({
            frontColor: "#ffffff",
            backgroundColor: "#3C9BDF",
            animation: {
                duration: 400,
                timingFunc: "easeIn"
            }
        });
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
    InitPage: function() {
        var t = this, o = wx.getStorageSync("userInfo");
        var data = {
            uid: o.memberInfo.uid,
            state: 1,
            contentId:t.data.contentid
        };
        console.log(data)
        this.loadConpenList(data);
    },
    loadConpenList:function(data){
        var t = this, o = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/couponOrderUserAvailableList",
            data: data,
            success: function(res) {
                console.log(res)
                // res.data.message.errno,
                t.setData({
                    list: res.data.data
                });
            }
        });
    },
    select: function(e){      
        var pages = getCurrentPages();
        var currPage = pages[pages.length - 1];   //当前页面
        var prevPage = pages[pages.length - 2];
        let money = e.currentTarget.dataset.money;
        prevPage.setData({
            selectcoupon:money
        })
        // wx.setStorageSync('selectcoupon',money)
        wx.navigateBack({
          delta: 1
        })
      },
    onReady: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {
    },
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