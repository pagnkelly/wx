var song=require("../../libraries/song.js");

Page({
  data: {
    songList:[],//歌曲列表
    flag:false,//用于歌曲列表单的打开闭合
    curId:'',//最近播放id
    actionSheetHidden: true,
    listNum:0,//列表数量
    curName:''//重命名名字
  },
  onLoad: function () {
      var value = wx.getStorageSync('songList');
      var recentPlay=wx.getStorageSync('recentPlay');
      if(value){
        var count=0;
        for(var p in value){
              count++;
          }
      }
      this.setData({
           recentPlay: recentPlay.length,
           listNum:count
      });
  },
  onShow:function(){
      this.spread();
  },
  //最近播放列表
  recent:function(){

    wx.navigateTo({
      url: '../recentPlay/recentPlay'
    })

  },
  //歌单单击事件
  iNew:function(){
    this.setData({
      flag:!this.data.flag
    })
    if(this.data.flag){
      this.spread();
    }else{
      this.close();
    }
          
  },
  //歌单展开
  spread:function(){
     var value = wx.getStorageSync('songList');
    
     if(value){
        var list=[];
           for(var p in value){
             var arr={};
            arr.name=p;
            arr.len=value[p].length;
            arr.poster=song.music[parseInt(value[p][0])].poster;
            list.push(arr);
          }
        this.setData({
              songList:list
        })
     }
        
        
  },
  //歌单闭合
  close:function(){
       this.setData({
              songList:[]
        })
  },
  //选择歌单的tap事件
  openList:function(e){
    var name=e.currentTarget.dataset.name;
    wx.navigateTo({
      url:"../listInfo/listInfo?name="+name
    });
  },
  handleMore:function(e){
    var curId=e.currentTarget.dataset.id;
    
    this.setData({
        curId:curId,
        actionSheetHidden: !this.data.actionSheetHidden
    })
    
  },
  actionSheetChange: function(e) {
    this.setData({
       actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  //删除歌单
  delTap:function(e){
      var list=this.data.songList;
      var id=parseInt(this.data.curId);
      this.data.curName=list[id].name;
      if(id==list.length-1){
            list.pop();
      }else{
        for(var i=id;i<list.length-1;i++){
        
          list[i]=list[i+1];
        }
        list.length=list.length-1;
        
      }


      this.setData({
        songList:list,
        actionSheetHidden: !this.data.actionSheetHidden
      });
      var name=this.data.curName;
      var value=wx.getStorageSync('songList');
     
     delete value[name];
    
      wx.setStorage({
        key:"songList",
        data: value
      })
  },
  //重命名
  renameTap:function(e){
      var list=this.data.songList;
      var id=parseInt(this.data.curId);
      this.data.curName=list[id].name;
      var that=this;
      wx.navigateTo({
          url:'../newList/newList?name='+this.data.curName
        
      })
      this.setData({
        actionSheetHidden: !this.data.actionSheetHidden
      })
  }
})