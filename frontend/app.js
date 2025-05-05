App({
  globalData: {
    userRole: null,
    token: null,
    userInfo: null
  },
  onLaunch: function () {
    // 小程序启动时的逻辑
    // 例如：尝试从本地缓存中获取用户角色和token等信息
    const userRole = wx.getStorageSync('userRole');
    const token = wx.getStorageSync('token');
    if (userRole) {
      this.globalData.userRole = userRole;
    }
    if (token) {
      this.globalData.token = token;
    }
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb === "function" && cb(this.globalData.userInfo);
    } else {
      // 可以在这里添加调用微信获取用户信息的逻辑
      // 例如：wx.getUserInfo({...})
      // 由于这里只是示例，暂时不做实际调用
      this.globalData.userInfo = {
        nickname: '默认昵称',
        avatarUrl: '默认头像地址'
      };
      typeof cb === "function" && cb(this.globalData.userInfo);
    }
  }
});