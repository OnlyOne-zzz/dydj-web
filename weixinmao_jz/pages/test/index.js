var app = getApp();

Page({
    data: {},
    onLoad: function(t) {
        console.log(t.title), this.setData({
            msgList: [ {
                url: "url",
                title: "公告：多地首套房贷利率上浮 热点城市渐迎零折扣时代"
            }, {
                url: "url",
                title: "公告：悦如公寓三周年生日趴邀你免费吃喝欢唱"
            }, {
                url: "url",
                title: "公告：你想和一群有志青年一起过生日嘛？"
            } ]
        });
    }
});