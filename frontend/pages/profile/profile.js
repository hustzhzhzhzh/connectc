Page({
  data: {
    // 用户数据（示例）
    userInfo: {
      avatar: '../../static/14.png',
      name: '张三',
      phone: '135​**​​**​3738'
    }
  },

  // 退出登录确认
  showLogoutConfirm() {
    wx.showModal({
      title: '确认退出',
      content: '确定要退出当前账号吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除登录状态
          wx.removeStorageSync('token')
          // 跳转到登录页
          wx.reLaunch({
            url: '/pages/auth/auth'
          })
        }
      }
    })
  }
})