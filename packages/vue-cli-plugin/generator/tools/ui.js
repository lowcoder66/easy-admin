function invokeDependency(api, options) {
    const {ui} = options

    switch (ui) {
        case "vuetify":
            const vueCmd = `vue${process.platform === "win32" ? '.cmd' : ''}`
            require('child_process').spawnSync(
                vueCmd,
                [
                    'invoke',
                    'vue-cli-plugin-vuetify',
                    '--preset',
                    'default',
                ],
                {
                    stdio: 'inherit',
                    cwd: process.cwd()
                }
            )
            break;
        case "custom":
            api.render("../template/ui/custom", {
                authProvider
            })
            break;
    }
}
function render(api, options) {
    const {ui, authProvider} = options
    switch (ui) {
        case "vuetify":
            api.extendPackage({
                devDependencies: {
                    'vue-cli-plugin-vuetify': '^2.4.2'
                }
            })
            api.render("../template/ui/vuetify", {
                authProvider
            })
            break;
        case "custom":
            api.render("../template/ui/custom", {
                authProvider
            })
            break;
    }
}

module.exports = {
    render,
    invokeDependency,
}
