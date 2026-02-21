// scripts/fix-wxss-comments.js
const fs = require('fs');
const path = require('path');

function fixWXSSComments(filePath) {
  if (!fs.existsSync(filePath)) return false;
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 替换 // 注释为 /* ... */
  let fixedContent = content.replace(/^\s*\/\/\s*(.*)$/gm, (match, comment) => {
    return `/* ${comment.trim()} */`;
  });
  
  // 如果内容有变化，保存文件
  if (fixedContent !== content) {
    fs.writeFileSync(filePath, fixedContent, 'utf8');
    return true;
  }
  
  return false;
}

// 扫描并修复所有 WXSS 文件
function scanAndFixWXSSFiles(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let fixedCount = 0;
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      fixedCount += scanAndFixWXSSFiles(fullPath);
    } else if (file.name.endsWith('.wxss')) {
      if (fixWXSSComments(fullPath)) {
        console.log(`✅ 修复: ${fullPath}`);
        fixedCount++;
      }
    }
  });
  
  return fixedCount;
}

// 从项目根目录开始
const projectRoot = process.cwd();
const fixed = scanAndFixWXSSFiles(projectRoot);

console.log(`\n🎉 修复完成，共修复 ${fixed} 个文件`);