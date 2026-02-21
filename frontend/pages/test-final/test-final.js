// pages/test-final/test-final.js
Page({
    data: {
      logs: [],
      testResults: {},
      running: false,
      // 测试进度
      progress: {
        total: 0,
        completed: 0,
        passed: 0,
        failed: 0
      }
    },
  
    onLoad: function() {
      this.log('页面加载完成');
      this.initTestResults();
    },
  
    // 初始化测试结果
    initTestResults: function() {
      const testResults = {
        // 基础功能测试
        tool_import: { name: '工具函数导入', status: 'pending' },
        storage_basic: { name: '本地存储基础', status: 'pending' },
        storage_expire: { name: '存储过期时间', status: 'pending' },
        validate_phone: { name: '手机号验证', status: 'pending' },
        validate_email: { name: '邮箱验证', status: 'pending' },
        date_format: { name: '日期格式化', status: 'pending' },
        date_calculation: { name: '日期计算', status: 'pending' },
        constants_access: { name: '常量访问', status: 'pending' },
        constants_mapping: { name: '常量映射', status: 'pending' },
        router_functions: { name: '路由函数检查', status: 'pending' },
        
        // 网络请求（使用模拟）
        request_simulate: { name: '网络请求模拟', status: 'pending' },
        
        // 可选工具
        cache_basic: { name: '缓存基础', status: 'pending' },
        debounce_check: { name: '防抖节流检查', status: 'pending' }
      };
      
      this.setData({ 
        testResults,
        progress: {
          total: Object.keys(testResults).length,
          completed: 0,
          passed: 0,
          failed: 0
        }
      });
    },
  
    // 添加日志
    log: function(message, type) {
      const logs = this.data.logs;
      const time = new Date().toLocaleTimeString();
      
      logs.unshift({
        time: time,
        message: message,
        type: type || 'info'
      });
      
      this.setData({ logs: logs.slice(0, 50) });
      console.log(`[${type || 'info'}] ${message}`);
    },
  
    // 更新测试结果
    updateTestResult: function(testId, status, message) {
      const testResults = { ...this.data.testResults };
      const progress = { ...this.data.progress };
      
      // 更新测试状态
      testResults[testId].status = status;
      testResults[testId].message = message || '';
      
      // 更新进度
      progress.completed++;
      if (status === 'passed') {
        progress.passed++;
      } else if (status === 'failed') {
        progress.failed++;
      }
      
      this.setData({ testResults, progress });
    },
  
    // 运行单个测试
    runTest: async function(testId, testFunc) {
      this.log(`开始测试: ${testId}`, 'info');
      
      try {
        await testFunc.call(this);
        this.updateTestResult(testId, 'passed');
        this.log(`✅ ${testId}: 测试通过`, 'success');
      } catch (error) {
        const errorMsg = error.message || String(error);
        this.updateTestResult(testId, 'failed', errorMsg);
        this.log(`❌ ${testId}: ${errorMsg}`, 'error');
      }
    },
  
    // 运行所有测试
    runAllTests: async function() {
      if (this.data.running) return;
      
      this.setData({ running: true });
      this.log('开始运行所有测试...', 'info');
      
      // 重置测试结果
      this.initTestResults();
      
      // 定义测试任务
      const testTasks = [
        { id: 'tool_import', func: this.testToolImport },
        { id: 'storage_basic', func: this.testStorageBasic },
        { id: 'storage_expire', func: this.testStorageExpire },
        { id: 'validate_phone', func: this.testValidatePhone },
        { id: 'validate_email', func: this.testValidateEmail },
        { id: 'date_format', func: this.testDateFormat },
        { id: 'date_calculation', func: this.testDateCalculation },
        { id: 'constants_access', func: this.testConstantsAccess },
        { id: 'constants_mapping', func: this.testConstantsMapping },
        { id: 'router_functions', func: this.testRouterFunctions },
        { id: 'request_simulate', func: this.testRequestSimulate },
        { id: 'cache_basic', func: this.testCacheBasic },
        { id: 'debounce_check', func: this.testDebounceCheck }
      ];
      
      // 依次运行测试
      for (const task of testTasks) {
        await this.runTest(task.id, task.func);
        await this.delay(300); // 延迟300ms，避免太快
      }
      
      this.setData({ running: false });
      this.log('所有测试完成', 'info');
      this.showSummary();
    },
  
    // 延迟函数
    delay: function(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },
  
    /**********************************************************************
     * 具体的测试函数
     **********************************************************************/
  
    // 测试1：工具函数导入
    testToolImport: function() {
      this.log('检查工具函数导入...');
      
      // 检查各个工具文件
      const tools = [
        { name: 'request', path: '../../common/utils/request.js' },
        { name: 'storage', path: '../../common/utils/storage.js' },
        { name: 'validate', path: '../../common/utils/validate.js' },
        { name: 'date', path: '../../common/utils/date.js' },
        { name: 'constants', path: '../../common/utils/constants.js' },
        { name: 'router', path: '../../common/utils/router.js' },
        { name: 'cache', path: '../../common/utils/cache.js' },
        { name: 'debounce', path: '../../common/utils/debounce.js' }
      ];
      
      tools.forEach(tool => {
        try {
          const module = require(tool.path);
          if (!module || !module.default) {
            throw new Error(`${tool.name}.js 缺少默认导出`);
          }
          this.log(`✅ ${tool.name}.js 导入成功`, 'success');
        } catch (error) {
          throw new Error(`${tool.name}.js 导入失败: ${error.message}`);
        }
      });
      
      // 检查 index.js
      try {
        const utils = require('../../common/utils/index.js');
        if (!utils.default) {
          throw new Error('index.js 缺少默认导出');
        }
        this.log('✅ index.js 导入成功', 'success');
      } catch (error) {
        throw new Error(`index.js 导入失败: ${error.message}`);
      }
    },
  
    // 测试2：本地存储基础
    testStorageBasic: function() {
      this.log('测试本地存储基础功能...');
      
      // 获取 storage 模块
      const storage = require('../../common/utils/storage.js').default;
      
      if (!storage || typeof storage.set !== 'function') {
        throw new Error('storage.set 不是函数');
      }
      
      // 测试设置
      const testKey = 'test_basic_key';
      const testValue = { name: '测试', time: Date.now() };
      
      const setResult = storage.set(testKey, testValue);
      if (!setResult) {
        throw new Error('storage.set 失败');
      }
      
      // 测试读取
      const getResult = storage.get(testKey);
      if (!getResult || getResult.name !== testValue.name) {
        throw new Error('storage.get 读取失败');
      }
      
      // 测试删除
      const removeResult = storage.remove(testKey);
      if (!removeResult) {
        throw new Error('storage.remove 失败');
      }
      
      // 验证删除
      const afterDelete = storage.get(testKey);
      if (afterDelete !== null) {
        throw new Error('删除后仍然能读取到数据');
      }
      
      this.log('本地存储基础功能正常', 'success');
    },
  
    // 测试3：存储过期时间
    testStorageExpire: function() {
      this.log('测试存储过期时间...');
      
      return new Promise((resolve, reject) => {
        const storage = require('../../common/utils/storage.js').default;
        const testKey = 'test_expire_key';
        const testValue = '过期测试数据';
        
        // 设置1秒后过期
        const setResult = storage.set(testKey, testValue, 1);
        if (!setResult) {
          reject(new Error('设置过期存储失败'));
          return;
        }
        
        // 立即读取应该能读到
        const immediateRead = storage.get(testKey);
        if (immediateRead !== testValue) {
          reject(new Error('立即读取失败'));
          return;
        }
        
        // 等待1.5秒后数据应该过期
        setTimeout(() => {
          const afterExpire = storage.get(testKey);
          if (afterExpire !== null) {
            reject(new Error('过期后仍然能读取到数据'));
            return;
          }
          
          this.log('存储过期时间功能正常', 'success');
          resolve();
        }, 1500);
      });
    },
  
    // 测试4：手机号验证
    testValidatePhone: function() {
      this.log('测试手机号验证...');
      
      const validate = require('../../common/utils/validate.js').default;
      
      if (!validate || typeof validate.phone !== 'function') {
        throw new Error('validate.phone 不是函数');
      }
      
      // 测试有效手机号
      const validPhones = ['13800138000', '13912345678', '18888888888'];
      validPhones.forEach(phone => {
        if (!validate.phone(phone)) {
          throw new Error(`有效手机号验证失败: ${phone}`);
        }
      });
      
      // 测试无效手机号
      const invalidPhones = ['12345678901', '1380013800', 'abc12345678'];
      invalidPhones.forEach(phone => {
        if (validate.phone(phone)) {
          throw new Error(`无效手机号验证通过: ${phone}`);
        }
      });
      
      this.log('手机号验证功能正常', 'success');
    },
  
    // 测试5：邮箱验证
    testValidateEmail: function() {
      this.log('测试邮箱验证...');
      
      const validate = require('../../common/utils/validate.js').default;
      
      if (!validate || typeof validate.email !== 'function') {
        throw new Error('validate.email 不是函数');
      }
      
      // 测试有效邮箱
      const validEmails = ['test@example.com', 'user.name@domain.co.uk'];
      validEmails.forEach(email => {
        if (!validate.email(email)) {
          throw new Error(`有效邮箱验证失败: ${email}`);
        }
      });
      
      // 测试无效邮箱
      const invalidEmails = ['invalid-email', 'user@', '@domain.com'];
      invalidEmails.forEach(email => {
        if (validate.email(email)) {
          throw new Error(`无效邮箱验证通过: ${email}`);
        }
      });
      
      this.log('邮箱验证功能正常', 'success');
    },
  
    // 测试6：日期格式化
    testDateFormat: function() {
      this.log('测试日期格式化...');
      
      const date = require('../../common/utils/date.js').default;
      
      if (!date || typeof date.format !== 'function') {
        throw new Error('date.format 不是函数');
      }
      
      const testDate = new Date('2024-01-15T14:30:45');
      const result = date.format(testDate, 'YYYY-MM-DD HH:mm:ss');
      
      if (result !== '2024-01-15 14:30:45') {
        throw new Error(`日期格式化错误: ${result}`);
      }
      
      this.log('日期格式化功能正常', 'success');
    },
  
    // 测试7：日期计算
    testDateCalculation: function() {
      this.log('测试日期计算...');
      
      const date = require('../../common/utils/date.js').default;
      
      if (!date || typeof date.addDays !== 'function') {
        throw new Error('date.addDays 不是函数');
      }
      
      const baseDate = new Date('2024-01-15');
      const result = date.addDays(baseDate, 5);
      const expected = new Date('2024-01-20');
      
      if (result.getTime() !== expected.getTime()) {
        throw new Error('日期计算错误');
      }
      
      this.log('日期计算功能正常', 'success');
    },
  
    // 测试8：常量访问
    testConstantsAccess: function() {
      this.log('测试常量访问...');
      
      const constants = require('../../common/utils/constants.js').default;
      
      if (!constants) {
        throw new Error('constants 导入失败');
      }
      
      // 检查必要的常量
      if (!constants.APP_CONFIG) {
        throw new Error('APP_CONFIG 不存在');
      }
      
      if (!constants.USER_ROLES) {
        throw new Error('USER_ROLES 不存在');
      }
      
      if (!constants.CASE_STATUS) {
        throw new Error('CASE_STATUS 不存在');
      }
      
      this.log('常量访问功能正常', 'success');
    },
  
    // 测试9：常量映射
    testConstantsMapping: function() {
      this.log('测试常量映射...');
      
      const constants = require('../../common/utils/constants.js').default;
      
      if (!constants || !constants.CASE_STATUS || !constants.CASE_STATUS_MAP) {
        throw new Error('常量映射数据不存在');
      }
      
      const pendingStatus = constants.CASE_STATUS.PENDING;
      const pendingChinese = constants.CASE_STATUS_MAP[pendingStatus];
      
      if (pendingChinese !== '待处理') {
        throw new Error(`状态映射错误: ${pendingStatus} => ${pendingChinese}`);
      }
      
      this.log('常量映射功能正常', 'success');
    },
  
    // 测试10：路由函数检查
    testRouterFunctions: function() {
      this.log('测试路由函数...');
      
      const router = require('../../common/utils/router.js').default;
      
      if (!router) {
        throw new Error('router 导入失败');
      }
      
      // 检查必要的函数
      if (typeof router.to !== 'function') {
        throw new Error('router.to 不是函数');
      }
      
      if (typeof router.back !== 'function') {
        throw new Error('router.back 不是函数');
      }
      
      if (typeof router.getCurrentPage !== 'function') {
        throw new Error('router.getCurrentPage 不是函数');
      }
      
      this.log('路由函数正常', 'success');
    },
  
    // 测试11：网络请求模拟
    testRequestSimulate: function() {
      this.log('测试网络请求模拟...');
      
      const request = require('../../common/utils/request.js').default;
      
      if (!request) {
        throw new Error('request 导入失败');
      }
      
      // 检查必要的函数
      if (typeof request.get !== 'function') {
        throw new Error('request.get 不是函数');
      }
      
      if (typeof request.post !== 'function') {
        throw new Error('request.post 不是函数');
      }
      
      // 由于域名限制，我们只检查函数是否存在
      this.log('网络请求函数正常（由于域名限制，实际请求需要配置合法域名）', 'success');
    },
  
    // 测试12：缓存基础
    testCacheBasic: function() {
      this.log('测试缓存基础...');
      
      try {
        const cache = require('../../common/utils/cache.js').default;
        
        if (!cache) {
          throw new Error('cache 导入失败');
        }
        
        if (typeof cache.set !== 'function') {
          throw new Error('cache.set 不是函数');
        }
        
        if (typeof cache.get !== 'function') {
          throw new Error('cache.get 不是函数');
        }
        
        this.log('缓存函数正常', 'success');
      } catch (error) {
        // 如果缓存模块不存在，跳过测试
        this.updateTestResult('cache_basic', 'skipped', '缓存模块未启用');
        throw new Error('缓存模块未启用或导入失败');
      }
    },
  
    // 测试13：防抖节流检查
    testDebounceCheck: function() {
      this.log('测试防抖节流...');
      
      try {
        const debounce = require('../../common/utils/debounce.js').default;
        
        if (!debounce) {
          throw new Error('debounce 导入失败');
        }
        
        if (typeof debounce.debounce !== 'function') {
          throw new Error('debounce.debounce 不是函数');
        }
        
        this.log('防抖节流函数正常', 'success');
      } catch (error) {
        // 如果防抖模块不存在，跳过测试
        this.updateTestResult('debounce_check', 'skipped', '防抖节流模块未启用');
        throw new Error('防抖节流模块未启用或导入失败');
      }
    },
  
    /**********************************************************************
     * 工具函数
     **********************************************************************/
  
    // 显示测试摘要
    showSummary: function() {
      const progress = this.data.progress;
      const passRate = progress.total > 0 ? 
        Math.round((progress.passed / progress.total) * 100) : 0;
      
      let summary = `测试完成！\n\n`;
      summary += `📊 测试统计：\n`;
      summary += `   总测试数: ${progress.total}\n`;
      summary += `   完成数: ${progress.completed}\n`;
      summary += `   通过数: ${progress.passed}\n`;
      summary += `   失败数: ${progress.failed}\n`;
      summary += `   通过率: ${passRate}%\n\n`;
      
      // 收集失败的测试
      const failedTests = [];
      Object.entries(this.data.testResults).forEach(([id, result]) => {
        if (result.status === 'failed') {
          failedTests.push({ id, ...result });
        }
      });
      
      if (failedTests.length > 0) {
        summary += `⚠️ 失败测试：\n`;
        failedTests.forEach(test => {
          summary += `   ${test.name}: ${test.message}\n`;
        });
      }
      
      wx.showModal({
        title: '测试结果',
        content: summary,
        showCancel: false,
        confirmText: '好的'
      });
    },
  
    // 导出测试报告
    exportReport: function() {
      const progress = this.data.progress;
      const testResults = this.data.testResults;
      const logs = this.data.logs;
      
      let report = '='.repeat(60) + '\n';
      report += '📋 工具函数测试报告\n';
      report += '='.repeat(60) + '\n\n';
      
      report += '📅 测试时间: ' + new Date().toLocaleString() + '\n';
      report += '📊 测试统计: ' + progress.passed + '通过 / ' + 
                progress.failed + '失败 / ' + 
                progress.total + '总数\n\n';
      
      report += '🧪 测试结果详情:\n';
      Object.entries(testResults).forEach(([id, result]) => {
        const statusIcon = {
          'passed': '✅',
          'failed': '❌',
          'pending': '⏸️',
          'skipped': '⏭️'
        }[result.status] || '❓';
        
        report += `   ${statusIcon} ${result.name}: ${result.status}`;
        if (result.message) {
          report += ` (${result.message})`;
        }
        report += '\n';
      });
      
      report += '\n📝 执行日志:\n';
      logs.slice().reverse().forEach(log => {
        const typeIcon = {
          'info': 'ℹ️',
          'success': '✅',
          'warning': '⚠️',
          'error': '❌'
        }[log.type] || '📝';
        
        report += `   ${typeIcon} [${log.time}] ${log.message}\n`;
      });
      
      report += '\n' + '='.repeat(60) + '\n';
      
      // 复制到剪贴板
      wx.setClipboardData({
        data: report,
        success: () => {
          wx.showToast({
            title: '报告已复制',
            icon: 'success'
          });
          
          // 同时在控制台输出
          console.log('📋 测试报告已复制到剪贴板');
          console.log(report);
        },
        fail: (err) => {
          wx.showToast({
            title: '复制失败',
            icon: 'error'
          });
          this.log('导出失败: ' + err.errMsg, 'error');
        }
      });
    },
  
    // 清空日志
    clearLogs: function() {
      this.setData({ logs: [] });
      this.log('日志已清空', 'info');
    }
  });