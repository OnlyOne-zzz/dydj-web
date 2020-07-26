var app = getApp();

Page({
    data: {
        picfile: "",
        shareImgSrc: "",
        savebtn: !0,
        myqrcode: "",
        myqrcodefile: "",
        houseinfo: "",
        id: 0
    },
    onLoad: function(e) {
        wx.setNavigationBarTitle({
            title: "生成推广卡片"
        }), this.getQrcodenewhouse();
    },
    getQrcodenewhouse: function() {
        var t = this, e = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/myagentspread",
            data: {
                uid: e.memberInfo.uid
            },
            success: function(e) {
                e.data.message.errno || (e.data.data.intro.maincolor || (e.data.data.intro.maincolor = "#3274e5"), 
                wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: e.data.data.intro.maincolor,
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }), t.data.myqrcode = e.data.data.myqrcode, t.data.houseinfo = e.data.data.houseinfo, 
                t.doShow());
            }
        });
    },
    onReady: function() {},
    onShow: function() {},
    reload: function() {
        this.onLoad();
    },
    doShow: function() {
        var t = this, e = t.data.houseinfo, o = wx.createCanvasContext("myCanvas");
        wx.showLoading({
            title: "正在生成推广卡片"
        }), wx.downloadFile({
            url: e.thumb,
            success: function(e) {
                200 === e.statusCode && (t.data.picfile = e.tempFilePath, wx.downloadFile({
                    url: t.data.myqrcode,
                    success: function(e) {
                        console.log(e.tempFilePath), t.data.myqrcodefile = e.tempFilePath, o.setFillStyle("white"), 
                        o.drawImage(t.data.picfile, 0, 0, 600, 320), o.setFillStyle("white"), o.fillRect(0, 340, 600, 580), 
                        o.drawImage(t.data.myqrcodefile, 180, 350, 255, 255), o.setFontSize(24), o.setFillStyle("#000000"), 
                        o.fillText("长按扫码进入平台", 200, 630), o.draw(), setTimeout(function() {
                            t.drawAfter();
                        }, 200);
                    }
                }));
            }
        });
    },
    drawAfter: function() {
        var t = this;
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            width: 600,
            height: 800,
            destWidth: 600,
            destHeight: 800,
            canvasId: "myCanvas",
            success: function(e) {
                console.log(e.tempFilePath), t.data.shareImgSrc = e.tempFilePath, setTimeout(function() {
                    wx.hideLoading();
                }, 2e3), t.setData({
                    shareImgSrc: e.tempFilePath,
                    savebtn: !1,
                    test: "aaaa"
                });
            },
            fail: function(e) {
                setTimeout(function() {
                    wx.hideLoading();
                }, 2e3), t.onLoad(), console.log(e);
            }
        });
    },
    savepic: function() {
        var t = this;
        wx.saveImageToPhotosAlbum({
            filePath: t.data.shareImgSrc,
            success: function(e) {
                wx.showModal({
                    title: "存图成功",
                    content: "图片成功保存到相册了，去发圈噻~",
                    showCancel: !1,
                    confirmText: "好哒",
                    confirmColor: "#72B9C3",
                    success: function(e) {
                        e.confirm && console.log("用户点击确定"), t.hideShareImg();
                    }
                });
            }
        });
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    checkuser: function(t) {
        var o = this, e = (t = t, wx.getStorageSync("userInfo"));
        return console.log(e), e ? e.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
            },
            success: function(e) {
                console.log("payyyy"), 0 == e.data.data.error ? t.doServices() : 2 == e.data.data.error && t.doElseServices();
            }
        }) : (app.util.getUserInfo(), !1) : (app.util.getUserInfo(function(e) {
            o.getQrcodenewhouse();
        }), !1);
    }
});