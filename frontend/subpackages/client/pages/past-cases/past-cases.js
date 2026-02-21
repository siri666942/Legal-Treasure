// 过往案件查询页面
const app = getApp();

Page({
  data: {
    // 过往案件数据
    caseList: [
      {
        id: 1,
        caseNo: '2023-民-001',
        title: '张三诉李四合同纠纷案',
        status: '已结案',
        statusType: 'completed',
        client: '张三',
        date: '2023-12-15',
        completeDate: '2023-12-10',
        completeType: '调解结案',
        type: '合同纠纷',
        court: '北京市朝阳区人民法院',
        judge: '王法官',
        result: '胜诉'
      },
      {
        id: 2,
        caseNo: '2023-民-002',
        title: '王五离婚诉讼案',
        status: '已结案',
        statusType: 'completed',
        client: '王五',
        date: '2023-11-20',
        completeDate: '2023-11-15',
        completeType: '判决',
        type: '婚姻家庭',
        court: '上海市浦东新区人民法院',
        judge: '李法官',
        result: '部分支持'
      },
      {
        id: 3,
        caseNo: '2023-刑-001',
        title: '赵六故意伤害案',
        status: '已结案',
        statusType: 'completed',
        client: '赵六',
        date: '2023-10-30',
        completeDate: '2023-10-25',
        completeType: '判决',
        type: '刑事',
        court: '广州市中级人民法院',
        judge: '张法官',
        result: '缓刑'
      },
      {
        id: 4,
        caseNo: '2022-民-100',
        title: '钱七劳动争议案',
        status: '已结案',
        statusType: 'completed',
        client: '钱七',
        date: '2022-09-15',
        completeDate: '2022-09-10',
        completeType: '仲裁',
        type: '劳动争议',
        court: '深圳市劳动人事争议仲裁委员会',
        result: '胜诉'
      },
      {
        id: 5,
        caseNo: '2022-民-101',
        title: '孙八借贷纠纷案',
        status: '已结案',
        statusType: 'completed',
        client: '孙八',
        date: '2022-08-20',
        completeDate: '2022-08-15',
        completeType: '调解结案',
        type: '债权债务',
        court: '杭州市西湖区人民法院',
        judge: '陈法官',
        result: '胜诉'
      },
      {
        id: 6,
        caseNo: '2022-刑-050',
        title: '周九交通肇事案',
        status: '已结案',
        statusType: 'completed',
        client: '周九',
        date: '2022-07-10',
        completeDate: '2022-07-05',
        completeType: '判决',
        type: '刑事',
        court: '南京市鼓楼区人民法院',
        judge: '刘法官',
        result: '有期徒刑1年'
      },
      {
        id: 7,
        caseNo: '2021-民-200',
        title: '吴十房屋买卖合同纠纷案',
        status: '已结案',
        statusType: 'completed',
        client: '吴十',
        date: '2021-06-25',
        completeDate: '2021-06-20',
        completeType: '判决',
        type: '房产纠纷',
        court: '成都市锦江区人民法院',
        judge: '杨法官',
        result: '胜诉'
      }
    ],
    
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
    // 检查登录状态
    if (!app.globalData.isLogin) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }
    
    // 初始化数据
    this.filterCases();
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
    
    // 关键词搜索
    if (keyword) {
      filtered = filtered.filter(caseItem => {
        return caseItem.caseNo.includes(keyword) || 
               caseItem.title.includes(keyword) || 
               caseItem.client.includes(keyword) ||
               (caseItem.court && caseItem.court.includes(keyword));
      });
    }
    
    // 案件类型筛选
    if (caseTypeIndex > 0) {
      const selectedType = this.data.caseTypes[caseTypeIndex];
      filtered = filtered.filter(caseItem => caseItem.type === selectedType);
    }
    
    // 年份筛选
    if (yearFilter) {
      filtered = filtered.filter(caseItem => {
        const caseYear = caseItem.completeDate ? caseItem.completeDate.split('-')[0] : caseItem.date.split('-')[0];
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