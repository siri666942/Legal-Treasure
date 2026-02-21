// 律师端案件列表页
const app = getApp();
const request = require('../../../common/utils/request.js');

const STATUS_ZH = { pending: '待处理', processing: '处理中', completed: '已结案' };
function mapCaseItem(item) {
  return Object.assign({}, item, { status: STATUS_ZH[item.statusType] || item.statusType });
}

Page({
  data: {
    caseList: [],
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
  
  initData() {
    const showHistory = this.data.showHistory;
    const params = showHistory ? '?history=true' : '';
    return request.get('/cases' + params, true).then(({ data }) => {
      const list = Array.isArray(data) ? data.map(mapCaseItem) : [];
      this.setData({ caseList: list });
      this.filterCases();
    }).catch((err) => {
      if (err.statusCode === 401) {
        wx.redirectTo({ url: '/pages/login/login' });
        return;
      }
      wx.showToast({ title: err.message || '加载失败', icon: 'none' });
      this.setData({ caseList: [], filteredCaseList: [] });
    });
  },

  filterCases() {
    const keyword = this.data.searchKeyword.trim();
    const showHistory = this.data.showHistory;
    let filtered = this.data.caseList;
    if (showHistory) {
      filtered = filtered.filter(caseItem => caseItem.statusType === 'completed');
    } else {
      filtered = filtered.filter(caseItem => caseItem.statusType !== 'completed');
    }
    if (keyword) {
      filtered = filtered.filter(caseItem => {
        const client = (caseItem.client || '') + '';
        return (caseItem.caseNo || '').includes(keyword) ||
               (caseItem.title || '').includes(keyword) ||
               client.includes(keyword);
      });
    }
    this.setData({ filteredCaseList: filtered });
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
  
  loadMore() {
    if (this.data.showHistory) {
      wx.showToast({ title: '过往案件不支持加载更多', icon: 'none' });
      return;
    }
    wx.showToast({ title: '已全部加载', icon: 'none' });
  },
  
  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    this.initData().then(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
      wx.showToast({ title: '刷新成功', icon: 'success' });
    }).catch(() => {
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    });
  }
});