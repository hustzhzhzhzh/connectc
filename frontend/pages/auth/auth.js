Page({
  data: {
    agreed: false
  },

  onLoad() {
    
  },


  getPhoneNumber(e) {
    if (!this.data.agreed) {
      wx.showToast({ title: '请先同意协议', icon: 'none' });
      return;
    }

     wx.login({
    success: async (res) => {
      try {
        wx.request({
          url: 'http://localhost:3000/api/wechat-login',
          method: 'POST',
          data: { code: res.code },
          header: { 'Content-Type': 'application/json' },
          success: (res) => {
            console.log( res.data.userId); 
            if (res.data.userId) {
              const userId = res.data.userId;
              const app = getApp();
              app.globalData.userInfo = { id: userId };
              console.log('全局存储的用户ID:', app.globalData.userInfo.id);
              console.log( userId); 
              
            
              wx.switchTab({ url: '/pages/index/index' });
          }
        }
          
        });

      } catch (err) {
        console.error('登录异常:', err);
      }
    }
  });
},


  guestLogin() {
    wx.switchTab({ url: '/pages/index/index' });
    wx.showToast({ 
      title: '游客登录', 
});
  },

  toggleAgreement() {
    this.setData({ agreed:!this.data.agreed });
  },

  goBack() {
    wx.navigateBack();
  }
});