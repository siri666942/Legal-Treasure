// 过往案件查询页面
const app = getApp();
const request = require('../../../common/utils/request.js');
const STATUS_ZH = { pending: '待处理', processing: '处理中', completed: '已结案' };
function mapCaseItem(item) {
  const base = Object.assign({}, item, { status: STATUS_ZH[item.statusType] || item.statusType });
  if (!base.completeDate) base.completeDate = base.date || '';
  if (!base.completeType) base.completeType = '';
  if (!base.court) base.court = '';
  if (!base.result) base.result = '';
  return base;
}

Page({
  data: {
    caseList: [],
    
    // 筛选后的案件列表
    filteredCaseList: [],
    
    // 搜索关键词
    searchKeyword: '',
    
    // 案件类型筛选
    caseTypeIndex: -1,
    caseTypes: ['全部类型', '合同纠纷', '婚姻家庭', '刑事', '劳动争议', '债权债务', '房产纠纷', '交通事故', '知识产权', '其他'],
    
    // 年份筛选
    yearFilter: '',
    
    // 当前年份
    currentYear: new Date().getFullYear()
  },
  
  onLoad() {
    if (!app.globalData.isLogin) {
      wx.redirectTo({ url: '/pages/login/login' });
      return;
    }
    wx.showLoading({ title: '加载中...' });
    request.get('/cases?history=true', true).then(({ data }) => {
      wx.hideLoading();
      const list = Array.isArray(data) ? data.filter(i => i.statusType === 'completed').map(mapCaseItem) : [];
      this.setData({ caseList: list }, () => this.filterCases());
    }).catch((err) => {
      wx.hideLoading();
      if (err.statusCode === 401) wx.redirectTo({ url: '/pages/login/login' });
      else wx.showToast({ title: err.message || '加载失败', icon: 'none' });
      this.setData({ caseList: [] }, () => this.filterCases());
    });
  },
  
  onShow() {
    // 页面显示时更新筛选条件
    this.filterCases();
  },
  
  // 过滤案件
  filterCases() {
    let filtered = [...this.data.caseList];
    const keyword = this.data.searchKeyword.trim();
    const caseTypeIndex = this.data.caseTypeIndex;
    const yearFilter = this.data.yearFilter;
    
    if (keyword) {
      filtered = filtered.filter(caseItem => {
        const c = (caseItem.client || '') + (caseItem.lawyer || '');
        return (caseItem.caseNo || '').includes(keyword) ||
               (caseItem.title || '').includes(keyword) ||
               c.includes(keyword) ||
               (caseItem.court && caseItem.court.includes(keyword));
      });
    }
    
    // 案件类型筛选
    if (caseTypeIndex > 0) {
      const selectedType = this.data.caseTypes[caseTypeIndex];
      filtered = filtered.filter(caseItem => caseItem.type === selectedType);
    }
    
    if (yearFilter) {
      filtered = filtered.filter(caseItem => {
        const d = caseItem.completeDate || caseItem.date || '';
        const caseYear = d.split('-')[0];
        return caseYear === yearFilter;
      });
    }
    
    // 按结案时间倒序排序
    filtered.sort((a, b) => {
      const dateA = a.completeDate || a.date;
      const dateB = b.completeDate || b.date;
      return new Date(dateB) - new Date(dateA);
    });
    
    this.setData({
      filteredCaseList: filtered
    });
  },
  
  // 返回上一页
  goBack() {
    wx.navigateBack();
  },
  
  // 输入框内容变化
  onSearchInput(e) {
    this.setData({
      searchKeyword: e.detail.value
    });
  },
  
  // 清空搜索
  clearSearch() {
    this.setData({
      searchKeyword: ''
    }, () => {
      this.filterCases();
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
  
  // 案件类型变更
  onCaseTypeChange(e) {
    this.setData({
      caseTypeIndex: e.detail.value
    }, () => {
      this.filterCases();
    });
  },
  
  // 年份筛选变更
  onYearChange(e) {
    this.setData({
      yearFilter: e.detail.value
    }, () => {
      this.filterCases();
    });
  },
  
  // 清空筛选条件
  clearFilters() {
    this.setData({
      searchKeyword: '',
      caseTypeIndex: -1,
      yearFilter: ''
    }, () => {
      this.filterCases();
      wx.showToast({
        title: '已清除筛选条件',
        icon: 'success'
      });
    });
  },
  
  // 查看案件详情
  viewCaseDetail(e) {
    const caseId = e.currentTarget.dataset.id;
    const caseItem = this.data.filteredCaseList.find(item => item.id == caseId);
    
    if (caseItem) {
      wx.navigateTo({
        url: `/subpackages/lawyer/pages/past-case-detail/past-case-detail?id=${caseId}&title=${encodeURIComponent(caseItem.title)}&history=true`
      });
    }
  },
  
  // 查看案件卷宗
  viewCaseDocuments(e) {
    const caseId = e.currentTarget.dataset.id;
    const caseItem = this.data.filteredCaseList.find(item => item.id == caseId);
    
    if (caseItem) {
      wx.showToast({
        title: '正在打开卷宗...',
        icon: 'none'
      });
      
      // 模拟加载
      setTimeout(() => {
        wx.navigateTo({
          url: `/subpackages/lawyer/pages/case-documents/case-documents?caseId=${caseId}&title=${encodeURIComponent(caseItem.title)}`
        });
      }, 500);
    }
  },
  
  // 联系当事人
  contactClient(e) {
    const caseId = e.currentTarget.dataset.id;
    const caseItem = this.data.filteredCaseList.find(item => item.id == caseId);
    
    if (caseItem) {
      wx.navigateTo({
        url: `/subpackages/lawyer/pages/chat/index?caseId=${caseId}&client=${caseItem.client}`
      });
    }
  }
});