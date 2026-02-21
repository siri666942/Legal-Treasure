// subpackages/client/pages/lawyer-detail/lawyer-detail.js
const request = require('../../../common/utils/request.js');

Page({
    data: {
      lawyerId: null,
      lawyerInfo: {
        name: '',
        title: '',
        avatarEmoji: '👨‍⚖️',
        organization: '',
        licenseNumber: '',
        practiceYears: '',
        practiceArea: '',
        expertise: '',
        stats: { caseCount: '', winRate: '', clientSatisfaction: '', years: '' },
        education: { degree: '', school: '', major: '' },
        languageSkills: '',
        introduction: '',
        expertiseAreas: [],
        workExperience: [],
        caseExperience: []
      }
    },

    onLoad(options) {
      const lawyerId = options.id;
      this.setData({ lawyerId });
      if (!lawyerId) return;
      wx.showLoading({ title: '加载中...' });
      request.get('/lawyers/' + lawyerId, false).then(({ data }) => {
        wx.hideLoading();
        const stats = data.stats || {};
        const education = data.education || {};
        const info = {
          name: data.name || '',
          title: data.title || '',
          avatarEmoji: data.avatarEmoji || '👨‍⚖️',
          organization: data.organization || '',
          licenseNumber: data.licenseNumber || '',
          practiceYears: data.practiceYears || '',
          practiceArea: data.practiceArea || '',
          expertise: data.expertise || '',
          stats: {
            caseCount: stats.caseCount || '',
            winRate: stats.winRate || '',
            clientSatisfaction: stats.clientSatisfaction || '',
            years: stats.years || data.practiceYears || ''
          },
          education: {
            degree: education.degree || '',
            school: education.school || '',
            major: education.major || ''
          },
          languageSkills: data.languageSkills || '',
          introduction: data.introduction || '',
          expertiseAreas: Array.isArray(data.expertiseAreas) ? data.expertiseAreas : [],
          workExperience: Array.isArray(data.workExperience) ? data.workExperience : [],
          caseExperience: Array.isArray(data.caseExperience) ? data.caseExperience : []
        };
        this.setData({ lawyerInfo: info });
      }).catch(() => {
        wx.hideLoading();
        wx.showToast({ title: '加载律师信息失败', icon: 'none' });
      });
    },
  
    // 电话咨询
    onPhoneTap() {
      console.log('电话咨询按钮点击');
      wx.showModal({
        title: '电话咨询',
        content: '是否拨打律师咨询电话？',
        confirmText: '拨打',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            wx.makePhoneCall({
              phoneNumber: '400-123-4567'
            });
          }
        }
      });
    },
  
    // 在线咨询
    onConsultTap() {
      console.log('立即咨询按钮点击，律师ID:', this.data.lawyerId);
      
      // 检查是否有律师ID
      if (!this.data.lawyerId) {
        wx.showToast({
          title: '获取律师信息失败',
          icon: 'error',
          duration: 2000
        });
        return;
      }
      
      wx.showModal({
        title: '在线咨询',
        content: '是否立即与该律师在线沟通？',
        confirmText: '确定',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            wx.showToast({
              title: '正在为您接通律师',
              icon: 'loading',
              duration: 2000
            });
            
            // 模拟接通后跳转
            setTimeout(() => {
              wx.navigateTo({
                url: `/subpackages/client/pages/communication/communication?lawyerId=${this.data.lawyerId}`
              });
            }, 2000);
          }
        }
      });
    },
  
    onShareAppMessage() {
      return {
        title: `${this.data.lawyerInfo.name} - 权威执业律师`,
        path: `/subpackages/client/pages/lawyer-detail/lawyer-detail?id=${this.data.lawyerId}`
      };
    }
  });