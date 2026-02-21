// pages/test-components/index.js

Page({
    data: {
      // 当前选中的组件分类
      currentCategory: 'basic',
      
      // 测试数据
      testData: {
        // 按钮测试数据
        buttonTypes: ['primary', 'success', 'warning', 'danger', 'info', 'default'],
        buttonSizes: ['large', 'medium', 'small'],
        buttonLoading: false,
        
        // 模态框测试数据
        modalVisible: false,
        modalTitle: '测试标题',
        modalContent: '这是模态框的内容，用于展示一些重要信息或操作。',
        
        // 输入框测试数据
        inputValue: '',
        inputError: false,
        inputRules: [
          { required: true, message: '请输入内容' },
          { minLength: 3, message: '至少3个字符' }
        ],
        
        // 选择器测试数据
        pickerOptions: ['选项1', '选项2', '选项3', '选项4', '选项5'],
        pickerValue: '选项1',
        
        // 日期选择器测试数据
        dateValue: '',
        dateRange: ['2024-01-01', '2024-12-31'],
        
        // 上传组件测试数据
        uploadFiles: [],
        uploadMaxCount: 3,
        uploadMaxSize: 2 * 1024 * 1024, // 2MB
        
        // 案件卡片测试数据
        caseList: [
          {
            id: '1',
            caseNumber: 'C20240001',
            title: '张三诉李四合同纠纷案',
            status: 'pending',
            statusText: '待处理',
            createTime: '2024-01-15 10:30:00',
            updateTime: '2024-01-15 10:30:00',
            lawyer: '王律师',
            client: '张三',
            amount: 50000,
            tags: ['合同纠纷', '民事']
          },
          {
            id: '2',
            caseNumber: 'C20240002',
            title: '知识产权侵权案',
            status: 'processing',
            statusText: '处理中',
            createTime: '2024-01-14 14:20:00',
            updateTime: '2024-01-15 09:15:00',
            lawyer: '李律师',
            client: '创新科技公司',
            amount: 200000,
            tags: ['知识产权', '侵权']
          },
          {
            id: '3',
            caseNumber: 'C20240003',
            title: '劳动仲裁案',
            status: 'completed',
            statusText: '已完成',
            createTime: '2024-01-10 09:00:00',
            updateTime: '2024-01-12 16:45:00',
            lawyer: '赵律师',
            client: '李四',
            amount: 30000,
            tags: ['劳动法', '仲裁']
          }
        ],
        
        // 时间轴测试数据
        timelineItems: [
          {
            id: '1',
            title: '案件创建',
            time: '2024-01-15 10:30:00',
            description: '客户张三提交了案件信息',
            status: 'success',
            icon: 'checkbox'
          },
          {
            id: '2',
            title: '材料审核',
            time: '2024-01-15 11:15:00',
            description: '王律师开始审核案件材料',
            status: 'processing',
            icon: 'edit'
          },
          {
            id: '3',
            title: '方案制定',
            time: '2024-01-16 09:00:00',
            description: '正在制定解决方案',
            status: 'pending',
            icon: 'clock'
          },
          {
            id: '4',
            title: '结案',
            time: '待定',
            description: '等待案件处理完成',
            status: 'pending',
            icon: 'checkbox'
          }
        ],
        
        // 文档列表测试数据
        documentList: [
          {
            id: '1',
            name: '委托代理合同.pdf',
            size: 1250000,
            type: 'pdf',
            uploadTime: '2024-01-15 10:25:00',
            uploader: '张三',
            status: 'completed'
          },
          {
            id: '2',
            name: '证据材料.zip',
            size: 3500000,
            type: 'zip',
            uploadTime: '2024-01-15 10:30:00',
            uploader: '张三',
            status: 'completed'
          },
          {
            id: '3',
            name: '身份证明.jpg',
            size: 450000,
            type: 'image',
            uploadTime: '2024-01-15 10:32:00',
            uploader: '张三',
            status: 'uploading',
            progress: 60
          }
        ]
      },
      
      // 组件分类
      categories: [
        {
          id: 'basic',
          name: '基础组件',
          icon: 'home',
          components: [
            { id: 'button', name: '按钮', desc: '多种样式和状态的按钮' },
            { id: 'modal', name: '模态框', desc: '对话框和提示框' },
            { id: 'loading', name: '加载', desc: '加载状态指示器' },
            { id: 'empty', name: '空状态', desc: '数据为空时的展示' }
          ]
        },
        {
          id: 'form',
          name: '表单组件',
          icon: 'edit',
          components: [
            { id: 'input', name: '输入框', desc: '文本输入组件' },
            { id: 'picker', name: '选择器', desc: '下拉选择组件' },
            { id: 'date-picker', name: '日期选择器', desc: '日期时间选择' },
            { id: 'upload', name: '上传', desc: '文件上传组件' }
          ]
        },
        {
          id: 'business',
          name: '业务组件',
          icon: 'case',
          components: [
            { id: 'case-card', name: '案件卡片', desc: '案件信息展示卡片' },
            { id: 'timeline', name: '时间轴', desc: '时间线展示组件' },
            { id: 'document-list', name: '文档列表', desc: '文件列表展示' }
          ]
        }
      ]
    },
  
    onLoad() {
      console.log('组件测试页面加载');
      // 初始化日期
      this.setData({
        'testData.dateValue': this.getCurrentDate()
      });
    },
  
    /**
     * 获取当前日期
     */
    getCurrentDate() {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
  
    /**
     * 切换组件分类
     */
    switchCategory(e) {
      const category = e.currentTarget.dataset.category;
      this.setData({
        currentCategory: category
      });
    },
  
    /**
     * 按钮点击事件
     */
    onButtonTap(e) {
      const { type, size } = e.currentTarget.dataset;
      
      console.log(`按钮被点击：type=${type}, size=${size}`);
      
      wx.showToast({
        title: `点击了${type}按钮`,
        icon: 'none'
      });
      
      // 模拟加载状态
      if (type === 'primary') {
        this.setData({
          'testData.buttonLoading': true
        });
        
        setTimeout(() => {
          this.setData({
            'testData.buttonLoading': false
          });
        }, 2000);
      }
    },
  
    /**
     * 显示模态框
     */
    showModal() {
      this.setData({
        'testData.modalVisible': true
      });
    },
  
    /**
     * 隐藏模态框
     */
    hideModal() {
      this.setData({
        'testData.modalVisible': false
      });
    },
  
    /**
     * 模态框确认
     */
    onModalConfirm() {
      console.log('模态框确认按钮被点击');
      
      this.hideModal();
      wx.showToast({
        title: '确认操作',
        icon: 'success'
      });
    },
  
    /**
     * 模态框取消
     */
    onModalCancel() {
      console.log('模态框取消按钮被点击');
      
      this.hideModal();
    },
  
    /**
     * 输入框输入事件
     */
    onInputChange(e) {
      const value = e.detail.value;
      this.setData({
        'testData.inputValue': value,
        'testData.inputError': value && value.length < 3
      });
      
      if (value.length > 0 && value.length < 3) {
        wx.showToast({
          title: '至少需要3个字符',
          icon: 'none'
        });
      }
    },
  
    /**
     * 选择器变化事件
     */
    onPickerChange(e) {
      const value = e.detail.value;
      this.setData({
        'testData.pickerValue': value
      });
      
      wx.showToast({
        title: `选择了：${value}`,
        icon: 'none'
      });
    },
  
    /**
     * 日期选择器变化事件
     */
    onDateChange(e) {
      const date = e.detail.value;
      this.setData({
        'testData.dateValue': date
      });
      
      wx.showToast({
        title: `选择了日期：${date}`,
        icon: 'none'
      });
    },
  
    /**
     * 上传组件变化事件
     */
    onUploadChange(e) {
      const files = e.detail.files;
      this.setData({
        'testData.uploadFiles': files
      });
      
      console.log('上传文件发生变化', files);
    },
  
    /**
     * 上传组件删除事件
     */
    onUploadDelete(e) {
      const index = e.detail.index;
      
      console.log(`删除第${index + 1}个文件`);
      
      wx.showToast({
        title: `已删除文件${index + 1}`,
        icon: 'success'
      });
    },
  
    /**
     * 案件卡片点击事件
     */
    onCaseCardTap(e) {
      const caseId = e.detail.caseId;
      
      console.log(`案件卡片被点击：${caseId}`);
      
      wx.showToast({
        title: `点击了案件${caseId}`,
        icon: 'none'
      });
    },
  
    /**
     * 时间轴项目点击事件
     */
    onTimelineItemTap(e) {
      const itemId = e.detail.itemId;
      
      console.log(`时间轴项目被点击：${itemId}`);
      
      wx.showToast({
        title: `点击了时间轴项目${itemId}`,
        icon: 'none'
      });
    },
  
    /**
     * 文档列表项点击事件
     */
    onDocumentItemTap(e) {
      const docId = e.detail.docId;
      
      console.log(`文档列表项被点击：${docId}`);
      
      wx.showToast({
        title: `点击了文档${docId}`,
        icon: 'none'
      });
    },
  
    /**
     * 文档列表项删除事件
     */
    onDocumentDelete(e) {
      const docId = e.detail.docId;
      
      console.log(`文档列表项被删除：${docId}`);
      
      // 从列表中移除
      const documentList = this.data.testData.documentList.filter(item => item.id !== docId);
      this.setData({
        'testData.documentList': documentList
      });
      
      wx.showToast({
        title: '文档已删除',
        icon: 'success'
      });
    },
  
    /**
     * 测试加载组件
     */
    testLoading() {
      wx.showToast({
        title: '显示加载中...',
        icon: 'loading',
        duration: 2000
      });
    },
  
    /**
     * 测试空状态组件
     */
    testEmpty() {
      this.setData({
        'testData.caseList': [],
        'testData.documentList': []
      });
      
      wx.showToast({
        title: '已清空测试数据',
        icon: 'success'
      });
    },
  
    /**
     * 重置测试数据
     */
    resetTestData() {
      // 重新设置数据
      this.setData({
        currentCategory: 'basic',
        'testData': {
          buttonTypes: ['primary', 'success', 'warning', 'danger', 'info', 'default'],
          buttonSizes: ['large', 'medium', 'small'],
          buttonLoading: false,
          modalVisible: false,
          modalTitle: '测试标题',
          modalContent: '这是模态框的内容，用于展示一些重要信息或操作。',
          inputValue: '',
          inputError: false,
          pickerOptions: ['选项1', '选项2', '选项3', '选项4', '选项5'],
          pickerValue: '选项1',
          dateValue: this.getCurrentDate(),
          dateRange: ['2024-01-01', '2024-12-31'],
          uploadFiles: [],
          uploadMaxCount: 3,
          uploadMaxSize: 2 * 1024 * 1024,
          caseList: [
            {
              id: '1',
              caseNumber: 'C20240001',
              title: '张三诉李四合同纠纷案',
              status: 'pending',
              statusText: '待处理',
              createTime: '2024-01-15 10:30:00',
              updateTime: '2024-01-15 10:30:00',
              lawyer: '王律师',
              client: '张三',
              amount: 50000,
              tags: ['合同纠纷', '民事']
            },
            {
              id: '2',
              caseNumber: 'C20240002',
              title: '知识产权侵权案',
              status: 'processing',
              statusText: '处理中',
              createTime: '2024-01-14 14:20:00',
              updateTime: '2024-01-15 09:15:00',
              lawyer: '李律师',
              client: '创新科技公司',
              amount: 200000,
              tags: ['知识产权', '侵权']
            },
            {
              id: '3',
              caseNumber: 'C20240003',
              title: '劳动仲裁案',
              status: 'completed',
              statusText: '已完成',
              createTime: '2024-01-10 09:00:00',
              updateTime: '2024-01-12 16:45:00',
              lawyer: '赵律师',
              client: '李四',
              amount: 30000,
              tags: ['劳动法', '仲裁']
            }
          ],
          timelineItems: [
            {
              id: '1',
              title: '案件创建',
              time: '2024-01-15 10:30:00',
              description: '客户张三提交了案件信息',
              status: 'success',
              icon: 'checkbox'
            },
            {
              id: '2',
              title: '材料审核',
              time: '2024-01-15 11:15:00',
              description: '王律师开始审核案件材料',
              status: 'processing',
              icon: 'edit'
            },
            {
              id: '3',
              title: '方案制定',
              time: '2024-01-16 09:00:00',
              description: '正在制定解决方案',
              status: 'pending',
              icon: 'clock'
            },
            {
              id: '4',
              title: '结案',
              time: '待定',
              description: '等待案件处理完成',
              status: 'pending',
              icon: 'checkbox'
            }
          ],
          documentList: [
            {
              id: '1',
              name: '委托代理合同.pdf',
              size: 1250000,
              type: 'pdf',
              uploadTime: '2024-01-15 10:25:00',
              uploader: '张三',
              status: 'completed'
            },
            {
              id: '2',
              name: '证据材料.zip',
              size: 3500000,
              type: 'zip',
              uploadTime: '2024-01-15 10:30:00',
              uploader: '张三',
              status: 'completed'
            },
            {
              id: '3',
              name: '身份证明.jpg',
              size: 450000,
              type: 'image',
              uploadTime: '2024-01-15 10:32:00',
              uploader: '张三',
              status: 'uploading',
              progress: 60
            }
          ]
        }
      });
      
      wx.showToast({
        title: '测试数据已重置',
        icon: 'success'
      });
    },
  
    /**
     * 复制组件代码
     */
    copyComponentCode(e) {
      const componentId = e.currentTarget.dataset.id;
      const componentMap = {
        'button': '<lubao-button type="primary">主要按钮</lubao-button>',
        'modal': '<lubao-modal></lubao-modal>',
        'loading': '<lubao-loading></lubao-loading>',
        'empty': '<lubao-empty></lubao-empty>',
        'input': '<lubao-input placeholder="请输入"></lubao-input>',
        'picker': '<lubao-picker></lubao-picker>',
        'date-picker': '<lubao-date-picker></lubao-date-picker>',
        'upload': '<lubao-upload></lubao-upload>',
        'case-card': '<case-card></case-card>',
        'timeline': '<timeline></timeline>',
        'document-list': '<document-list></document-list>'
      };
      
      const code = componentMap[componentId] || '组件代码未找到';
      
      wx.setClipboardData({
        data: code,
        success: () => {
          wx.showToast({
            title: '代码已复制',
            icon: 'success'
          });
        }
      });
    },
  
    /**
     * 查看组件文档
     */
    viewComponentDoc(e) {
      const componentId = e.currentTarget.dataset.id;
      
      wx.showModal({
        title: '组件文档',
        content: `查看 ${componentId} 组件的详细使用文档？`,
        success: (res) => {
          if (res.confirm) {
            wx.showToast({
              title: '文档功能开发中',
              icon: 'none'
            });
          }
        }
      });
    },
  
    /**
     * 运行组件测试
     */
    runComponentTest(e) {
      const componentId = e.currentTarget.dataset.id;
      
      console.log(`开始测试组件：${componentId}`);
      
      wx.showLoading({
        title: '测试中...',
      });
      
      // 模拟测试过程
      setTimeout(() => {
        wx.hideLoading();
        wx.showToast({
          title: `组件 ${componentId} 测试完成`,
          icon: 'success',
          duration: 2000
        });
      }, 1500);
    },
  
    /**
     * 运行全部组件测试
     */
    testAllComponents() {
      wx.showLoading({
        title: '测试所有组件...',
      });
      
      // 模拟测试过程
      setTimeout(() => {
        wx.hideLoading();
        wx.showToast({
          title: '所有组件测试完成',
          icon: 'success',
          duration: 2000
        });
      }, 3000);
    }
  });