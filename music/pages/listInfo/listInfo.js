var song=require("../../libraries/song.js");



Page({
  data: {
    actionSheetHidden: true,
    actionSheetHidden2:true,
    hidden:true,
    music:[],
    currentid:99999,
    songList:{},
    songListName:[],
    hid:true,
    hid2:true
  },
  //事件处理函数
  onLoad: function (options) {
      var name=options.name;
      var list=wx.getStorageSync('songList');
      var arr=[];
      for(var i=0;i<list[name].length;i++){
           arr.push(song.music[list[name][i]]);
      }
      this.setData({
          music:arr
      });
     
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
  handleMore:function(e){

     var value = wx.getStorageSync('songList')
     
      if (value) {
          // Do something with return value
          var arr=[];
           for(var p in value){
            arr.push(p);
          }
          this.setData({
            songList:value,
            songListName:arr
          })
      }
      this.setData({
        currentid:e.currentTarget.dataset.id,
        actionSheetHidden: !this.data.actionSheetHidden
      })
  },
  actionSheetChange: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
   actionSheetChange2: function(e) {
    this.setData({
      actionSheetHidden2: !this.data.actionSheetHidden2
    })
  },
  collectionTap:function(e){
       
      this.setData({
        actionSheetHidden: "false",
        actionSheetHidden2: !this.data.actionSheetHidden2
        
      })
  },
  newSongList:function(){
      this.setData({
        actionSheetHidden2: !this.data.actionSheetHidden2
      })
      wx.navigateTo({
          url:'../newList/newList?id='+this.data.currentid
      })
  },
  handleAdd:function(e){
    var name=e.target.dataset.name;
    var list=this.data.songList[name];
    var curId=this.data.currentid;
    var that=this;
    
    for(var i=0;i<list.length;i++){
      if(list[i]==curId){
          this.setData({
            actionSheetHidden2: !this.data.actionSheetHidden2,
            hid:false
          })
          setTimeout(function(){
            that.setData({
              hid:true
            });
          },1000)
          return ;
      }
    }
    
     list.push(curId);
     wx.setStorage({
        key:"songList",
        data:this.data.songList
      })
     console.log(this.data.songList);
     this.setData({
            actionSheetHidden2: !this.data.actionSheetHidden2,
            hid2:false
          })
          setTimeout(function(){
            that.setData({
              hid2:true
            });
     },1000)
  }

})