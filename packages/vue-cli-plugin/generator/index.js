module.exports = (api, options) => {
  const admin = require("./tools/admin")
  const fs = require("fs")

  // add imports
  admin.addImports(api)

  // extend package
  admin.extendPackage(api)

  // vue config
  admin.addVueConfig(api)

  // invoke dependency ui framework
  admin.invokeDependency(api, options)

  // process templates
  admin.processTemplates(api, options)

  api.onCreateComplete(() => {
    ;[
      "src/assets/logo.png",
      "src/components/HelloWorld.vue",
      "src/components/HelloI18n.vue",
      "src/views/Home.vue",
      "src/views/About.vue",
    ].forEach((file) => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file)
      }
    })

    api.exitLog("Project Homepage : https://github.com/lowcoder66/easy-admin.git")
  })
}
