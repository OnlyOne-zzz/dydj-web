var app = getApp();

Page({
    data: {
        addresslist: {},
        active: false
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
    setmoren: function(e){
        this.setData({
            active: !this.data.active
        })
        if(this.data.active) {
            wx.showToast({
                title: '设为默认成功',
                icon: 'success',
                duration: 2000
              })
        } else {
            wx.showToast({
                title: '取消默认成功',
                icon: 'success',
                duration: 2000
              })
        }
    },
    edit:function(e){
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/weixinmao_jz/pages/getaddress/index?id="+id
        });
    },
    delete:function(e){
        var pageObj = this;
        let id = e.currentTarget.dataset.id;
        wx.showModal({
        title: '提示',
        content: '确定删除此地址吗？',
        success (res) {
            if (res.confirm) {
                app.util.request({
                    url: "entry/wxapp/Deladdress",
                    data: {
                        id: id
                    },
                    success: function(a) {
                        if (!a.data.message.errno) {
                            pageObj.onLoad()
                        }
                    }
                });
            } else if (res.cancel) {
            console.log('用户点击取消')
            }
        }
        })
    },
    
    addaddress: function(){
        wx.navigateTo({
            url: "/weixinmao_jz/pages/getaddress/index"
        });
    },
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