// scripts/test-components.js
const fs = require('fs');
const path = require('path');

/**
 * 检查所有组件是否可用
 */
function checkAllComponents() {
  console.log('🔍 开始检查组件可用性...\n');
  
  // 组件列表
  const components = [
    // 基础组件
    { name: 'nav-bar', path: 'basic/nav-bar/nav-bar' },
    { name: 'button', path: 'basic/button/button' },
    { name: 'modal', path: 'basic/modal/modal' },
    { name: 'loading', path: 'basic/loading/loading' },
    { name: 'empty', path: 'basic/empty/empty' },
    
    // 表单组件
    { name: 'input', path: 'form/input/input' },
    { name: 'picker', path: 'form/picker/picker' },
    { name: 'date-picker', path: 'form/date-picker/date-picker' },
    { name: 'upload', path: 'form/upload/upload' },
    
    // 业务组件
    { name: 'case-card', path: 'business/case-card/case-card' },
    { name: 'timeline', path: 'business/timeline/timeline' },
    { name: 'document-list', path: 'business/document-list/document-list' }
  ];
  
  let allPassed = true;
  
  components.forEach(component => {
    const fullPath = path.join('common/components', component.path);
    const files = [
      `${fullPath}.js`,
      `${fullPath}.json`,
      `${fullPath}.wxml`,
      `${fullPath}.wxss`
    ];
    
    const missingFiles = files.filter(file => !fs.existsSync(file));
    
    if (missingFiles.length === 0) {
      console.log(`✅ ${component.name} 组件完整`);
    } else {
      console.log(`❌ ${component.name} 组件缺失文件:`);
      missingFiles.forEach(file => {
        console.log(`   - ${file}`);
      });
      allPassed = false;
    }
  });
  
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('🎉 所有组件检查通过！可以访问测试页面');
    console.log('👉 访问路径: pages/test-components/index');
  } else {
    console.log('⚠️  部分组件存在问题，请先修复');
  }
  
  return allPassed;
}

/**
 * 启动测试页面
 */
function startTestPage() {
  const testPagePath = 'pages/test-components/index';
  const files = ['.js', '.json', '.wxml', '.wxss'];
  
  console.log('\n🔧 检查测试页面...');
  
  const missingFiles = files.filter(ext => {
    return !fs.existsSync(`${testPagePath}${ext}`);
  });
  
  if (missingFiles.length === 0) {
    console.log('✅ 测试页面文件完整');
    console.log('\n🚀 现在可以通过以下方式访问测试页面:');
    console.log('1. 打开微信开发者工具');
    console.log('2. 选择 pages/test-components/index 页面');
    console.log('3. 点击编译运行');
  } else {
    console.log('❌ 测试页面缺失以下文件:');
    missingFiles.forEach(file => {
      console.log(`   - ${testPagePath}${file}`);
    });
  }
}

// 运行检查
checkAllComponents();
startTestPage();