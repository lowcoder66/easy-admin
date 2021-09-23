module.exports = {
  transpileDependencies: ["vuetify"],

  publicPath: process.env.NODE_ENV === "development" ? "/" : "./",

  devServer: {
    proxy: {
      "/api": {
        target: process.env.VUE_APP_EM_API_URL || "http://localhost:18080",
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
        "@": require("path").resolve("src"),
      },
    },
  },
}
