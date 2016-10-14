//index.js
//获取应用实例
var song=require("../../libraries/song.js");

Page({
  data: {
    actionSheetHidden: true,
    hidden:true,
    music:song.music
  },
  //事件处理函数


  onLoad: function () {

    var that = this
    //调用应用实例的方法获取全局数据
   

  },
  onPullDownRefresh:function(){
    var self=this;
    self.setData({
      hidden:false
    });
    setTimeout(function(){
      self.setData({
        hidden:true
      });
    },1000);
  },
  handleCell:function(e){
    var id=e.target.dataset.id;
     
   wx.navigateTo({
     url:'../play/play?id='+id
   });
    
  },
  handleMore:function(){
      this.setData({
        actionSheetHidden: !this.data.actionSheetHidden
      })
  },
  actionSheetChange: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindItemTap:function(e){
    console.log('tap ' + e.currentTarget.dataset.name)
  }

})
