// subpackages/lawyer/pages/create-case/create-case.js
Page({
    data: {
      // 表单数据（全部为文本输入，除立案时间）
      formData: {
        caseNo: '',
        caseTitle: '',
        caseType: '',       // 案件类型（文本输入）
        court: '',          // 受理法院（文本输入）
        judge: '',          // 承办法官（文本输入）
        filingDate: '',     // 立案时间（日期选择）
        amount: '',         // 标的金额
        applicableLaw: ''   // 适用法律
      },
  
      // 立案时间原始值（用于picker）
      filingDateRaw: '',
  
      // 成功浮窗控制
      showSuccessModal: false,
      bindCode: ''          // 生成的绑定码
    },
  
    onLoad: function(options) {
      console.log('创建新案件页面加载');
      this.setDefaultFilingDate();
    },
  
    // ========== 所有文本输入处理 ==========
    onCaseNoInput(e) {
      this.setData({ 'formData.caseNo': e.detail.value });
    },
    onCaseTitleInput(e) {
      this.setData({ 'formData.caseTitle': e.detail.value });
    },
    onCaseTypeInput(e) {
      this.setData({ 'formData.caseType': e.detail.value });
    },
    onCourtInput(e) {
      this.setData({ 'formData.court': e.detail.value });
    },
    onJudgeInput(e) {
      this.setData({ 'formData.judge': e.detail.value });
    },
    onAmountInput(e) {
      this.setData({ 'formData.amount': e.detail.value });
    },
    onApplicableLawInput(e) {
      this.setData({ 'formData.applicableLaw': e.detail.value });
    },
  
    // ========== 立案时间选择 ==========
    onFilingDateChange(e) {
      const date = e.detail.value;
      const parts = date.split('-');
      const formatted = `${parts[0]}年${parseInt(parts[1])}月${parseInt(parts[2])}日`;
      this.setData({
        filingDateRaw: date,
        'formData.filingDate': formatted
      });
    },
  
    // 设置默认立案时间为今天
    setDefaultFilingDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const day = now.getDate();
      const formatted = `${year}年${month}月${day}日`;
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
      this.setData({
        filingDateRaw: dateStr,
        'formData.filingDate': formatted
      });
    },
  
    // ========== 生成随机绑定码（8位，大写字母+数字）==========
    generateBindCode() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let code = '';
      for (let i = 0; i < 8; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    },
  
    // ========== 保存案件，成功后弹出浮窗展示绑定码 ==========
    saveCase() {
      const form = this.data.formData;
  
      // 必填字段验证
      if (!form.caseNo.trim()) {
        wx.showToast({ title: '请输入案号', icon: 'none' });
        return;
      }
      if (!form.caseTitle.trim()) {
        wx.showToast({ title: '请输入案件名称', icon: 'none' });
        return;
      }
      if (!form.caseType.trim()) {
        wx.showToast({ title: '请输入案件类型', icon: 'none' });
        return;
      }
      if (!form.court.trim()) {
        wx.showToast({ title: '请输入受理法院', icon: 'none' });
        return;
      }
      if (!form.filingDate) {
        wx.showToast({ title: '请选择立案时间', icon: 'none' });
        return;
      }
  
      wx.showLoading({ title: '创建中...' });
  
      // 模拟创建请求
      setTimeout(() => {
        wx.hideLoading();
  
        // 1. 生成绑定码
        const bindCode = this.generateBindCode();
        console.log('新案件数据:', form);
        console.log('生成绑定码:', bindCode);
  
        // 2. 更新数据并显示成功浮窗
        this.setData({
          bindCode: bindCode,
          showSuccessModal: true
        });
  
        // 实际开发中应将案件数据和绑定码提交至服务器
      }, 1000);
    },
  
    // ========== 复制绑定码并返回 ==========
    copyBindCode() {
      wx.setClipboardData({
        data: this.data.bindCode,
        success: () => {
          wx.showToast({
            title: '绑定码已复制',
            icon: 'success',
            duration: 800,
            success: () => {
              // 复制成功后关闭浮窗并返回上一页
              setTimeout(() => {
                wx.navigateBack();
              }, 300);
            }
          });
        }
      });
    },
  
    // ========== 关闭浮窗并返回 ==========
    closeModalAndBack() {
      this.setData({ showSuccessModal: false });
      wx.navigateBack();
    },
  
    // ========== 取消创建，直接返回 ==========
    cancelCreate() {
      wx.navigateBack();
    }
  });