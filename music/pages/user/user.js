Page({
  data: {
    animationData: {},
    animation:'',
    songList:[],
    flag:false,
    listNum:0
  },
  onLoad: function () {
      var value = wx.getStorageSync('songList');
   
      if(value){
        var count=0;
        for(var p in value){
              count++;
          }
      }
      this.setData({
           listNum:count
      });
     
  },
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
  spread:function(){
     var value = wx.getStorageSync('songList');
     var that=this;
     if(value){
        var list=[];
           for(var p in value){
             var arr={};
            arr.name=p;
            arr.len=value[p].length;
            list.push(arr);
          }
        this.setData({
              songList:list
        })
     }
        
        
  },
  close:function(){
       this.setData({
              songList:[]
        })
  },
  openList:function(e){
    var name=e.currentTarget.dataset.name;
    wx.navigateTo({
      url:"../listInfo/listInfo?name="+name
    });
  }
})