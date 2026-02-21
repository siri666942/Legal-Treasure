// subpackages/lawyer/pages/lawyer-edit/lawyer-edit.js
Page({
    data: {
      // 律师信息数据（与客户端展示完全对应）
      lawyerInfo: {
        name: '张伟律师',
        title: '高级合伙人律师',
        avatarEmoji: '👨‍⚖️',        // 默认表情（仅当未上传图片时显示）
        avatar: '',                  // 头像图片临时路径（优先于表情）
        organization: '北京大成律师事务所',
        licenseNumber: '111011196886688',
        practiceYears: '15',
        practiceArea: '全国',
        expertise: '民商事诉讼、公司法务',
  
        // 统计数据
        stats: {
          caseCount: '850',
          winRate: '92',
          clientSatisfaction: '98',
          years: '15'
        },
  
        // 教育背景
        education: {
          degree: '法学硕士',
          school: '中国政法大学',
          major: '民商法学'
        },
  
        // 语言能力
        languageSkills: '中文普通话（母语）、英语（专业八级）、日语（商务水平）',
  
        // 专业介绍
        introduction: '张伟律师拥有15年执业经验，是国内民商事诉讼领域的资深专家。曾代理多起重大复杂案件，包括最高人民法院审理的股权纠纷案、金融借款合同纠纷案等。擅长处理企业法律风险防控、商事合同纠纷、公司治理等法律事务。多次荣获"全国优秀律师"、"十佳诉讼律师"等荣誉称号，现任中国律师协会民商法专业委员会委员。',
  
        // 专业领域（输入框用逗号分隔）
        expertiseAreasInput: '合同纠纷,公司股权,金融证券,知识产权,建设工程,房地产纠纷,债务追讨,法律顾问',
  
        // 工作经历
        workExperience: [
          {
            period: '2008年-至今',
            position: '高级合伙人',
            detail: '北京大成律师事务所，负责民商事诉讼团队管理，带领团队处理重大复杂案件'
          },
          {
            period: '2005年-2008年',
            position: '执业律师',
            detail: '金杜律师事务所，专注于公司法律事务和商事诉讼'
          },
          {
            period: '2003年-2005年',
            position: '法官助理',
            detail: '北京市高级人民法院，参与民商事案件审理工作'
          }
        ],
  
        // 代表性案例
        caseExperience: [
          {
            title: '某上市公司股权纠纷案',
            type: '商事诉讼',
            detail: '代理某上市公司处理股东间股权转让纠纷，案件涉及金额超过5亿元人民币。通过精准的法律分析和诉讼策略，成功维护了委托人的合法权益。',
            result: '胜诉，为客户挽回损失3.2亿元'
          },
          {
            title: '跨国企业合同纠纷仲裁案',
            type: '国际仲裁',
            detail: '代理国内某大型企业与欧洲跨国公司之间的技术许可合同纠纷，案件在斯德哥尔摩商会仲裁院进行。',
            result: '达成有利和解协议'
          },
          {
            title: '某集团建筑工程纠纷案',
            type: '建设工程',
            detail: '处理某大型房地产集团与施工方之间的建设工程合同纠纷，涉及工程质量、工期延误、工程款支付等多个复杂法律问题。',
            result: '部分胜诉，减少损失8000万元'
          }
        ]
      },
  
      // 临时存储专业领域标签（用于预览）
      expertiseTags: [],
  
      // 页面状态
      isSaving: false,
  
      // 预览浮窗控制
      showPreviewModal: false,
      previewData: {} // 预览时使用的数据
    },
  
    onLoad() {
      this.loadLawyerInfo();
    },
  
    // 加载律师信息（模拟从服务器获取）
    loadLawyerInfo() {
      const mockData = this.data.lawyerInfo;
      const expertiseTags = mockData.expertiseAreasInput
        ? mockData.expertiseAreasInput.split(',').map(tag => tag.trim())
        : [];
  
      this.setData({
        lawyerInfo: mockData,
        expertiseTags
      });
    },
  
    // ========== 通用输入事件 ==========
    onInputChange(e) {
      const { field, subfield } = e.currentTarget.dataset;
      const value = e.detail.value;
  
      if (subfield) {
        const [parent, child] = subfield.split('.');
        this.setData({
          [`lawyerInfo.${parent}.${child}`]: value
        });
      } else {
        this.setData({
          [`lawyerInfo.${field}`]: value
        });
  
        // 专业领域输入时实时更新标签预览
        if (field === 'expertiseAreasInput') {
          const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
          this.setData({ expertiseTags: tags });
        }
      }
    },
  
    // ========== 工作经历 ==========
    addWorkExperience() {
      const workExperience = [...this.data.lawyerInfo.workExperience, {
        period: '',
        position: '',
        detail: ''
      }];
      this.setData({ 'lawyerInfo.workExperience': workExperience });
    },
  
    removeWorkExperience(e) {
      const index = e.currentTarget.dataset.index;
      const workExperience = [...this.data.lawyerInfo.workExperience];
      if (workExperience.length > 1) {
        workExperience.splice(index, 1);
        this.setData({ 'lawyerInfo.workExperience': workExperience });
      } else {
        wx.showToast({ title: '至少保留一段经历', icon: 'none' });
      }
    },
  
    onWorkExperienceInput(e) {
      const { index, field } = e.currentTarget.dataset;
      const value = e.detail.value;
      this.setData({
        [`lawyerInfo.workExperience[${index}].${field}`]: value
      });
    },
  
    // ========== 代表性案例 ==========
    addCaseExperience() {
      const caseExperience = [...this.data.lawyerInfo.caseExperience, {
        title: '',
        type: '',
        detail: '',
        result: ''
      }];
      this.setData({ 'lawyerInfo.caseExperience': caseExperience });
    },
  
    removeCaseExperience(e) {
      const index = e.currentTarget.dataset.index;
      const caseExperience = [...this.data.lawyerInfo.caseExperience];
      if (caseExperience.length > 1) {
        caseExperience.splice(index, 1);
        this.setData({ 'lawyerInfo.caseExperience': caseExperience });
      } else {
        wx.showToast({ title: '至少保留一个案例', icon: 'none' });
      }
    },
  
    onCaseExperienceInput(e) {
      const { index, field } = e.currentTarget.dataset;
      const value = e.detail.value;
      this.setData({
        [`lawyerInfo.caseExperience[${index}].${field}`]: value
      });
    },
  
    // ========== 头像上传（仅保留拍照和从相册选择）=========
    uploadAvatar() {
      wx.showActionSheet({
        itemList: ['拍照', '从相册选择'],  // 已移除“使用表情符号”
        success: (res) => {
          if (res.tapIndex === 0) {
            this.takePhoto();
          } else if (res.tapIndex === 1) {
            this.chooseImage();
          }
        }
      });
    },
  
    // 拍照
    takePhoto() {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['camera'],
        success: (res) => {
          this.setData({
            'lawyerInfo.avatar': res.tempFilePaths[0],
            'lawyerInfo.avatarEmoji': ''  // 清空表情，优先显示图片
          });
        }
      });
    },
  
    // 从相册选择
    chooseImage() {
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        sourceType: ['album'],
        success: (res) => {
          this.setData({
            'lawyerInfo.avatar': res.tempFilePaths[0],
            'lawyerInfo.avatarEmoji': ''
          });
        }
      });
    },
  
    // ========== 预览名片（浮窗展示）=========
    previewCard() {
      // 从当前编辑的数据复制一份，并确保专业领域数组可用
      const previewData = JSON.parse(JSON.stringify(this.data.lawyerInfo));
      previewData.expertiseAreas = this.data.expertiseTags; // 用于预览的数组
      this.setData({
        previewData,
        showPreviewModal: true
      });
    },
  
    // ========== 关闭预览浮窗 ==========
    closePreviewModal() {
      this.setData({ showPreviewModal: false });
    },
  
    // ========== 保存与取消 ==========
    saveLawyerInfo() {
      if (this.data.isSaving) return;
  
      if (!this.data.lawyerInfo.name || !this.data.lawyerInfo.licenseNumber) {
        wx.showToast({ title: '请填写姓名和执业证号', icon: 'none' });
        return;
      }
  
      this.setData({ isSaving: true });
      wx.showLoading({ title: '保存中...', mask: true });
  
      setTimeout(() => {
        wx.hideLoading();
        this.setData({ isSaving: false });
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 1500,
          success: () => {
            setTimeout(() => { wx.navigateBack(); }, 1500);
          }
        });
      }, 1500);
    },
  
    cancelEdit() {
      wx.showModal({
        title: '确认取消',
        content: '所有未保存的修改将会丢失，确定要取消吗？',
        confirmText: '确定',
        cancelText: '继续编辑',
        success: (res) => {
          if (res.confirm) wx.navigateBack();
        }
      });
    }
  });