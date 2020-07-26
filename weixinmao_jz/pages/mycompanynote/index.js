var _data, _Page;

function _defineProperty(e, a, t) {
    return a in e ? Object.defineProperty(e, a, {
        value: t,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[a] = t, e;
}

var qqmapsdk, QQMapWX = require("../../resource/js/qqmap-wx-jssdk.min.js"), app = getApp();

function isHasElementOne(e, a) {
    for (var t = 0, i = e.length; t < i; t++) if (e[t] == a) return t;
    return -1;
}

function isHasElementTwo(e, a) {
    for (var t = 0, i = e.length; t < i; t++) if (e[t].id == a) return t;
    return -1;
}

Page((_defineProperty(_Page = {
    data: (_data = {
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
        true7: !0,
        arealist: [],
        areaindexid: 0,
        jobcate: [],
        jobcateid: 0
    }, _defineProperty(_data, "special", 0), _defineProperty(_data, "toplist", []), 
    _defineProperty(_data, "cityinfo", []), _defineProperty(_data, "areaid", 0), _defineProperty(_data, "toplistid", 0), 
    _defineProperty(_data, "sex", 1), _defineProperty(_data, "speciallist", [ {
        name: "五险一金",
        checked: !1
    }, {
        name: "补充医疗保险",
        checked: !1
    }, {
        name: "员工旅游",
        checked: !1
    }, {
        name: "交通补贴",
        checked: !1
    }, {
        name: "餐饮补贴",
        checked: !1
    }, {
        name: "出国机会",
        checked: !1
    }, {
        name: "年终奖金",
        checked: !1
    }, {
        name: "定期体检",
        checked: !1
    } ]), _defineProperty(_data, "birthday", [ "1960", "1961", "1962", "1963", "1964", "1965", "1966", "1967", "1968", "1969", "1970", "1971", "1972", "1973", "1974", "1975", "1976", "1977", "1978", "1979", "1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989", "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999", "2000" ]), 
    _defineProperty(_data, "birthdayindex", -1), _defineProperty(_data, "birthdayname", ""), 
    _defineProperty(_data, "education", [ "初中", "高中", "中技", "中专", "大专", "本科", "硕士", "博士", "博后" ]), 
    _defineProperty(_data, "educationindex", -1), _defineProperty(_data, "educationname", ""), 
    _defineProperty(_data, "express", [ "无经验", "1年以下", "1-3年", "3-5年", "5-10年", "10年以上" ]), 
    _defineProperty(_data, "expressindex", -1), _defineProperty(_data, "expressname", ""), 
    _defineProperty(_data, "currentstatus", [ "我目前已离职,可快速到岗", "我目前在职，但考虑换个新环境", "观望有好的机会再考虑", "目前暂无跳槽打算", "应届毕业生" ]), 
    _defineProperty(_data, "currentstatusindex", -1), _defineProperty(_data, "currentstatusname", ""), 
    _defineProperty(_data, "worktype", [ "全职", "兼职", "实习" ]), _defineProperty(_data, "worktypeindex", -1), 
    _defineProperty(_data, "worktypename", ""), _defineProperty(_data, "money", [ "1千~2千/月", "1千~2千/月", "2千~3千/月", "3千~4千/月", "4千~5千/月", "5千~1万/月", "1万以上/月" ]), 
    _defineProperty(_data, "moneyindex", -1), _defineProperty(_data, "moneyname", ""), 
    _defineProperty(_data, "id", 0), _defineProperty(_data, "lat", 0), _defineProperty(_data, "lng", 0), 
    _data),
    onLoad: function(e) {
        var i = this;
        i.data.id = e.id, wx.setNavigationBarTitle({
            title: "企业店铺入驻资料-" + wx.getStorageSync("companyinfo").name
        });
        var a = wx.getStorageSync("cityinfo");
        a ? (wx.setStorageSync("city", a.name), i.oldhouseinit()) : (qqmapsdk = new QQMapWX({
            key: "5D3BZ-J55WF-SFPJJ-NI6PG-YN2ZO-M4BHX"
        }), wx.getLocation({
            type: "gcj02",
            success: function(e) {
                qqmapsdk.reverseGeocoder({
                    location: {
                        latitude: e.latitude,
                        longitude: e.longitude
                    },
                    success: function(e) {
                        var a = e.result.address_component.city, t = a.substr(0, a.length - 1);
                        wx.setStorageSync("city", t), i.oldhouseinit();
                    }
                });
            },
            fail: function() {
                i.oldhouseinit();
            },
            complete: function() {}
        }));
    },
    oldhouseinit: function(e) {
        var a = this, t = wx.getStorageSync("userInfo"), i = (wx.getStorageSync("loginid"), 
        wx.getStorageSync("city"));
        app.util.request({
            url: "entry/wxapp/Getpubinit",
            data: {
                city: i,
                sessionid: t.sessionid,
                uid: t.memberInfo.uid
            },
            success: function(e) {
                if (!e.data.message.errno) if (e.data.data.intro.maincolor || (e.data.data.intro.maincolor = "#09ba07"), 
                wx.setNavigationBarColor({
                    frontColor: "#ffffff",
                    backgroundColor: e.data.data.intro.maincolor,
                    animation: {
                        duration: 400,
                        timingFunc: "easeIn"
                    }
                }), a.data.arealist = e.data.data.arealist, a.data.jobcate = e.data.data.catelist, 
                a.data.cityinfo = e.data.data.cityinfo, a.setData({
                    catelist: a.data.jobcate,
                    arealist: e.data.data.arealist,
                    city: e.data.data.cityinfo.name
                }), 1 == e.data.data.isbind) e.data.data.noteinfo; else a.setData({
                    catelist: a.data.jobcate,
                    arealist: e.data.data.arealist
                });
            }
        });
    },
    checkboxChange: function(e) {
        var a = e.detail.value;
        this.data.special = a.join(","), console.log("checkbox发生change事件，携带value值为：", e.detail.value);
    },
    bindAreaChange: function(e) {
        var a = this.data.arealist;
        a && (this.data.areaid = a[e.detail.value].id, this.data.areaindexid = e.detail.value), 
        this.setData({
            arealist: a,
            areaindexid: e.detail.value
        });
    },
    bindJobcateChange: function(e) {
        var a = this.data.jobcate;
        a && (this.data.jobcateindex = e.detail.value, this.data.jobcateid = a[e.detail.value].id), 
        this.setData({
            jobcate: a,
            jobcateindex: e.detail.value
        });
    },
    bindExpressChange: function(e) {
        var a = this.data.express;
        a && (this.data.expressindex = e.detail.value, this.data.expressname = a[e.detail.value]), 
        console.log(this.data.expressname), this.setData({
            express: a,
            expressindex: e.detail.value
        });
    },
    bindBirthdayChange: function(e) {
        var a = this.data.birthday;
        a && (this.data.birthdayindex = e.detail.value, this.data.birthdayname = a[e.detail.value]), 
        this.setData({
            birthday: a,
            birthdayindex: e.detail.value
        });
    },
    bindEducationChange: function(e) {
        var a = this.data.education;
        a && (this.data.educationindex = e.detail.value, this.data.educationname = a[e.detail.value]), 
        console.log(this.data.educationname), this.setData({
            education: a,
            educationindex: e.detail.value
        });
    },
    bindWorktypeChange: function(e) {
        var a = this.data.worktype;
        a && (this.data.worktypeindex = e.detail.value, this.data.worktypename = a[e.detail.value]), 
        console.log(this.data.worktypename), this.setData({
            worktype: a,
            worktypeindex: e.detail.value
        });
    },
    bindMoneyChange: function(e) {
        var a = this.data.money;
        a && (this.data.moneyindex = e.detail.value, this.data.moneyname = a[e.detail.value]), 
        console.log(this.data.moneyname), this.setData({
            money: a,
            moneyindex: e.detail.value
        });
    },
    bindCurrentstatusChange: function(e) {
        var a = this.data.currentstatus;
        a && (this.data.currentstatusindex = e.detail.value, this.data.currentstatusname = a[e.detail.value]), 
        console.log(this.data.currentstatusname), this.setData({
            currentstatus: a,
            currentstatusindex: e.detail.value
        });
    },
    bindToplistChange: function(e) {
        var a = this.data.toplist;
        a && (this.data.toplistid = a[e.detail.value].id), this.setData({
            toplist: a,
            toplistidindex: e.detail.value
        });
    },
    getaddress: function() {
        var a = this;
        wx.chooseLocation({
            success: function(e) {
                console.log(e.name), console.log(e.latitude), console.log(e.longitude), a.data.lat = e.latitude, 
                a.data.lng = e.longitude, a.setData({
                    address: e.name
                });
            },
            fail: function(e) {
                console.log(e);
            },
            complete: function() {}
        });
    },
    savepubinfo: function(e) {
        var a = wx.getStorageSync("userInfo"), t = (wx.getStorageSync("loginid"), e.detail.value.shopname), i = e.detail.value.name, n = e.detail.value.money, o = e.detail.value.address, d = this.data.jobcateid, s = e.detail.value.username, r = e.detail.value.tel, l = this.data.cityinfo, u = this.data.areaid, c = e.detail.value.content, h = e.detail.value.account, f = e.detail.value.password, p = e.detail.value.password2;
        if ("" != t) if (0 != d) if ("" != i) if ("" != o) if ("" != s) if ("" != r) if (0 != u) if ("" != c) if ("" != h) if ("" != f) if ("" != p) if (f == p) {
            var g = this.data.uploadimagelist;
            if (g.length < 2) wx.showModal({
                title: "提示",
                content: "上传图片不少于2张",
                showCancel: !1
            }); else {
                var m = g[0], y = g.join("@"), w = {
                    sessionid: a.sessionid,
                    uid: a.memberInfo.uid,
                    shopname: t,
                    name: i,
                    username: s,
                    money: n,
                    tel: r,
                    address: o,
                    lat: this.data.lat,
                    lng: this.data.lng,
                    cityid: l.id,
                    areaid: u,
                    content: c,
                    special: d,
                    avatarUrl: m,
                    account: h,
                    password: f,
                    type: 1,
                    uploadimagelist_str: y
                };
                app.util.request({
                    url: "entry/wxapp/Savenote",
                    data: w,
                    success: function(e) {
                        if (0 != e.data.errno) return wx.hideLoading(), void wx.showModal({
                            title: "失败",
                            content: e.data.data.msg,
                            showCancel: !1
                        });
                        var a = e.data.data.ispay;
                        wx.showToast({
                            title: "保存成功",
                            icon: "success",
                            duration: 2e3,
                            success: function(e) {
                                console.log(e), 1 == a ? wx.navigateTo({
                                    url: "/weixinmao_jz/pages/paycompanyrole/index"
                                }) : wx.navigateTo({
                                    url: "/weixinmao_jz/pages/login/index"
                                });
                            }
                        });
                    }
                });
            }
        } else wx.showModal({
            title: "提示",
            content: "两次密码不一致",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请输入确认密码",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请输入登录密码",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请输入登录账号",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请输入店铺简介",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请选择所属地区",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请填写联系人电话",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请填写联系人",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请填写店铺地址",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请填写企业名称",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请选择服务类目",
            showCancel: !1
        }); else wx.showModal({
            title: "提示",
            content: "请输入店铺名称",
            showCancel: !1
        });
    },
    onReady: function() {},
    radioChange: function(e) {
        this.data.sex = e.detail.value;
    },
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function() {},
    uploadimg: function(e, n) {
        var a = app.util.geturl({
            url: "entry/wxapp/upload"
        });
        n = n;
        wx.showToast({
            icon: "loading",
            title: "正在上传"
        });
        var o = this;
        wx.uploadFile({
            url: a,
            filePath: e[0],
            name: "file",
            header: {
                "Content-Type": "multipart/form-data"
            },
            formData: {
                session_token: wx.getStorageSync("session_token")
            },
            success: function(e) {
                var a = JSON.parse(e.data);
                if (200 == e.statusCode) for (var t = a.data.path, i = 0; i < o.data.uploadimagelist.length; i++) {
                    i + 1 == n && (o.data.uploadimagelist[i] = t);
                } else wx.showModal({
                    title: "提示",
                    content: "上传失败",
                    showCancel: !1
                });
            },
            fail: function(e) {
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
    upload: function(e) {
        e = e;
        this.doupload(e);
    },
    doupload: function(e) {
        var t, i, n, o, d, s, r, l = this, u = parseInt(e.currentTarget.dataset.id);
        switch (u) {
          case 1:
            if (0 == l.data.true1) return;
            break;

          case 2:
            if (0 == l.data.true2) return;
            break;

          case 3:
            if (0 == l.data.true3) return;
            break;

          case 4:
            if (0 == l.data.true4) return;
            break;

          case 5:
            if (0 == l.data.true5) return;
            break;

          case 6:
            if (0 == l.data.true6) return;
            break;

          case 7:
            if (0 == l.data.true7) return;
        }
        wx.chooseImage({
            count: 1,
            sizeType: [ "compressed" ],
            sourceType: [ "album", "camera" ],
            success: function(e) {
                var a = e.tempFilePaths;
                switch (u) {
                  case 1:
                    if (t = a, console.log(l.data.true1), 0 == l.data.true1) return;
                    l.data.true1 = !1;
                    break;

                  case 2:
                    i = a, l.data.true2 = !1;
                    break;

                  case 3:
                    n = a, l.data.true3 = !1;
                    break;

                  case 4:
                    o = a, l.data.true4 = !1;
                    break;

                  case 5:
                    d = a, l.data.true5 = !1;
                    break;

                  case 6:
                    s = a, l.data.true6 = !1;
                    break;

                  case 7:
                    r = a, l.data.true7 = !1;
                }
                l.setData({
                    imgurl1: t,
                    imgurl2: i,
                    imgurl3: n,
                    imgurl4: o,
                    imgurl5: d,
                    imgurl6: s,
                    imgurl7: r,
                    true1: l.data.true1,
                    true2: l.data.true2,
                    true3: l.data.true3,
                    true4: l.data.true4,
                    true5: l.data.true5,
                    true6: l.data.true6,
                    true7: l.data.true7
                }), l.data.imagelist.push(a), l.uploadimg(a, u);
            }
        });
    },
    delupload: function(e) {
        var a = this, t = parseInt(e.currentTarget.dataset.id), i = t - 2;
        switch (t) {
          case 1:
            a.setData({
                imgurl1: "",
                true1: !0
            });
            break;

          case 2:
            a.setData({
                imgurl2: "",
                true2: !0
            });
            break;

          case 3:
            a.setData({
                imgurl3: "",
                true3: !0
            });
            break;

          case 4:
            a.setData({
                imgurl4: "",
                true4: !0
            });
            break;

          case 5:
            a.setData({
                imgurl5: "",
                true5: !0
            });
            break;

          case 6:
            a.setData({
                imgurl6: "",
                true6: !0
            });
        }
        for (var n = 0; n < this.data.uploadimagelist.length; n++) n == i && (this.data.uploadimagelist[n] = "");
        console.log(this.data.uploadimagelist);
    }
}, "checkboxChange", function(e) {
    var a = e.detail.value;
    this.data.special = a.join(",");
}), _defineProperty(_Page, "checkuser", function(a) {
    var t = this, e = (a = a, wx.getStorageSync("userInfo"));
    return console.log(e), e ? e.memberInfo.uid ? void app.util.request({
        url: "entry/wxapp/checkuserinfo",
        data: {
            sessionid: e.sessionid,
            uid: e.memberInfo.uid
        },
        success: function(e) {
            console.log("payyyy"), 0 == e.data.data.error ? a.doServices() : 2 == e.data.data.error && a.doElseServices();
        }
    }) : (app.util.getUserInfo(), !1) : (app.util.getUserInfo(function(e) {
        t.oldhouseinit();
    }), !1);
}), _Page));