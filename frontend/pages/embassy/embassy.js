Page({
  data: {
    activeTab: 0, // 当前选中标签
    messageList: [
      { id: 1, content: '驻纽约总领事馆——提醒在美中国留学人员加强安全防范', url: 'http://newyork.china-consulate.gov.cn/chn/tzgg/t1799819.htm' },
      { id: 2, content: '驻英国大使馆——王起临时代办等参加2025年伦敦书展相关活动', url: 'http://gb.china-embassy.gov.cn/sgxw/202503/t20250320_11578879.htm' },
      { id: 3, content: '驻泰国使馆——中铁十局（泰）参与承建建筑在地震中坍塌一事', url: 'http://th.china-embassy.gov.cn/sgxw/202504/t20250404_11588383.html' },
      { id: 4, content: '驻美大使馆——中国政府关于反对美国滥施关税的立场', url: 'http://us.china-embassy.gov.cn/zgyw/202504/t20250405_11588935.htm' },
      { id: 5, content: '国内招聘消息国内招聘消息国内招聘消息国内招聘消息消息消息消息消息', url: 'https://example.com/policy' },
      { id: 6, content: '政策更新2', url: 'https://example.com/policy' },
    ],
  },
  switchTab(e) {
    const index = e.currentTarget.dataset.index
    this.setData({ activeTab: index })
    const tabData = {
      0: this.loadHotData,
      1: this.loadNewData,
      2: this.loadPolicyData,
      3: this.loadConsultData
    }
    tabData[index]?.call(this)

    const pageMap = {
      0: '/pages/embassy/embassy',    // 热门页面
      1: '/pages/embassy/embassy2',    // 最新页面
      2: '/pages/embassy/policy', // 政策页面
      3: '/pages/embassy/consult' // 在线咨询
    }

    // 执行页面跳转
    if (pageMap[index]) {
      wx.navigateTo({
        url: pageMap[index],
        success: () => {
          this.setData({ activeTab: index })
        },
        fail: (err) => {
          console.error('跳转失败:', err)
          wx.showToast({
            title: '功能开发中',
            icon: 'none'
          })
        }
      })
    }
  },
  

  navigateToNews(e) {
    const newsUrl = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: `/pages/news/detail?url=${encodeURIComponent(newsUrl)}`
    });
  },

  onLoad() {
    // 可在此处添加从后端获取数据的逻辑
  },
});