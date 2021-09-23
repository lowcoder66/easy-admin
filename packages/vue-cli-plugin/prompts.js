module.exports = [
  {
    type: "input",
    name: "api",
    message: "输入API端点：",
    default: "http://localhost:8080",
  },
  {
    type: "list",
    name: "ui",
    message: "选择一个UI：",
    default: "vuetify",
    choices: [
      {
        name: "Vuetify",
        value: "vuetify",
      },
      {
        name: "不使用已有UI，自己实现",
        value: "custom",
      },
    ],
  },
  {
    type: "list",
    name: "dataProvider",
    message: "选择一个数据提供者：",
    default: false,
    choices: [
      {
        name: "无 （没有数据交互）",
        value: false,
      },
      {
        name: "Spring MVC REST API",
        value: "spring",
      },
      {
        name: "不使用已有数据提供者，自己实现",
        value: "custom",
      },
    ],
  },
  {
    type: "list",
    name: "authProvider",
    message: "选择一个认证提供者：",
    default: false,
    choices: [
      {
        name: "无（不需要登录）",
        value: false,
      },
      {
        name: "OAuth2 (Spring Cloud OAuth2)",
        value: "oauth2",
      },
      {
        name: "Fake local authentication (no need of API server)",
        value: "fake",
      },
      {
        name: "不使用已有认证提供者，自己实现",
        value: "custom",
      },
    ],
  },
  {
    type: "input",
    name: "oauth2.authClient",
    message: "[OAuth2]输入认证客户端（client id）：",
    when: (input) => input.authProvider === "oauth2",
  },
  {
    type: "input",
    name: "oauth2.authServicePrefix",
    message: "[OAuth2]输入认证服务前缀：",
    when: (input) => input.authProvider === "oauth2",
  },
  {
    type: "input",
    name: "oauth2.userServicePrefix",
    message: "[OAuth2]输入用户服务前缀：",
    when: (input) => input.authProvider === "oauth2",
  },
]
