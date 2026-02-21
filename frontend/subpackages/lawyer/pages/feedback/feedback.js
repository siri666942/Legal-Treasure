// subpackages/lawyer/pages/help/feedback.js
const app = getApp();

Page({
  data: {
    // 常见问题（律师端专用）
    faqList: [
      {
        id: 1,
        question: '如何接收和处理案件？',
        answer: '1. 在"案件"页面查看所有新案件\n2. 点击案件查看详情，确认是否接案\n3. 接案后可在案件详情页查看客户信息\n4. 使用"沟通"功能与客户保持联系\n5. 及时更新案件进度和上传文件',
        expanded: false
      },
      {
        id: 2,
        question: '如何设置服务费用？',
        answer: '1. 进入"我的"页面，点击"律师名片"\n2. 在名片设置中可调整服务费用\n3. 支持按小时、按案件、按阶段收费\n4. 费用调整后需等待平台审核\n5. 具体案件费用可与客户协商确定',
        expanded: false
      },
      {
        id: 3,
        question: '如何上传案件文件？',
        answer: '1. 在案件详情页点击"案件文件"\n2. 支持上传图片、PDF、Word、Excel等格式\n3. 重要文件请做好加密和备份\n4. 系统会自动同步给案件相关方\n5. 文件最大支持50MB',
        expanded: false
      },
      {
        id: 4,
        question: '如何在线沟通和咨询？',
        answer: '1. 在"沟通"页面选择对应客户\n2. 支持文字、图片、语音、文件传输\n3. 可预约视频会议进行在线咨询\n4. 沟通记录自动保存，方便查阅\n5. 重要内容可收藏或导出',
        expanded: false
      },
      {
        id: 5,
        question: '如何查看收入记录？',
        answer: '1. 进入"我的"页面，点击"账户设置"\n2. 选择"收入记录"查看所有收入\n3. 支持按时间、案件类型筛选\n4. 可查看每笔收入的详细情况\n5. 每月10号前可申请提现',
        expanded: false
      },
      {
        id: 6,
        question: '如何提高律师排名？',
        answer: '1. 完善律师资料，上传执业证书\n2. 及时回复客户咨询和处理案件\n3. 获得客户好评和案例积累\n4. 参与平台活动和专业培训\n5. 保持在线活跃度和响应速度',
        expanded: false
      }
    ],
    
    // 反馈信息
    feedback: {
      type: 1, // 1:功能建议 2:使用问题 3:投诉举报 4:合作咨询 5:认证问题
      content: '',
      contact: '',
      images: []
    },
    
    // 界面状态
    contentLength: 0,
    isSubmitting: false,
    canSubmit: false,
    
    // 律师专用联系方式（已移除紧急电话）
    lawyerContact: {
      phone: '400-123-4567',
      wechat: 'LawyerPlatform_Service',
      email: 'lawyer-support@legalhelper.com',
      time: '周一至周五 9:00-18:00'
    }
  },

  onLoad(options) {
    // 检查登录状态
    if (!app.globalData.isLogin) {
      wx.redirectTo({
        url: '/pages/login/login'
      });
      return;
    }
    
    // 加载律师的联系方式作为默认值
    const lawyerInfo = wx.getStorageSync('lawyerInfo');
    if (lawyerInfo && lawyerInfo.phone) {
      this.setData({
        'feedback.contact': lawyerInfo.phone
      });
    }
  },

  onShow() {
    // 页面显示时设置标题
    wx.setNavigationBarTitle({
      title: '帮助与反馈'
    });
  },

  // 切换问题展开状态
  toggleQuestion(e) {
    const id = e.currentTarget.dataset.id;
    const faqList = this.data.faqList.map(item => {
      if (item.id === id) {
        return { ...item, expanded: !item.expanded };
      }
      return item;
    });
    
    this.setData({ faqList });
  },

  // 设置反馈类型
  setFeedbackType(e) {
    const type = parseInt(e.currentTarget.dataset.type);
    this.setData({
      'feedback.type': type
    }, () => {
      this.checkCanSubmit();
    });
  },

  // 反馈内容输入
  onContentInput(e) {
    const content = e.detail.value;
    const contentLength = content.length;
    
    this.setData({
      'feedback.content': content,
      contentLength: contentLength
    }, () => {
      this.checkCanSubmit();
    });
  },

  // 联系方式输入
  onContactInput(e) {
    this.setData({
      'feedback.contact': e.detail.value
    });
  },

  // 检查是否可以提交
  checkCanSubmit() {
    const { content, type } = this.data.feedback;
    const canSubmit = content.length >= 10 && content.length <= 500 && type;
    
    this.setData({ canSubmit });
  },

  // 选择图片
  chooseImage() {
    if (this.data.feedback.images.length >= 3) {
      wx.showToast({
        title: '最多上传3张图片',
        icon: 'none'
      });
      return;
    }
    
    wx.chooseImage({
      count: 3 - this.data.feedback.images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const newImages = [...this.data.feedback.images, ...res.tempFilePaths];
        this.setData({
          'feedback.images': newImages
        });
      }
    });
  },

  // 删除图片
  deleteImage(e) {
    const index = e.currentTarget.dataset.index;
    const images = this.data.feedback.images.filter((_, i) => i !== index);
    
    this.setData({
      'feedback.images': images
    });
  },

  submitFeedback() {
    if (!this.data.canSubmit || this.data.isSubmitting) return;
    const { type, content, contact, images } = this.data.feedback;
    if (content.length < 10) {
      wx.showToast({ title: '请至少输入10个字符', icon: 'none' });
      return;
    }
    if (content.length > 500) {
      wx.showToast({ title: '内容不能超过500个字符', icon: 'none' });
      return;
    }
    this.setData({ isSubmitting: true });
    wx.showLoading({ title: '提交中...', mask: true });
    const request = require('../../../common/utils/request.js');
    const payload = {
      type,
      content,
      contact: contact || null,
      images: (images && images.length) ? images.slice(0, 3) : null
    };
    request.post('/feedback', payload, false).then(() => {
      wx.hideLoading();
      wx.showModal({
        title: '提交成功',
        content: '感谢您的反馈！我们将在24小时内处理并回复您。',
        showCancel: false,
        success: () => {
          this.setData({
            feedback: { type: 1, content: '', contact: '', images: [] },
            contentLength: 0,
            isSubmitting: false,
            canSubmit: false
          });
        }
      });
    }).catch((err) => {
      wx.hideLoading();
      this.setData({ isSubmitting: false });
      wx.showToast({ title: err.message || '提交失败', icon: 'none' });
    });
  },

  // 拨打客服电话
  callCustomerService() {
    wx.makePhoneCall({
      phoneNumber: this.data.lawyerContact.phone
    });
  },

  // 复制微信号
  copyWechat() {
    wx.setClipboardData({
      data: this.data.lawyerContact.wechat,
      success: () => {
        wx.showToast({
          title: '微信号已复制',
          icon: 'success'
        });
      }
    });
  },

  // 复制邮箱
  copyEmail() {
    wx.setClipboardData({
      data: this.data.lawyerContact.email,
      success: () => {
        wx.showToast({
          title: '邮箱已复制',
          icon: 'success'
        });
      }
    });
  },

  // 查看工作时间
  viewWorkingHours() {
    wx.showModal({
      title: '服务时间',
      content: `客服工作时间：\n${this.data.lawyerContact.time}`,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 获得更多帮助 - 跳转到沟通页面
  goToCommunication() {
    wx.navigateTo({
      url: '/subpackages/lawyer/pages/communication/communication'
    });
  }
});