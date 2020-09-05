var app = getApp();

Page({
    data: {
        title: "",
        special: "",
        imagelist: [],
        uploadimagelist: [ "", "", "", "", "", "" ],
        true1: !0,
        true2: !0,
        true3: !0,
        true4: !0,
        true5: !0,
        true6: !0,
        arealist: [],
        toplist: [],
        areaid: 0,
        toplistid: 0,
        date: "",
        datetime: "",
        orderid: "",
        model: 0,
        addressinfo: [],
        payway: 0,
        shopid: 0,
        currentid: 0,
        gooditems: [],
        time: '',
        goodsNum: 1,
        travel: 0,
        address: '',
        noteId:0,
        trafficType:0,
        name:'',
        contentId:0,
        tel:'',
        address:'',
        daddress:'',
        couponId:0,
        cardinfo: {},
        technician: {},
        distance:0,
        orderid: ""
    },
    onLoad: function(a) {
        var t = this;
        if ("" != t.data.shopid) this.data.shopid; else {
            a.shopid;
            this.data.shopid = a.shopid;
        }
        if ("" != t.data.currentid) this.data.currentid; else {
            a.currentid;
            this.data.currentid = a.currentid;
        }
        if ("" != t.data.noteId) var n = this.data.noteId; else {
            n = a.noteId;
            this.data.noteId = n;
        }
        t.setData({
            isshow: !0
        }), t.oldhouseinit();
        var u = wx.getStorageSync("userInfo");
        var addressInfoStorage = wx.getStorageSync("addressinfo");
        if(!addressInfoStorage){
            app.util.request({
                url: "entry/wxapp/myaddresslist",
                data: {
                    sessionid: u.sessionid,
                    uid: u.memberInfo.uid
                },
                success: function(a) {
                    var list = a.data.data.list;
                    if (!a.data.message.errno && list.length>0) {
                        wx.setStorageSync("addressinfo",list);
                    }
                }
            });
        }
      
    },
    numChange: function(e) {
        if(e.currentTarget.dataset['index'] == 1){
            this.setData({
                goodsNum: ++this.data.goodsNum
            })
        } else {
            if(this.data.goodsNum > 1){
                this.setData({
                    goodsNum: --this.data.goodsNum
                })
            }
        }
    },
    selectTravel: function(e){
        this.setData({
            travel: e.target.dataset.index
        })
        this.getFare(e.target.dataset.index);
    },
    oldhouseinit: function(a) {
        var t = this, e = wx.getStorageSync("userInfo");
        app.util.request({
            url: "entry/wxapp/Getgooditems",
            data: {
                currentid: t.data.currentid,
                shopid: t.data.shopid,
                sessionid: e.sessionid,
                uid: e.memberInfo.uid
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
                }), wx.setNavigationBarTitle({
                    title: "提交订单"
                }), t.data.gooditems = a.data.data.gooditems, t.setData({
                    msgcontent: a.data.data.msgcontent,
                    gooditems: a.data.data.gooditems,
                    addressinfo: a.data.data.addressinfo,
                    intro: a.data.data.intro,
                    isshow: !1
                }));
            }
        });
    },
    radioChange: function(a) {
        this.data.model = a.detail.value;
    },
    radioPayChange: function(a) {
        this.data.payway = a.detail.value;
    },
    inputChange: function(event){
        let view_name = event.detail.value
        this.setData({
            address: view_name    // worker: input框输入的值
        })
    },
    // 获取交通费用
    getFare: function(param){

        var pageObj = this;
        if(param=='undefined' || param == null || param==''){
            param = pageObj.data.trafficType;
        }
        app.util.request({
            url: "entry/wxapp/TravelFare",
            data: {
                type: param,
                distance: pageObj.data.distance
            },
            success: function(a) {
                console.log(a)
                if(!a.data.message.errno){
                    pageObj.setData({
                        fare:a.data.data
                    });
                }
            }
        });
    },
    pay: function(a) {
        var t = this, e = t.data.addressinfo || wx.getStorageSync("addressinfo"), o = a.detail.formId;
        let content = ''
        if(!e){
            content = '请先增加地址'
            wx.showModal({
                title: "提示",
                content: content,
                showCancel: !1
            });
            return false
        } else if(!e.daddress){
            content = '请完善门牌号'
            wx.showModal({
                title: "提示",
                content: content,
                showCancel: !1
            });
            return false
        } 
        // else if(!t.data.time){
        //     content = '请选择服务时间'
        //     wx.showModal({
        //         title: "提示",
        //         content: content,
        //         showCancel: !1
        //     });
        //     return false
        // } 
        else {
            var i = t.data.shopid, d = t.data.currentid,n = wx.getStorageSync("userInfo"), s = a.detail.value.content, r = t.data.payway;
            0 < t.data.gooditems.money ? wx.showModal({
                title: "确认支付",
                content: "确认支付？",
                success: function(a) {
                    a.confirm && app.util.request({
                        url: "entry/wxapp/paymsg",
                        data: {
                            currentid: d,
                            address: e.address,
                            time: t.data.time,
                            addressId: e.id,
                            shopid: i,
                            sessionid: n.sessionid,
                            uid: n.memberInfo.uid,
                            content: s,
                            form_id: o,
                            contentId:t.data.currentid,
                            noteid:t.data.noteId,
                            trafficType:t.data.trafficType,
                            name:e.name,
                            tel:e.tel,
                            daddress:e.daddress,
                            couponId:t.data.couponId,
                            type:r
                        },
                        success: function(a) {
                            console.log("支付方式")
                            console.log(r)
                            if(!a.data.message.errno){
                                if(r==1){
                                    wx.switchTab({
                                        url: "/weixinmao_jz/pages/mymsgorder/index?orderid=" + t
                                    });
                                }else{
                                    if (console.log(a), a.data && a.data.data) {
                                        var t = a.data.data.orderid;
                                        wx.requestPayment({
                                            timeStamp: a.data.data.timeStamp,
                                            nonceStr: a.data.data.nonceStr,
                                            package: a.data.data.package,
                                            signType: "MD5",
                                            paySign: a.data.data.paySign,
                                            success: function(a) {
                                                wx.navigateTo({
                                                        url: "/weixinmao_jz/pages/mymsgorder/index?orderid=" + t
                                                });
                                                    // wx.requestSubscribeMessage({
                                                    //     tmplIds: ['XXYWwGEL5T6f3OxBgmj-Y1CiYjgkwyvY-kwYGGmNpyE'],
                                                    //     success(res){
                                                    //         if(res['XXYWwGEL5T6f3OxBgmj-Y1CiYjgkwyvY-kwYGGmNpyE'] == 'accept'){
                                                    //             app.util.request({
                                                    //                 url: "entry/wxapp/SendMessageSmallSends",
                                                    //                 data: {
                                                    //                     templateId:'XXYWwGEL5T6f3OxBgmj-Y1CiYjgkwyvY-kwYGGmNpyE',
                                                    //                     orderNo:t
                                                    //                 },
                                                    //                 success: function(a) {
                                                    //                     console.log("订阅消息发送成功");
                                                    //                     console.log(a);
                                                    //                     wx.navigateTo({
                                                    //                         url: "/weixinmao_jz/pages/mymsgorder/index?orderid=" + t
                                                    //                     });
                                                    //                 },
                                                    //                 fail:function(){
                                                    //                     wx.navigateTo({
                                                    //                         url: "/weixinmao_jz/pages/mymsgorder/index?orderid=" + t
                                                    //                      });
                                                    //                 }
                                                    //             }); 
                                                    //         }
                                                    //     },
                                                    //     fail(){
                                                    //         wx.navigateTo({
                                                    //             url: "/weixinmao_jz/pages/mymsgorder/index?orderid=" + t
                                                    //         });
                                                    //         console.log('不授权订阅消息')
                                                    //     }
                                                    //   })
                                            },
                                            fail: function(a) {
                                                console.log("取消支付");
                                            }
                                        });
                                    }
                                }
                            }
                            // else{

                            // }
                            
                        },
                        fail: function(a) {
                            console.log(a);
                        }
                    });
                }
            }) 
            // : app.util.request({
            //     url: "entry/wxapp/Paytotalmoney",
            //     data: {
            //         sessionid: n.sessionid,
            //         model: t.data.model,
            //         addressid: e.id,
            //         uid: n.memberInfo.uid,
            //         form_id: o,
            //         content: s
            //     },
            //     // orderid: t.data.orderid,
            //     success: function(a) {
            //         if (!a.data.message.errno) {
            //             if (0 != a.data.data.error) return void wx.showModal({
            //                 title: "提示",
            //                 content: a.data.data.msg,
            //                 showCancel: !1
            //             });
            //             wx.showModal({
            //                 title: "提示",
            //                 content: a.data.data.msg,
            //                 showCancel: !1,
            //                 success: function() {
            //                     wx.navigateTo({
            //                         url: "/weixinmao_jz/pages/matchorder/index?orderid=" +  a.data.data.orderid
            //                     });
            //                 }
            //             });
            //         }
            //     }
            // }) 
            : app.util.request({
                url: "entry/wxapp/PayNomoney",
                data: {
                    sessionid: n.sessionid,
                    model: t.data.model,
                    addressid: e.id,
                    uid: n.memberInfo.uid,
                    form_id: o,
                    content: s
                },
                success: function(a) {
                    if (!a.data.message.errno) {
                        if (0 != a.data.data.error) return void wx.showModal({
                            title: "提示",
                            content: a.data.data.msg,
                            showCancel: !1
                        });
                        wx.showModal({
                            title: "提示",
                            content: a.data.data.msg,
                            showCancel: !1,
                            success: function() {
                                wx.navigateTo({
                                    url: "/weixinmao_jz/pages/matchorder/index?orderid=" + a.data.data.orderid
                                });
                            }
                        });
                    }
                }
            });
        }
        
    },
    bindTimeChange: function(e) {
        console.log('picker发送选择改变，携带值为', e.detail.value)
        this.setData({
            time: e.detail.value
        })
    },
    getaddress: function() {
        var t = this, a = wx.getStorageSync("addressinfo");
        if(a) {
            this.selectaddress()
        } else {
            wx.navigateTo({
                url: "/weixinmao_jz/pages/getaddress/index"
            });
        }
    },
    selectaddress: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/selectaddress/index"
        });
    },
    toNoteList:function(){
        wx.navigateTo({
            url: "/weixinmao_jz/pages/notelist/index"
        })
    },
    toMyCouponList: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/mycoupon/index?back=1"
        });
    },
    selectwaiter: function() {
        wx.navigateTo({
            url: "/weixinmao_jz/pages/technician/index?back=1"
        });
    },
    changeTraffic:function(obj){
        this.data.trafficType =  obj.target.dataset.index;
        this.getFare(this.data.trafficType );
         console.log(this.data.trafficType); 
    },
    onReady: function() {
    },
    onShow: function() {
        var noteCallback = this
        this.data.addressinfo = wx.getStorageSync("addressinfo") 
        this.setData({
            addressinfo: wx.getStorageSync("addressinfo")
        });
        this.setData({
            cardinfo: wx.getStorageSync('cardinfo')
        })
        this.getFare();
        if(noteCallback.data.noteId!=0){
            // 查询获取技师信息
            app.util.request({
                url: "entry/wxapp/Getnotedetail",
                data: {
                    id: noteCallback.data.noteId
                },
                success:function(obj){
                    let technician = wx.getStorageSync('technician')
                    if(!obj.data.message.errno && !technician){
                        noteCallback.setData({
                            noteObj: obj.data.data.workerdetail
                        });
                    } else {
                        noteCallback.setData({
                            noteObj: wx.getStorageSync('technician')
                        })
                    }
                }
            });
        }
    },
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    bindDateChange: function(a) {
        this.data.date = a.detail.value, console.log(a.detail.value), this.setData({
            dates: a.detail.value
        });
    },
    // bindTimeChange: function(a) {
    //     this.data.datetime = a.detail.value, console.log(a.detail.value), this.setData({
    //         datetime: a.detail.value
    //     });
    // },
    uploadimg: function(a, i) {
        var t = app.util.geturl({
            url: "entry/wxapp/upload"
        });
        i = i;
        wx.showToast({
            icon: "loading",
            title: "正在上传"
        });
        var d = this;
        wx.uploadFile({
            url: t,
            filePath: a[0],
            name: "file",
            header: {
                "Content-Type": "multipart/form-data"
            },
            formData: {
                session_token: wx.getStorageSync("session_token")
            },
            success: function(a) {
                var t = JSON.parse(a.data);
                if (200 == a.statusCode) for (var e = t.data.path, o = 0; o < d.data.uploadimagelist.length; o++) {
                    o + 1 == i && (d.data.uploadimagelist[o] = e);
                } else wx.showModal({
                    title: "提示",
                    content: "上传失败",
                    showCancel: !1
                });
            },
            fail: function(a) {
                wx.showModal({
                    title: "提示",
                    content: "上传失败",
                    showCancel: !1
                });
            },
            complete: function() {
                wx.hideToast();
            }
        });
    },
    checkboxChange: function(a) {
        var t = a.detail.value;
        this.data.special = t.join(",");
    },
    checkuser: function(t) {
        var e = this, a = (t = t, wx.getStorageSync("userInfo"));
        return console.log(a), a ? a.memberInfo.uid ? void app.util.request({
            url: "entry/wxapp/checkuserinfo",
            data: {
                sessionid: a.sessionid,
                uid: a.memberInfo.uid
            },
            success: function(a) {
                console.log("payyyy"), 0 == a.data.data.error ? t.doServices() : 2 == a.data.data.error && t.doElseServices();
            }
        }) : (app.util.getUserInfo(), !1) : (app.util.getUserInfo(function(a) {
            e.oldhouseinit();
        }), !1);
    }
});