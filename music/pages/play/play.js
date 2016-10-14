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
    endTime:""
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that=this;
    if(options){
      var music=song.getById(options.id);
    
      this.data.name=music.name;
      this.data.src=music.src;
      this.data.author=music.author;
      this.data.poster=music.poster;
    }else{
      wx.navigateBack();
    }
   

    

    that.play();
   
   
    
    wx.getBackgroundAudioPlayerState({
            success: function(res) {
                var status = res.status;
                var duration=res.duration;
                var currentPosition = res.currentPosition;
                that.setData({
                  playTime:currentPosition,
                  startTime:util.formatTime(currentPosition),
                  endTime: util.formatTime(duration),
                  playstate:"pause"
                });
            }
    })
  },
  onReady:function(){
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
  play:function(){
    var that=this;
    wx.playBackgroundAudio({
                dataUrl: this.data.src,
                title: this.data.name,
                complete:function(){
                    that.setData({
                    playstate:"pause"
                  });
                }
    });
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