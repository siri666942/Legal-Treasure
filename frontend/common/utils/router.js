/**
 * 按当前角色跳转首页（与 app.js goToHomePage 配套）
 */
function goToHomeByRole() {
  const app = getApp();
  const role = app.globalData.userRole || (app.globalData.userInfo && app.globalData.userInfo.role);
  if (role === 'lawyer') {
    wx.reLaunch({ url: '/subpackages/lawyer/pages/index/index' });
  } else {
    wx.reLaunch({ url: '/subpackages/client/pages/index/index' });
  }
}

module.exports = {
  goToHomeByRole
};
