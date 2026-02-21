// subpackages/client/pages/case/case.js
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
    
    // 底部导航
    currentTab: 1,
    tabList: [
      { id: 0, name: '主页', icon: 'icon-home', active: false },
      { id: 1, name: '案件', icon: 'icon-case', active: true },
      { id: 2, name: '沟通', icon: 'icon-chat', active: false },
      { id: 3, name: '我的', icon: 'icon-mine', active: false }
    ],

    // 自定义浮窗控制
    showBindModal: false,
    bindCodeInput: ''
  },

  onLoad(options) {
    // 检查登录状态
    if (!app.globalData.isLogin) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }
    
    // 初始化数据
    this.initData();
  },

  onShow() {
    // 更新导航状态
    this.updateTabBar();
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
  },

  initData() {
    return request.get('/cases', true).then(({ data }) => {
      const list = Array.isArray(data) ? data.map(mapCaseItem) : [];
      this.setData({ caseList: list, filteredCaseList: list });
    }).catch((err) => {
      if (err.statusCode === 401) {
        wx.redirectTo({ url: '/pages/login/login' });
        return;
      }
      wx.showToast({ title: err.message || '加载失败', icon: 'none' });
      this.setData({ caseList: [], filteredCaseList: [] });
    });
  },

  // 更新底部导航状态
  updateTabBar() {
    const tabList = this.data.tabList.map(tab => ({
      ...tab,
      active: tab.id === 1
    }));
    
    this.setData({ 
      tabList,
      currentTab: 1
    });
  },

  // 切换底部导航
  switchTab(e) {
    const tabId = parseInt(e.currentTarget.dataset.id);
    
    if (this.data.currentTab === tabId) {
      return;
    }
    
    const tabList = this.data.tabList.map(tab => ({
      ...tab,
      active: tab.id === tabId
    }));
    
    this.setData({ 
      tabList,
      currentTab: tabId
    });
    
    switch(tabId) {
      case 0:
        wx.redirectTo({ url: '/subpackages/client/pages/index/index' });
        break;
      case 1:
        break;
      case 2:
        wx.redirectTo({ url: '/subpackages/client/pages/chat/chat' });
        break;
      case 3:
        wx.redirectTo({ url: '/subpackages/client/pages/profile/profile' });
        break;
    }
  },

  // ============ 搜索功能 ============
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearch() {
    const keyword = this.data.searchKeyword.trim();
    if (!keyword) {
      this.setData({ filteredCaseList: this.data.caseList });
      return;
    }
    const filtered = this.data.caseList.filter(caseItem => {
      const lawyer = (caseItem.lawyer || '') + '';
      const type = (caseItem.type || '') + '';
      return (caseItem.caseNo || '').includes(keyword) ||
             (caseItem.title || '').includes(keyword) ||
             lawyer.includes(keyword) ||
             type.includes(keyword);
    });
    this.setData({ filteredCaseList: filtered });
    if (filtered.length === 0) {
      wx.showToast({ title: '未找到相关案件', icon: 'none' });
    }
  },

  // ============ 案件操作 ============
  viewCaseDetail(e) {
    const caseId = e.currentTarget.dataset.id;
    const caseItem = this.data.caseList.find(item => item.id === caseId);
    
    if (caseItem) {
      wx.navigateTo({
        url: `/subpackages/client/pages/case-detail/case-detail?id=${caseId}&name=${encodeURIComponent(caseItem.title)}`,
        fail: () => this.showUnderDevelopment('案件详情')
      });
    }
  },

  contactLawyer(e) {
    const caseId = e.currentTarget.dataset.id;
    const caseItem = this.data.caseList.find(item => item.id === caseId);
    
    if (caseItem) {
      wx.navigateTo({
        url: `/subpackages/client/pages/communication/communication?lawyer=${encodeURIComponent(caseItem.lawyer)}&caseId=${caseId}`,
        fail: () => this.showUnderDevelopment('联系律师')
      });
    }
  },

  // ============ 添加案件（自定义浮窗）============
  // 显示绑定码浮窗
  onAddCase() {
    this.setData({
      showBindModal: true,
      bindCodeInput: ''
    });
  },

  // 关闭浮窗
  closeBindModal() {
    this.setData({ showBindModal: false });
  },

  // 绑定码输入
  onBindCodeInput(e) {
    this.setData({ bindCodeInput: e.detail.value });
  },

  // 确认绑定
  confirmBind() {
    const bindCode = this.data.bindCodeInput.trim().toUpperCase();
    // 验证格式：8位大写字母+数字
    const codeReg = /^[A-Z0-9]{8}$/;
    if (!codeReg.test(bindCode)) {
      wx.showToast({
        title: '绑定码格式不正确',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({ title: '绑定中...', mask: true });

    // 模拟绑定请求
    setTimeout(() => {
      wx.hideLoading();

      // 模拟成功，添加一个新案件
      const newCase = {
        id: Date.now(),
        caseNo: '2024-民-' + String(this.data.caseList.length + 1).padStart(3, '0'),
        title: '新绑定案件',
        status: '处理中',
        statusType: 'processing',
        lawyer: '待分配',
        date: new Date().toISOString().slice(0, 10),
        progress: 0,
        type: '民事纠纷'
      };

      const updatedList = [...this.data.caseList, newCase];
      const updatedFiltered = [...this.data.filteredCaseList, newCase];

      this.setData({
        caseList: updatedList,
        filteredCaseList: updatedFiltered,
        showBindModal: false
      });

      wx.showToast({
        title: '绑定成功',
        icon: 'success'
      });
    }, 1500);
  },

  // ============ 提示工具 ============
  showUnderDevelopment(feature) {
    wx.showToast({
      title: `${feature}功能开发中`,
      icon: 'none',
      duration: 2000
    });
  }
});