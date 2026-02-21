// scripts/check-components.js
const fs = require('fs');
const path = require('path');

console.log('🔍 开始检查组件状态...\n');

// 检查的组件列表
const components = [
  { name: 'nav-bar', path: '/common/components/basic/nav-bar/nav-bar' },
  { name: 'button', path: '/common/components/basic/button/button' },
  { name: 'modal', path: '/common/components/basic/modal/modal' },
  { name: 'loading', path: '/common/components/basic/loading/loading' },
  { name: 'empty', path: '/common/components/basic/empty/empty' },
  { name: 'input', path: '/common/components/form/input/input' },
  { name: 'picker', path: '/common/components/form/picker/picker' },
  { name: 'date-picker', path: '/common/components/form/date-picker/date-picker' },
  { name: 'upload', path: '/common/components/form/upload/upload' },
  { name: 'case-card', path: '/common/components/business/case-card/case-card' },
  { name: 'timeline', path: '/common/components/business/timeline/timeline' },
  { name: 'document-list', path: '/common/components/business/document-list/document-list' }
];

// 检查每个组件
components.forEach(component => {
  // 获取相对路径
  const relativePath = component.path.replace(/^\//, '');
  const fullPath = path.join(__dirname, '..', relativePath);
  
  console.log(`📁 检查组件: ${component.name}`);
  console.log(`   配置路径: ${component.path}`);
  console.log(`   实际路径: ${relativePath}`);
  
  // 检查文件是否存在
  const files = [
    { ext: '.js', file: `${fullPath}.js` },
    { ext: '.json', file: `${fullPath}.json` },
    { ext: '.wxml', file: `${fullPath}.wxml` },
    { ext: '.wxss', file: `${fullPath}.wxss` }
  ];
  
  let allExists = true;
  files.forEach(fileInfo => {
    const exists = fs.existsSync(fileInfo.file);
    console.log(`   ${fileInfo.ext}: ${exists ? '✅' : '❌'}`);
    if (!exists) allExists = false;
  });
  
  // 检查json配置
  if (fs.existsSync(`${fullPath}.json`)) {
    try {
      const jsonContent = JSON.parse(fs.readFileSync(`${fullPath}.json`, 'utf8'));
      const hasComponentFlag = jsonContent.component === true;
      console.log(`   component: true: ${hasComponentFlag ? '✅' : '❌'}`);
      
      if (!hasComponentFlag) {
        console.log(`   ⚠️  组件 ${component.name} 的json文件中缺少 "component": true`);
      }
    } catch (e) {
      console.log(`   ⚠️  无法解析JSON文件: ${e.message}`);
    }
  }
  
  console.log('');
});

// 检查测试页面配置
console.log('🔧 检查测试页面配置...');
const testPagePath = path.join(__dirname, '../pages/test-components/index.json');
if (fs.existsSync(testPagePath)) {
  try {
    const testConfig = JSON.parse(fs.readFileSync(testPagePath, 'utf8'));
    console.log(`✅ 测试页面配置存在`);
    console.log(`   包含 ${Object.keys(testConfig.usingComponents || {}).length} 个组件`);
    
    // 检查配置的组件路径
    if (testConfig.usingComponents) {
      Object.entries(testConfig.usingComponents).forEach(([name, compPath]) => {
        const fullCompPath = path.join(__dirname, '..', compPath.replace(/^\//, ''));
        const exists = fs.existsSync(`${fullCompPath}.json`);
        console.log(`   ${name}: ${compPath} ${exists ? '✅' : '❌'}`);
      });
    }
  } catch (e) {
    console.log(`❌ 无法读取测试页面配置: ${e.message}`);
  }
} else {
  console.log(`❌ 测试页面配置不存在: ${testPagePath}`);
}