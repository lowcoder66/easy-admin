const uiTool = require("./ui")
function addImports(api) {
  api.injectImports(api.entryFile, "import store from './store'")
  api.injectRootOptions(api.entryFile, "store")

  api.injectImports(api.entryFile, "import i18n from './plugins/i18n'")
  api.injectRootOptions(api.entryFile, "i18n")

  api.injectImports(api.entryFile, "import router from './router'")
  api.injectRootOptions(api.entryFile, "router")

  api.injectImports(api.entryFile, "import admin from './plugins/admin'")
  api.injectRootOptions(api.entryFile, "admin")
}

function extendPackage(api) {
  api.extendPackage({
    scripts: {
      build: "vue-cli-service build --mode prod",
      "build-test": "vue-cli-service build --mode test",
    },
    dependencies: {
      moment: "^2.29.1",
      vue: "^2.6.14",
      vuex: "^3.6.2",
      "vue-i18n": "^8.25.1",
      "vue-router": "^3.5.2",
      axios: "^0.21.4",
      "@lowcoder66/easy-admin": "^0.0.7",
    },
    devDependencies: {
      webpack: "^5.52.1",
    },
  })
}

function processTemplates(api, options) {
  const { dataProvider, authProvider } = options

  api.render("../template/admin", options)

  if (dataProvider === "custom") {
    /**
     * Custom provider base code
     */
    api.render("../template/providers/data")
  }
  if (authProvider === "custom") {
    /**
     * Custom provider base code
     */
    api.render("../template/providers/auth")
  }

  // ui
  uiTool.render(api, options)
}
function addVueConfig(api) {
  api.extendPackage({
    vue: {
      publicPath: api.makeJSOnlyValue(`process.env.NODE_ENV === 'development' ? '/' : './'`),
      devServer: {
        proxy: {
          "/api": {
            target: api.makeJSOnlyValue(`process.env.VUE_APP_EM_API_URL || 'http://localhost:18080'`),
            changeOrigin: true,
            pathRewrite: {
              "^/api": "/",
            },
          },
        },
      },
      configureWebpack: {
        resolve: {
          extensions: [".js", ".vue", ".json"],
          alias: {
            "@": api.makeJSOnlyValue(`require('path').resolve('src')`),
          },
        },
      },
    },
  })
}
module.exports = {
  addImports,
  extendPackage,
  processTemplates,
  invokeDependency: uiTool.invokeDependency,
  addVueConfig,
}
