import EasyAdmin from "./admin"
import Vue from "vue"
import "./loader/components"

export default EasyAdmin;

EasyAdmin.install = () => {
    /**
     * Inject global conf
     */
    Vue.mixin({
        beforeCreate() {
            this.$admin = this.$root.$options["admin"];
        },
    });

};
