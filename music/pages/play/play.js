var util=require("../../utils/util.js");
var song=require("../../libraries/song.js");
//important  最难理解 最值得骄傲 最大的心血 不想加注释 但还是为了广大爱好者，开发者，初学者以他们的名义发布在各大论坛，每每想到这都心痛不已，然而这也是我最高兴的事情。
Page({
  data:{
    // text:"这是一个页面"
    lyrics:"sasadsadasdsasdasdsadsadsa",//没有实现歌词功能，加段字符串充数
    name:"",//歌曲名字
    src:"",//歌曲链接
    author:"",//作者
    poster:"",//歌曲主图
    mode:"all",//播放模式
    playstate:"play",//播放状态
    timer:"",//用于进度时间实时动态刷新的计时器
    playTime:"",//播放时间位置
    startTime:"",//起始时间
    endTime:"",//结束时间
    min:0,//最小值
    max:100,//最大值
    recentPlay:[],//最近播放歌曲名单id
    recentMusic:[],//最近播放歌曲详细信息
    curid:99999,//最近播放id
    actionSheetHidden:true,
    judgeNext:false//判断是tap的下一曲，还是播放完之后的下一曲，
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that=this;
    if(options.id){
      //更新歌曲信息
      var music=song.getById(options.id);
      this._updateStorage(options.id);
      this.data.name=music.name;
      this.data.src=music.src;
      this.data.author=music.author;
      this.data.poster=music.poster;
    }else{
      wx.navigateBack();
    }
    //播放
    that.play(options.id);
    //监听播放完成
    wx.onBackgroundAudioStop(function(){
          that.data.judgeNext=true;
          that.next();
    });
   //存歌曲信息
      var arr2=[];
      for(var i=this.data.recentPlay.length-1;i>=0;i--){
          arr2.push(song.music[this.data.recentPlay[i]])
      }
      this.setData({
          curid:0,
          recentMusic:arr2
      });
  },
  //更新最近播放表单
  _updateStorage:function(id){
    var recentPlay=wx.getStorageSync('recentPlay');
      var arr=[];
      if(!recentPlay){
        arr.push(id);
      }else{
        arr=recentPlay;
        for(var i=0;i<arr.length;i++){
            if(arr[i]==id&&i!=arr.length-1){
              for(var j=i;j<arr.length-1;j++){
                  arr[j]=arr[j+1];
              }
              arr.length=arr.length-1;
              break;
            }
        }
        if(arr[arr.length-1]!=id){
         arr.push(id);
        }
      }
      // recentPlay.push(id);
      wx.setStorage({
        key:"recentPlay",
        data:arr
      })
      this.data.recentPlay=arr;
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
  actionSheetChange: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  //播放模式改变
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
  //播放事件 
  play:function(id){
    var that=this;
    var value = wx.getStorageSync('id')//存当前播放id  退出后再进入可以根据判断是否为同一首歌进行续播
    if (value!=id) {
        wx.playBackgroundAudio({
                dataUrl: this.data.src,
                title: this.data.name,
                complete:function(){
                    that.setData({
                      playstate:"pause"
                  })
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
  //进度条调节歌曲进度事件
  seek: function (e) {
      var that = this;
      wx.seekBackgroundAudio({
          position: e.detail.value,
          complete: function () {
        
        }
     })
   
  },
  //暂停事件
  pause:function(){
    clearInterval(this.data.timer);
    var that=this;
    this.setData({
          playstate:"play"
        });
    
     wx.pauseBackgroundAudio();
    console.log(this.data.max);
  },
  //上一曲
  prev:function(){
    var that=this;
    var arr=this.data.recentMusic;
    this.data.curid=this.data.curid+1;
    if(this.data.curid==this.data.recentPlay.length){
      this.data.curid=0;
    }
    this._updateStorage(this.data.curid);
    clearInterval(this.data.timer);
  var music=arr[this.data.curid];
 
    this.setData({
      name:music.name,
      src:music.src,
      author:music.author,
      poster:music.poster,
      playTime:"",
      min:0,
      curid:this.data.curid
    });
    this.play(this.data.curid);
 
  },
  //下一曲
  next:function(){
    var that=this;
    var arr=this.data.recentMusic;
    if(this.data.mode=="random"){
      this.data.curid=Math.floor(arr.length*Math.random());
    }else if(this.data.judgeNext&&this.data.mode=="single"){
      this.data.curid=this.data.curid;
      this.data.judgeNext=false;
    }else{
      this.data.curid=this.data.curid-1;
    }
    if(this.data.curid==-1){
      this.data.curid=this.data.recentPlay.length-1;
    }
    this._updateStorage(this.data.curid);
    clearInterval(this.data.timer);
  var music=arr[this.data.curid];
 
    this.setData({
      name:music.name,
      src:music.src,
      author:music.author,
      poster:music.poster,
      playTime:"",
      min:0,
      curid:this.data.curid
    });
    this.play(this.data.curid);
 
  },
  //列表
  list:function(){
      this.actionSheetChange();
  },
  //点播事件
  bindItemTap:function(e){
      var curid=e.target.dataset.curid;
      this.setData({
          curid:curid
      });
    var arr=this.data.recentMusic;
    this._updateStorage(this.data.curid);
    clearInterval(this.data.timer);
  var music=arr[this.data.curid];
    this.setData({
      name:music.name,
      src:music.src,
      author:music.author,
      poster:music.poster,
      playTime:"",
      min:0,
      curid:this.data.curid
    });
    this.play(this.data.curid);
  },
  //时间动态刷新
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