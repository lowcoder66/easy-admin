import Vue from "vue";
import camelCase from "lodash/camelCase";
import upperFirst from "lodash/upperFirst";

// guessers
try {
    const requireGuessersComponent = require.context("@/admin/components/guessers", true, /\.vue$/);
    requireGuessersComponent.keys().forEach(fileName => {
        const componentConfig = requireGuessersComponent(fileName);

        const componentName = fileName
            .replace(/^\.\//, "")
            .replace(/\//, "")
            .replace(/\.\w+$/, "");

        Vue.component(`Ea${upperFirst(camelCase(componentName))}Guesser`, componentConfig.default || componentConfig)
    })

// ui
    const requireUIComponent = require.context("@/admin/components/ui/inputs", true, /\.vue$/);
    requireUIComponent.keys().forEach(fileName => {
        const componentConfig = requireUIComponent(fileName);

        const componentName = fileName
            .replace(/^\.\//, "")
            .replace(/\//, "")
            .replace(/\.\w+$/, "");

        Vue.component(`Ea${upperFirst(camelCase(componentName))}`, componentConfig.default || componentConfig)
    })

// resources
    const requireResourcesComponent = require.context("@/admin/components/resources", true, /\.vue$/);
    requireResourcesComponent.keys().forEach((fileName) => {
        const componentConfig = requireResourcesComponent(fileName);

        const componentName = fileName
            .replace(/^\.\//, "")
            .replace(/\//, "")
            .replace(/\.\w+$/, "");

        Vue.component(upperFirst(camelCase(componentName)), componentConfig.default || componentConfig);
    });
} catch (e) {

}


