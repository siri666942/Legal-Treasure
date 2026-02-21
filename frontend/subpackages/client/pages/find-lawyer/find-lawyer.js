// pages/find-lawyer/index.js
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
      allLawyers: [
        {
          id: 1,
          name: '张伟律师',
          title: '高级合伙人',
          avatarEmoji: '👨‍⚖️',
          introduction: '民事纠纷专家，执业15年，处理案件超过800件',
          tags: ['民事纠纷', '合同纠纷', '债务纠纷'],
          categories: ['civil', 'contract']
        },
        {
          id: 2,
          name: '王明律师',
          title: '刑事部主任',
          avatarEmoji: '👨‍⚖️',
          introduction: '刑事辩护专家，成功辩护多起重大刑事案件',
          tags: ['刑事辩护', '经济犯罪', '职务犯罪'],
          categories: ['criminal']
        },
        {
          id: 3,
          name: '李娜律师',
          title: '公司法务顾问',
          avatarEmoji: '👩‍⚖️',
          introduction: '上市公司法律顾问，擅长企业风险防控',
          tags: ['公司法务', '合同审查', '股权纠纷'],
          categories: ['company', 'contract']
        },
        {
          id: 4,
          name: '陈晨律师',
          title: '知识产权专家',
          avatarEmoji: '👨‍⚖️',
          introduction: '专利商标侵权案件专家，保护企业知识产权',
          tags: ['知识产权', '专利侵权', '商标维权'],
          categories: ['ip']
        },
        {
          id: 5,
          name: '赵强律师',
          title: '劳动法专家',
          avatarEmoji: '👨‍⚖️',
          introduction: '专注劳动纠纷，维护劳动者合法权益',
          tags: ['劳动纠纷', '工伤赔偿', '劳动争议'],
          categories: ['labor']
        },
        {
          id: 6,
          name: '刘芳律师',
          title: '婚姻家庭专家',
          avatarEmoji: '👩‍⚖️',
          introduction: '婚姻家庭纠纷调解，保护妇女儿童权益',
          tags: ['婚姻家庭', '离婚诉讼', '财产分割'],
          categories: ['marriage']
        },
        {
          id: 7,
          name: '周涛律师',
          title: '房产法律专家',
          avatarEmoji: '👨‍⚖️',
          introduction: '房产买卖纠纷处理，房屋产权争议解决',
          tags: ['房产纠纷', '买卖纠纷', '产权争议'],
          categories: ['property']
        },
        {
          id: 8,
          name: '吴磊律师',
          title: '综合法律顾问',
          avatarEmoji: '👨‍⚖️',
          introduction: '综合法律服务，擅长各类民商事案件',
          tags: ['民事纠纷', '合同纠纷', '公司法务'],
          categories: ['civil', 'company', 'contract']
        },
        {
          id: 9,
          name: '孙悦律师',
          title: '交通事故专家',
          avatarEmoji: '👨‍⚖️',
          introduction: '交通事故责任认定，赔偿纠纷处理',
          tags: ['交通事故', '人身损害', '保险理赔'],
          categories: ['traffic']
        },
        {
          id: 10,
          name: '郑洁律师',
          title: '医疗纠纷专家',
          avatarEmoji: '👩‍⚖️',
          introduction: '医疗事故鉴定，医患纠纷调解处理',
          tags: ['医疗纠纷', '医疗事故', '医患调解'],
          categories: ['medical']
        },
        {
          id: 11,
          name: '马超律师',
          title: '债务纠纷专家',
          avatarEmoji: '👨‍⚖️',
          introduction: '债务追讨，企业坏账处理，信用风险防控',
          tags: ['债务纠纷', '债权债务', '信用风险'],
          categories: ['civil']
        },
        {
          id: 12,
          name: '黄芳律师',
          title: '劳动仲裁顾问',
          avatarEmoji: '👩‍⚖️',
          introduction: '劳动争议仲裁，集体诉讼，企业劳动合规',
          tags: ['劳动纠纷', '仲裁调解', '集体诉讼'],
          categories: ['labor']
        }
      ],
      displayedLawyers: [],
      searchResultCount: 0
    },
  
    onLoad() {
      this.updateDisplayedLawyers();
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
      
      // 第一步：按筛选标签过滤
      if (currentFilter === 'all') {
        filteredLawyers = allLawyers;
      } else {
        filteredLawyers = allLawyers.filter(lawyer => 
          lawyer.categories.includes(currentFilter)
        );
      }
      
      // 第二步：按搜索关键词过滤
      if (searchKeyword) {
        const keyword = searchKeyword.toLowerCase();
        filteredLawyers = filteredLawyers.filter(lawyer => {
          // 搜索律师姓名、职称、简介和标签
          return lawyer.name.toLowerCase().includes(keyword) ||
                 lawyer.title.toLowerCase().includes(keyword) ||
                 lawyer.introduction.toLowerCase().includes(keyword) ||
                 lawyer.tags.some(tag => tag.toLowerCase().includes(keyword));
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