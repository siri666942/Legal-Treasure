// 律师端案件列表页
const app = getApp();

Page({
  data: {
    // 案件列表数据（包含所有状态）
    caseList: [
      {
        id: 1,
        caseNo: '2024-民-001',
        title: '张三诉李四合同纠纷案',
        status: '处理中',
        statusType: 'processing',
        client: '张三',
        date: '2024-01-15',
        progress: 60,
        type: '合同纠纷'
      },
      {
        id: 2,
        caseNo: '2024-民-002',
        title: '王五离婚诉讼案',
        status: '已结案',
        statusType: 'completed',
        client: '王五',
        date: '2024-01-10',
        progress: 100,
        type: '婚姻家庭'
      },
      {
        id: 3,
        caseNo: '2024-刑-001',
        title: '赵六故意伤害案',
        status: '待处理',
        statusType: 'pending',
        client: '赵六',
        date: '2024-01-20',
        progress: 30,
        type: '刑事'
      },
      {
        id: 4,
        caseNo: '2024-民-003',
        title: '钱七劳动争议案',
        status: '处理中',
        statusType: 'processing',
        client: '钱七',
        date: '2024-01-25',
        progress: 40,
        type: '劳动争议'
      },
      {
        id: 5,
        caseNo: '2024-民-004',
        title: '孙八借贷纠纷案',
        status: '处理中',
        statusType: 'processing',
        client: '孙八',
        date: '2024-01-28',
        progress: 80,
        type: '债权债务'
      },
      {
        id: 6,
        caseNo: '2023-民-100',
        title: '周九遗产继承纠纷案',
        status: '已结案',
        statusType: 'completed',
        client: '周九',
        date: '2023-12-15',
        progress: 100,
        type: '婚姻家庭'
      },
      {
        id: 7,
        caseNo: '2023-刑-050',
        title: '吴十盗窃案',
        status: '已结案',
        statusType: 'completed',
        client: '吴十',
        date: '2023-11-30',
        progress: 100,
        type: '刑事'
      }
    ],
    
    // 筛选后的案件列表
    filteredCaseList: [],
    
    // 搜索关键词
    searchKeyword: '',
    
    // 是否显示过往案件
    showHistory: false,
    
    // 是否还有更多数据
    hasMore: true,
    
    // 底部导航
    tabList: [
      { id: 1, name: '首页', icon: 'icon-home', active: false },
      { id: 2, name: '案件', icon: 'icon-case', active: true },
      { id: 3, name: '沟通', icon: 'icon-chat', active: false },
      { id: 4, name: '我的', icon: 'icon-mine', active: false }
    ]
  },
  
  onLoad() {
    // 检查登录和角色
    if (!app.globalData.isLogin) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }
    
    // 初始化数据，显示进行中的案件
    this.initData();
  },
  
  onShow() {
    // 页面显示时更新导航状态
    this.updateTabBar();
  },
  
  // 初始化数据
  initData() {
    this.filterCases();
  },
  
  // 过滤案件
  filterCases() {
    const keyword = this.data.searchKeyword.trim();
    const showHistory = this.data.showHistory;
    
    let filtered = this.data.caseList;
    
    // 根据是否显示过往案件过滤
    if (showHistory) {
      // 显示已结案的案件
      filtered = filtered.filter(caseItem => 
        caseItem.statusType === 'completed'
      );
    } else {
      // 显示未结案的案件
      filtered = filtered.filter(caseItem => 
        caseItem.statusType !== 'completed'
      );
    }
    
    // 根据搜索关键词过滤
    if (keyword) {
      filtered = filtered.filter(caseItem => {
        return caseItem.caseNo.includes(keyword) || 
               caseItem.title.includes(keyword) || 
               caseItem.client.includes(keyword);
      });
    }
    
    this.setData({
      filteredCaseList: filtered
    });
  },
  
  // 更新底部导航状态
  updateTabBar: function() {
    const pages = getCurrentPages();
    const currentPage = pages[pages.length - 1];
    const route = currentPage.route;
    
    let activeTabId = 2; // 默认案件页选中
    
    const tabList = this.data.tabList.map(tab => ({
      ...tab,
      active: tab.id === activeTabId
    }));
    
    this.setData({ tabList });
  },
  
  // 切换底部导航
  switchTab: function(e) {
    const tabId = parseInt(e.currentTarget.dataset.id);
    
    // 如果点击的是当前已选中的tab，则不跳转
    const currentTab = this.data.tabList.find(tab => tab.active);
    if (currentTab && currentTab.id === tabId) {
      return;
    }
    
    // 更新tab选中状态
    const tabList = this.data.tabList.map(tab => ({
      ...tab,
      active: tab.id === tabId
    }));
    this.setData({ tabList });
    
    // 跳转到对应页面
    switch(tabId) {
      case 1: // 首页
        wx.redirectTo({
          url: '/subpackages/lawyer/pages/index/index'
        });
        break;
      case 2: // 案件（当前页）
        break;
      case 3: // 沟通
        wx.redirectTo({
          url: '/subpackages/lawyer/pages/chat/chat'
        });
        break;
      case 4: // 我的
        wx.redirectTo({
          url: '/subpackages/lawyer/pages/mine/mine'
        });
        break;
    }
  },
  
  // 输入框内容变化
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },
  
  // 搜索案件
  onSearch() {
    this.filterCases();
    
    if (this.data.searchKeyword.trim()) {
      wx.showToast({
        title: `找到${this.data.filteredCaseList.length}个案件`,
        icon: 'none'
      });
    }
  },
  
  // 查看案件详情
  viewCaseDetail(e) {
    const caseId = e.currentTarget.dataset.id;
    const caseItem = this.data.filteredCaseList.find(item => item.id == caseId);
    
    if (caseItem) {
      wx.navigateTo({
        url: `/subpackages/lawyer/pages/case-detail/case-detail?id=${caseId}&title=${encodeURIComponent(caseItem.title)}&history=true`
      });
    }
  },
  
  // 联系当事人
  contactClient(e) {
    const caseId = e.currentTarget.dataset.id;
    const caseItem = this.data.filteredCaseList.find(item => item.id == caseId);
    
    if (caseItem) {
      wx.navigateTo({
        url: `/subpackages/lawyer/pages/communication/communication?caseId=${caseId}&client=${caseItem.client}`
      });
    }
  },
  
  // 创建新案件
  createNewCase() {
    wx.navigateTo({
      url: '/subpackages/lawyer/pages/create-case/create-case'
    });
  },

  // 跳转到过往案件页面
  viewHistoryCases() {
    wx.navigateTo({
      url: '/subpackages/lawyer/pages/past-cases/past-cases'
    });
  },

  // 返回进行中案件
  backToActiveCases() {
    this.setData({
      showHistory: false,
      searchKeyword: '', // 清空搜索关键词
      hasMore: true // 重新启用加载更多
    }, () => {
      this.filterCases();
      
      wx.showToast({
        title: '已显示进行中案件',
        icon: 'success'
      });
    });
  },
  
  // 加载更多数据（只对进行中案件有效）
  loadMore() {
    if (this.data.showHistory) {
      wx.showToast({
        title: '过往案件不支持加载更多',
        icon: 'none'
      });
      return;
    }
    
    wx.showLoading({ title: '加载中...' });
    
    // 模拟加载更多数据
    setTimeout(() => {
      const newCases = [
        {
          id: 8,
          caseNo: '2024-民-006',
          title: '周九房屋买卖纠纷案',
          status: '处理中',
          statusType: 'processing',
          client: '周九',
          date: '2024-01-30',
          progress: 50,
          type: '房产纠纷'
        },
        {
          id: 9,
          caseNo: '2024-民-007',
          title: '吴十交通事故责任纠纷案',
          status: '待处理',
          statusType: 'pending',
          client: '吴十',
          date: '2024-02-01',
          progress: 10,
          type: '交通事故'
        }
      ];
      
      // 添加到总列表
      const updatedList = [...this.data.caseList, ...newCases];
      
      // 过滤掉已结案的，添加到显示列表
      const activeNewCases = newCases.filter(caseItem => 
        caseItem.statusType !== 'completed'
      );
      
      const updatedFiltered = [...this.data.filteredCaseList, ...activeNewCases];
      
      this.setData({
        caseList: updatedList,
        filteredCaseList: updatedFiltered,
        hasMore: false // 模拟没有更多数据
      });
      
      wx.hideLoading();
      wx.showToast({
        title: '已加载更多案件',
        icon: 'success'
      });
    }, 1500);
  },
  
  // 下拉刷新
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    
    // 模拟刷新数据
    setTimeout(() => {
      this.initData();
      
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      wx.showToast({
        title: '刷新成功',
        icon: 'success'
      });
    }, 1000);
  }
});