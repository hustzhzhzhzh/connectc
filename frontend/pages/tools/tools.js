const RATE_TABLE = {
  '美元': { rate: 6.8, symbol: '$' },
  '人民币': { rate: 1, symbol: '￥' },
  '英镑': { rate: 8.8, symbol: '£' },
  '欧元': { rate: 7.5, symbol: '€' },
  '日元': { rate: 0.06, symbol: '¥' }
}

Page({
  data: {
    // 导航状态
    tabs: ['留学计算器','语言学习','日历提醒','健康与安全','更多'],
    activeTab: 0,

    // 选择器数据
    currencies: ['美元', '人民币', '英镑', '欧元', '日元'],
    years: ['1年', '2年', '3年', '4年'],
    currencyIndex: 0,
    yearIndex: 0,

    // 输入配置（新增fixedCurrency字段）
    inputs: [
      { 
        key: 'tuition', 
        label: '学费/年', 
        placeholder: '60000',
        unit: '美元',
        value: '60000',
        fixedCurrency: false
      },
      { 
        key: 'accommodation', 
        label: '住宿费/月', 
        placeholder: '1500',
        unit: '美元',
        value: '1500',
        fixedCurrency: false
      },
      { 
        key: 'living', 
        label: '生活费/月', 
        placeholder: '1200',
        unit: '美元',
        value: '1200',
        fixedCurrency: false
      },
      { 
        key: 'insurance', 
        label: '保险费（一次性）', 
        placeholder: '4000',
        unit: '美元',
        value: '4000',
        fixedCurrency: false
      },
      { 
        key: 'ticket', 
        label: '往返机票费（一次性）', 
        placeholder: '12000',
        unit: '人民币',
        value: '12000',
        fixedCurrency: true  // 固定为人民币
      },
      { 
        key: 'visa', 
        label: '签证费（一次性）', 
        placeholder: '510',
        unit: '美元',
        value: '510',
        fixedCurrency: false
      }
    ],

    // 计算结果
    showResult: false,
    annualTotal: 0,
    oneTimeCost: 0,
    totalCost: 0,
    cnyTotal: 0
  },

  // 导航切换
  switchTab(e) {
    this.setData({ activeTab: e.currentTarget.dataset.index })
  },

  // 货币选择（新增单位更新逻辑）
  changeCurrency(e) {
    const newIndex = e.detail.value
    const selectedCurrency = this.data.currencies[newIndex]
    
    // 更新所有非固定单位的输入项
    const updatedInputs = this.data.inputs.map(item => {
      if (!item.fixedCurrency) {
        return {
          ...item,
          unit: selectedCurrency
        }
      }
      return item
    })

    this.setData({ 
      currencyIndex: newIndex,
      inputs: updatedInputs,
      showResult: false
    })
  },

  // 学年选择
  changeYear(e) {
    this.setData({ yearIndex: e.detail.value })
  },

  // 输入处理
  bindInput(e) {
    const key = e.currentTarget.dataset.key
    const inputs = this.data.inputs.map(item => 
      item.key === key ? {...item, value: e.detail.value} : item
    )
    this.setData({ inputs })
  },

  // 核心计算（优化转换逻辑）
  calculate() {
    const { inputs, currencyIndex, yearIndex } = this.data
    const selectedCurrency = this.data.currencies[currencyIndex]
    const studyYears = parseInt(this.data.years[yearIndex])
    
    // 转换为人民币基准
    const cnyValues = inputs.reduce((acc, item) => {
      const rawValue = parseFloat(item.value) || 0
      
      if (item.fixedCurrency) {
        // 固定人民币项直接取值
        acc[item.key] = rawValue
      } else {
        // 其他项按原货币转人民币
        const originRate = RATE_TABLE[item.unit].rate
        acc[item.key] = rawValue * originRate
      }
      return acc
    }, {})

    // 计算年度费用（人民币）
    const annualBaseCNY = cnyValues.tuition + 
      cnyValues.accommodation * 12 + 
      cnyValues.living * 12

    // 计算一次性费用（人民币）
    const oneTimeCNY = cnyValues.insurance + 
      cnyValues.ticket + 
      cnyValues.visa

    // 转换为目标货币
    const targetRate = RATE_TABLE[selectedCurrency].rate
    this.setData({
      annualTotal: (annualBaseCNY / targetRate).toFixed(2),
      oneTimeCost: (oneTimeCNY / targetRate).toFixed(2),
      totalCost: ((annualBaseCNY * studyYears + oneTimeCNY) / targetRate).toFixed(2),
      cnyTotal: (annualBaseCNY * studyYears + oneTimeCNY).toFixed(2),
      showResult: true
    })
  },

  // 跳转记账
  navToRecord() {
    wx.navigateTo({
      url: `/pages/tools/tools2`
    })
  }
})