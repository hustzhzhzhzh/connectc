// pages/index/index.js
Page({
  data: {
    startDate: '2025-03-01',  // 初始开始时间（必须早于结束时间）
    endDate: '2025-06-01',    // 初始结束时间
    currentDate: '2026-09-01',          // 动态当前时间（由微信获取）
    remainingDays: 0,         // 计算结果
    progress: 0  ,             // 进度百分比
    result: '',
    selectedAddress: null,
    // 地址选择数据
    locations: ['美国-纽约', '英国-伦敦', '韩国-首尔', '日本-东京'],
    selectedIndex: 0,
    
    // 表格数据示例
    allData: {
      '美国-纽约': [
        { id:1, title:'中国外交部全球应急热线', phone:'+86-10-12308   +86-10-65612308' },
        { id:2, title:'驻纽约总领馆', phone:'+1-212-6953125' },
        { id:3, title:'当地报警电话', phone:'911' },
        { id:4, title:'急救电话', phone:'911' },
        { id:5, title:'火警电话', phone:'911' },],
        '英国-伦敦': [{ id:1, title:'中国外交部全球应急热线', phone:'+86-10-12308  +86-10-65612308' },
        { id:2, title:'驻英大使馆', phone:'+44-2075804474' },
        { id:3, title:' 紧急（报警急救火警)', phone:'999' },
        { id:4, title:'非紧急报警', phone:'101' },
        { id:5, title:'24小时免费医疗服务', phone:'111' },
        { id:6, title:'英国消费者协会', phone:'0345-404-0506' },
        { id:7, title:'英国旅游局投诉', phone:'+44-20-7578-1000' },

        ],
        // 更多数据...
      },
        // 分页控制
    currentPage: 2,
    totalPages: 5,
    pageSize: 4,
    currentData: []
  },
  handleInput1(e) {
    this.setData({
      startDate: e.detail.value
    });
  },
  handleInput2(e) {
    this.setData({
      endDate: e.detail.value
    });
  },
  doCalculation() {
    // 获取输入的开始日期和结束日期
    const startDate = this.data.startDate;
    const endDate = this.data.endDate;

    // 检查开始日期是否晚于结束日期
    const start = this.convertToUTC(startDate);
    const end = this.convertToUTC(endDate);
    if (start > end) {
      wx.showToast({
        title: '开始日期不能晚于结束日期',
        icon: 'none'
      });
      return;
    }

    // 调用核心计算方法
    this.calculateTimeProgress();
  },
  onLoad() {
    // 初始化时间计算
    this.calculateTimeProgress();
    // 设置每日自动更新
    this.setDailyUpdate();
  },

  // 核心计算方法
  calculateTimeProgress() {
    // 时间转换（确保UTC格式）
    const start = this.convertToUTC(this.data.startDate);
    const end = this.convertToUTC(this.data.endDate);
    const now = this.getCurrentUTCDate();

    // 计算关键数值（严格遵循图片公式）
    const totalDays = this.calcDaysBetween(start, end);  // 总天数
    const remainingDays = this.calcDaysBetween(now, end); // 剩余天数
    
    // 边界处理（防止负数）
    const validRemaining = Math.max(0, Math.min(remainingDays, totalDays));
    const progress = totalDays > 0 
      ? ((validRemaining / totalDays) * 100).toFixed(2) 
      : 100;

    // 更新数据（匹配图片显示）
    this.setData({
      currentDate: this.formatDate(now),
      remainingDays: validRemaining,
      progress: progress
    });
  },

  // 精准UTC时间转换（消除时区误差）
  convertToUTC(dateStr) {
    const [y, m, d] = dateStr.split('-');
    return Date.UTC(y, m-1, d); // 注意：月份要-1
  },

  // 获取当前UTC时间（午夜基准）
  getCurrentUTCDate() {
    const now = new Date();
    return Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate()
    );
  },

  // 天数差计算（严格按图片公式）
  calcDaysBetween(startUTC, endUTC) {
    return Math.floor((endUTC - startUTC) / (1000 * 60 * 60 * 24));
  },

  // 日期格式化（保持图片中的YYYY-MM-DD格式）
  formatDate(utcTimestamp) {
    const date = new Date(utcTimestamp);
    return `${date.getUTCFullYear()}-${(date.getUTCMonth()+1).toString().padStart(2,'0')}-${date.getUTCDate().toString().padStart(2,'0')}`;
  },

  // 每日自动更新（保持进度实时性）
  setDailyUpdate() {
    const nextUpdate = new Date();
    nextUpdate.setUTCHours(24, 0, 0, 0); // 下个UTC午夜触发
    
    this.updateTimer = setTimeout(() => {
      this.calculateTimeProgress();
      this.setDailyUpdate();
    }, nextUpdate - Date.now());
  },

  onUnload() {
    clearTimeout(this.updateTimer);
  },

  // 导航功能
 navToEmbassyHot() {
    wx.switchTab({ url: '/pages/embassy/embassy' })
  },
  navToCommunity() {
    wx.switchTab({ url: '/pages/community/community' })
  },
  navToCalculator() {
    wx.switchTab({ url: '/pages/tools/tools' })
  },

  onLoad() {
    this.loadCurrentData();
  },

  // 地址选择变化
  bindPickerChange(e) {
    this.setData({
      selectedIndex: e.detail.value,
      currentPage: 1
    }, this.loadCurrentData);
  },

  // 加载当前数据
  loadCurrentData() {
    const location = this.data.locations[this.data.selectedIndex];
    const start = (this.data.currentPage - 1) * this.data.pageSize;
    this.setData({
      currentData: this.data.allData[location].slice(start, start + this.data.pageSize)
    });
  },

  // 获取微信定位
  getWechatLocation() {
    wx.showLoading({ title: '定位中...' })
    
    const handleComplete = () => {
      setTimeout(() => wx.hideLoading(), 100) // 确保隐藏加载提示
    }

    wx.getSetting({
      success: (authRes) => {
        if (!authRes.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success: () => {
              this._getActualLocation(handleComplete)
            },
            fail: () => {
              this._showErrorToast('需要位置权限')
              handleComplete()
            }
          })
        } else {
          this._getActualLocation(handleComplete)
        }
      },
      fail: () => {
        this._showErrorToast('权限检查失败')
        handleComplete()
      }
    })
  },

  // 实际定位操作
  _getActualLocation(completeCallback) {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        wx.chooseLocation({
          latitude: res.latitude,
          longitude: res.longitude,
          success: (locRes) => {
            this.setData({
              selectedAddress: {
                name: locRes.name || '未知地点',
                address: locRes.address,
                latitude: locRes.latitude,
                longitude: locRes.longitude
              }
            })
          },
          fail: () => this._showErrorToast('选择取消'),
          complete: completeCallback
        })
      },
      fail: () => {
        this._showErrorToast('定位失败')
        completeCallback()
      },
      complete: completeCallback
    })
  },

  // 统一错误处理
  _showErrorToast(msg) {
    wx.showToast({
      title: msg,
      icon: 'none',
      duration: 2000
    })
  },
  // 分页控制
  prevPage() {
    if (this.data.currentPage > 1) {
      this.setData({ currentPage: this.data.currentPage - 1 }, this.loadCurrentData);
    }
  },

  nextPage() {
    if (this.data.currentPage < this.data.totalPages) {
      this.setData({ currentPage: this.data.currentPage + 1 }, this.loadCurrentData);
    }
  },
// 搜索输入处理（可添加防抖）
onSearchInput(e) 
{
console.log('搜索关键词:', e.detail.value)
},

  // 紧急联系弹窗
  showEmergencyCall() {
    wx.showModal({
      title: '紧急呼叫',
      content: '确定拨打大使馆紧急电话？\n(+86-10-12308)',
      confirmText: '立即拨打',
      success: res => {
        if (res.confirm) {
          wx.makePhoneCall({ phoneNumber: '+86-10-12308' })
        }
       }
      })
    }
});