export default {
  pages: [
    'pages/index/index',
    'pages/project/project',
    'pages/detail/detail'
  ],
  tabBar: {
    'color': '#000',
    'selectedColor': '#56abe4',
    'backgroundColor': '#fff',
    'borderStyle': 'white',
    'list': [{
      'pagePath': 'pages/index/index',
      'text': '首页',
    },{
      'pagePath': "pages/project/project",
      'text': "项目",
    }]
  },
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  }
}
