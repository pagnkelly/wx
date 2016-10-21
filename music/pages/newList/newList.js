

Page({
  data: {
    id: '',
    hid:true,
    hid2:true,
    hid3:true,
    songList:{},
    inputValue:''
  },
  onLoad: function (options) {
      this.setData({
          id:options.id
      });
      var that=this;
      wx.getStorage({
        key: 'songList',
        success: function(res) {
          
          that.setData({
            songList:res.data
          })

        } 
      })

  },
  handleSub:function(){
    var obj=this.data.songList;
    var inputValue=this.data.inputValue;
    var flag=false;
    if(inputValue){
      for(var p in obj){
         
          if(p==inputValue){
               this.setData({
                  hid2:false
                });
                setTimeout(function(){
                  this.setData({
                    hid2:true
                  });
                }.bind(this),1000);
                flag=false;
                break;
                
          }
          flag=true; 
          
      }
         
    }else{
      this.setData({
        hid3:false
      });
      setTimeout(function(){
         this.setData({
          hid3:true
        });
      }.bind(this),1000);
    }
    
    function isEmptyObject(e) {  
        var t;  
        for (t in e)  
            return !1;  
        return !0  
    } 
    console.log(flag);
    if(isEmptyObject(obj)||flag){
      obj[inputValue]=[];
       obj[inputValue].push(this.data.id);
      
      wx.setStorage({
        key:"songList",
        data:obj
      })

      this.setData({
        hid:false
      });
      setTimeout(function(){
          wx.navigateBack();
      },1000); 
    }
       
  },
  handleBlur:function(e){
      this.setData({
        inputValue: e.detail.value
      })
  }
})