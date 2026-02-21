const app = getApp();
const request = require('../../../common/utils/request.js');

Page({
  data: {
    // 常见问题（客户端专用）
    faqList: [
      {
        id: 1,
        question: '如何寻找律师？',
        answer: '1. 点击首页“寻找律师”按钮\n2. 可按专业领域、地区、评分筛选\n3. 查看律师详情，点击“在线咨询”\n4. 支付咨询费后即可与律师沟通\n5. 也可以直接拨打律师电话（若律师提供）',
        expanded: false
      },
      {
        id: 2,
        question: '如何咨询律师？',
        answer: '1. 在律师详情页点击“在线咨询”\n2. 选择咨询方式（文字/语音/视频）\n3. 支付咨询费后进入聊天界面\n4. 可发送文字、图片、文件\n5. 咨询记录永久保存，可随时查看',
        expanded: false
      },
      {
        id: 3,
        question: '如何查看我的案件进度？',
        answer: '1. 进入“案件”页面，查看所有案件\n2. 点击具体案件进入详情页\n3. 可查看案件进度、时间轴、文件\n4. 律师更新进度后会有消息提醒\n5. 可随时与律师在线沟通',
        expanded: false
      },
      {
        id: 4,
        question: '如何支付咨询费？',
        answer: '1. 支持微信支付、支付宝支付\n2. 咨询前需预付费，按小时/按次计费\n3. 未接通咨询可申请退款\n4. 支付后若律师未及时回复，可申请平台介入\n5. 发票可在“我的-发票管理”申请',
        expanded: false
      },
      {
        id: 5,
        question: '如何评价律师？',
        answer: '1. 案件结束后可对律师进行评价\n2. 评价维度：专业能力、响应速度、服务态度\n3. 评价内容将影响律师排名\n4. 匿名评价或实名评价可选\n5. 评价后不可修改，请慎重',
        expanded: false
      },
      {
        id: 6,
        question: '遇到纠纷如何维权？',
        answer: '1. 首先与律师沟通协商\n2. 若无法解决，可联系平台客服\n3. 提交相关证据，平台将介入调解\n4. 如需退款，可在“我的订单”申请\n5. 严重问题可向司法机关投诉',
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
    
    // 用户端联系方式
    clientContact: {
      phone: '400-123-8888',
      wechat: 'LegalHelper_Client',
      email: 'client-support@legalhelper.com',
      time: '周一至周日 9:00-21:00'
    }
  },

  onLoad(options) {
    // 检查登录状态
    if (!app.globalData.isLogin) {
      wx.redirectTo({
        url: '/subpackages/client/pages/login/login'
      });
      return;
    }
    
    // 加载用户的联系方式作为默认值
    const userInfo = app.globalData.userInfo || {};
    if (userInfo.phone) {
      this.setData({
        'feedback.contact': userInfo.phone
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

  // 提交反馈
  submitFeedback() {
    if (!this.data.canSubmit || this.data.isSubmitting) {
      return;
    }
    
    const { type, content, contact, images } = this.data.feedback;
    
    if (content.length < 10) {
      wx.showToast({
        title: '请至少输入10个字符',
        icon: 'none'
      });
      return;
    }
    if (content.length > 500) {
      wx.showToast({
        title: '内容不能超过500个字符',
        icon: 'none'
      });
      return;
    }
    
    this.setData({ isSubmitting: true });
    wx.showLoading({ title: '提交中...', mask: true });
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
        content: '感谢您的反馈！我们将尽快处理并回复您。',
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
      phoneNumber: this.data.clientContact.phone
    });
  },

  // 复制微信号
  copyWechat() {
    wx.setClipboardData({
      data: this.data.clientContact.wechat,
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
      data: this.data.clientContact.email,
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
      content: `客服工作时间：\n${this.data.clientContact.time}`,
      showCancel: false,
      confirmText: '知道了'
    });
  },

  // 获得更多帮助 - 跳转到用户端的沟通页面（或帮助中心）
  goToCommunication() {
    wx.navigateTo({
      url: '/subpackages/client/pages/communication/communication'
    });
  }
});