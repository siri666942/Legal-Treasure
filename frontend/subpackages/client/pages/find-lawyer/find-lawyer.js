// pages/find-lawyer/index.js
const request = require('../../../common/utils/request.js');

function mapLawyer(item) {
  return {
    id: item.id,
    name: item.name || '',
    title: item.title || '',
    avatarEmoji: item.avatarEmoji || '👨‍⚖️',
    introduction: item.introduction || '',
    tags: Array.isArray(item.tags) ? item.tags : [],
    categories: Array.isArray(item.categories) ? item.categories : []
  };
}

Page({
    data: {
      searchKeyword: '',
      currentFilter: 'all',
      filterTags: [
        { id: 'civil', name: '民事纠纷' },
        { id: 'criminal', name: '刑事辩护' },
        { id: 'company', name: '公司法务' },
        { id: 'ip', name: '知识产权' },
        { id: 'labor', name: '劳动纠纷' },
        { id: 'marriage', name: '婚姻家庭' },
        { id: 'property', name: '房产纠纷' },
        { id: 'contract', name: '合同纠纷' },
        { id: 'traffic', name: '交通事故' },
        { id: 'medical', name: '医疗纠纷' }
      ],
      allLawyers: [],
      displayedLawyers: [],
      searchResultCount: 0
    },

    onLoad() {
      wx.showLoading({ title: '加载中...' });
      request.get('/lawyers', false).then(({ data }) => {
        wx.hideLoading();
        const list = Array.isArray(data) ? data.map(mapLawyer) : [];
        this.setData({ allLawyers: list }, () => this.updateDisplayedLawyers());
      }).catch(() => {
        wx.hideLoading();
        wx.showToast({ title: '加载律师列表失败', icon: 'none' });
        this.updateDisplayedLawyers();
      });
    },
  
    // 搜索输入处理
    onSearchInput(e) {
      const keyword = e.detail.value.trim();
      this.setData({
        searchKeyword: keyword
      });
      
      // 防抖处理，避免频繁更新
      clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.updateDisplayedLawyers();
      }, 300);
    },
  
    // 搜索确认（点击键盘搜索按钮）
    onSearchConfirm(e) {
      const keyword = e.detail.value.trim();
      this.setData({
        searchKeyword: keyword
      });
      this.updateDisplayedLawyers();
    },
  
    // 清除搜索
    onClearSearch() {
      this.setData({
        searchKeyword: ''
      });
      this.updateDisplayedLawyers();
    },
  
    // 更新显示的律师列表
    updateDisplayedLawyers() {
      const { currentFilter, allLawyers, searchKeyword } = this.data;
      
      let filteredLawyers;
      
      if (currentFilter === 'all') {
        filteredLawyers = allLawyers;
      } else {
        filteredLawyers = allLawyers.filter(lawyer =>
          (lawyer.categories || []).includes(currentFilter)
        );
      }
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        filteredLawyers = filteredLawyers.filter(lawyer => {
          const intro = (lawyer.introduction || '').toLowerCase();
          const tags = (lawyer.tags || []).map(t => t.toLowerCase());
          return (lawyer.name || '').toLowerCase().includes(keyword) ||
                 (lawyer.title || '').toLowerCase().includes(keyword) ||
                 intro.includes(keyword) ||
                 tags.some(tag => tag.includes(keyword));
        });
      }
      
      // 更新搜索结果数量
      this.setData({
        searchResultCount: filteredLawyers.length
      });
      
      // 将律师列表分组，每行两个
      const grouped = [];
      for (let i = 0; i < filteredLawyers.length; i += 2) {
        grouped.push(filteredLawyers.slice(i, i + 2));
      }
      
      this.setData({
        displayedLawyers: grouped
      });
    },
  
    // 筛选标签点击事件
    onFilterTap(e) {
      const tag = e.currentTarget.dataset.tag;
      
      if (this.data.currentFilter === tag) {
        return; // 点击已选中的标签不做处理
      }
      
      this.setData({
        currentFilter: tag
      }, () => {
        this.updateDisplayedLawyers();
      });
    },
  
    // 重置筛选条件
    onResetFilter() {
      this.setData({
        currentFilter: 'all',
        searchKeyword: ''
      }, () => {
        this.updateDisplayedLawyers();
      });
    },
  
    // 律师卡片点击事件
    onLawyerTap(e) {
      const lawyerId = e.currentTarget.dataset.id;
      
      // 跳转到律师详情页
      wx.navigateTo({
        url: `/subpackages/client/pages/lawyer-detail/lawyer-detail?id=${lawyerId}`
      });
    },
  
    // 立即咨询按钮点击事件 - 使用 catchtap 阻止事件冒泡
    onConsultTap(e) {
      const lawyerId = e.currentTarget.dataset.id;
      
      wx.showModal({
        title: '立即咨询',
        content: '是否立即联系律师进行咨询？',
        confirmText: '确定',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            // 这里可以调用微信客服功能或跳转到聊天页面
            wx.showToast({
              title: '正在为您接通律师',
              icon: 'loading',
              duration: 2000
            });
            
            // 模拟接通后跳转
            setTimeout(() => {
              wx.navigateTo({
                url: `/subpackages/client/pages/communication/communication?lawyerId=${lawyerId}`
              });
            }, 2000);
          }
        }
      });
    }
  })