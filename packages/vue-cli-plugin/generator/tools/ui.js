const fs = require("fs")

function invokeDependency(api, options) {
  const { ui } = options
  const vueCmd = `vue${process.platform === "win32" ? ".cmd" : ""}`

  switch (ui) {
    case "vuetify":
      require("child_process").spawnSync(vueCmd, ["invoke", "vue-cli-plugin-vuetify", "--install", "default"], {
        stdio: "inherit",
        cwd: process.cwd(),
      })

      afterInvokeVuetify(api)
      break
    case "custom":
      break
  }
}

function afterInvokeVuetify(api) {
  // modify the src/App.vue
  const app = api.resolve("src/App.vue")
  let appContent = ""

  if (fs.existsSync(app)) {
    appContent = fs.readFileSync(app, { encoding: "utf8" })
  }
  // replace `<template>` content to `<router-view />`
  appContent = appContent.replace(
    new RegExp(/<template>.*<\/template>/gs),
    "<template>\n  <router-view />\n</template>"
  )

  fs.writeFileSync(app, appContent, { encoding: "utf8" })
}

function render(api, options) {
  const { ui, authProvider } = options
  switch (ui) {
    case "vuetify":
      api.extendPackage({
        devDependencies: {
          "vue-cli-plugin-vuetify": "^2.5.8",
        },
      })
      api.render("../template/ui/vuetify", {
        authProvider,
      })
      break
    case "custom":
      api.render("../template/ui/custom", {
        authProvider,
      })
      break
  }
}

module.exports = {
  render,
  invokeDependency,
}
