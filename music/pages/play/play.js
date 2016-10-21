var util=require("../../utils/util.js");
var song=require("../../libraries/song.js");
Page({
  data:{
    // text:"这是一个页面"
    lyrics:"sasadsadasdsasdasdsadsadsa",
    name:"",
    src:"",
    author:"",
    poster:"",
    mode:"all",
    playstate:"play",
    timer:"",
    playTime:"",
    startTime:"",
    endTime:"",
    max:100,
    recentPlay:[],
    curid:99999
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that=this;
    if(options){
      var music=song.getById(options.id);
      var recentPlay=wx.getStorageSync('recentPlay');
      var arr=[];
      
      if(!recentPlay){
       
        arr.push(options.id)
      }else{
        arr=recentPlay;
        for(var i=0;i<arr.length;i++){
            if(arr[i]==options.id){
              for(var j=i;j<arr.length-1;j++){
                  arr[j]=arr[j+1];
              }
              arr.length=arr.length-1;
              break;
            }
        }
        
        arr.push(options.id);
      }
      // recentPlay.push(options.id);
      
      wx.setStorage({
        key:"recentPlay",
        data:arr
      })
      this.data.curid=arr.length-1;
      this.data.recentPlay=arr;
      this.data.name=music.name;
      this.data.src=music.src;
      this.data.author=music.author;
      this.data.poster=music.poster;
    }else{
      wx.navigateBack();
    }
   

    

    that.play(options.id);
   
   
    


  },
  onReady:function(){
    var that=this;
        wx.getBackgroundAudioPlayerState({
            success: function(res) {
                var status = res.status;
                var duration=res.duration;
                var currentPosition = res.currentPosition;
                
                that.setData({
                  max:parseInt(duration),
                  playTime:currentPosition,
                  startTime:util.formatTime(currentPosition),
                  endTime: util.formatTime(duration),
                  playstate:"pause"
                });
                console.log(111111)
            }
    })
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    clearInterval(this.data.timer);
   
    // 页面关闭
  },
  playmode:function(){
    if(this.data.mode=="all"){
        this.setData({
          mode:"random"
        });
    }
    else if(this.data.mode=="random"){
        this.setData({
          mode:"single"
        });
    }
    else if(this.data.mode=="single"){
        this.setData({
          mode:"all"
        });
    }
  },
  play:function(id){
    var that=this;
    var value = wx.getStorageSync('id')
    if (value!=id) {
        
        wx.playBackgroundAudio({
                dataUrl: this.data.src,
                title: this.data.name,
                complete:function(){
                    that.setData({
                    playstate:"pause"
                  });
                }
        });
    }else{
      that.setData({
          playstate:"pause"
      })
    }
    wx.setStorageSync("id",id);
    if(this.data.playTime){
         wx.seekBackgroundAudio({
          position: this.data.playTime,
          complete: function () {
              }
          })
    }
    this._progressTimer();
  }, 
  seek: function (e) {
      var that = this;
      
      wx.seekBackgroundAudio({
          position: e.detail.value,
          complete: function () {
        
        }
     })
   
  },
  pause:function(){
    clearInterval(this.data.timer);
    var that=this;
    this.setData({
          playstate:"play"
        });
    
     wx.pauseBackgroundAudio();
    console.log(this.data.max);
  },
  prev:function(){
    var that=this;
    var arr=this.data.recentPlay;
    this.data.curid=this.data.curid-1;
    console.log(arr[this.data.curid]);
    clearInterval(this.data.timer);
   
    var music=song.getById(arr[this.data.curid]);
    this.setData({
      name:music.name,
      src:music.src,
      author:music.author,
      poster:music.poster
    });
 

    this.play(arr[this.data.curid]);
     wx.getBackgroundAudioPlayerState({
            success: function(res) {
                var status = res.status;
                var duration=res.duration;
                var currentPosition = res.currentPosition;
                that.setData({
                  max:parseInt(duration),
                  playTime:currentPosition,
                  startTime:util.formatTime(currentPosition),
                  endTime: util.formatTime(duration),
                  playstate:"pause"
                });
            }
    })  
  },
  _progressTimer:function(){
    var that=this;
    var timer=setInterval(update,1000);
    this.setData({
      timer:timer
    });
    update();
    function update(){
      
          wx.getBackgroundAudioPlayerState({
            success: function(res) {
                var duration=res.duration;
                var currentPosition = res.currentPosition;
                that.setData({
                  playTime:currentPosition,
                  startTime:util.formatTime(currentPosition),
                  endTime: util.formatTime(duration),
                });
            }
        })
    }
  }  


})