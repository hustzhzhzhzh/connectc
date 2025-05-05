// pages/role/role.js
Page({
  navigateToAuth() {
    wx.redirectTo({
      url: '/pages/auth/auth'
    });
  },
  navigateToIndex() {
    wx.switchTab({
      url: '/pages/index/index'});
      wx.showToast({ 
        title: '游客登录', 
  });
}
});