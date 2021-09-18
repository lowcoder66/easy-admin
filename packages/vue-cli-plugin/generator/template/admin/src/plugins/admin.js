import Vue from "vue"
import EasyManage from "@lowcoder/easy-admin"

import resources from "../admin/resources"
import routes from "../admin/routes"
import router from "../router"

import i18n from "./i18n"
import store from "../store"

<%_ if (dataProvider === "custom") { _%>
import dataProvider from "../admin/providers/dataProvider";
<%_ } _%>
<%_ if (authProvider === "custom") { _%>
import authProvider from "../admin/providers/authProvider";
<%_ } _%>

import {
    <%_ if (dataProvider && dataProvider !== "custom") { _%>
    <%- dataProvider %>DataProvider,
    <%_ } _%>
    <%_ if (authProvider && authProvider !== "custom") { _%>
    <%- authProvider %>AuthProvider,
    <%_ } _%>
} from "@lowcoder/easy-admin/src/providers";
import { AxiosHttp } from "@lowcoder/easy-admin/src/providers";

Vue.use(EasyManage);

// http client
const baseURL = process.env.VUE_APP_EM_API_URL;
const http = new AxiosHttp({
    overrideOptions: {
        baseURL
    },
    store,
    router
})

export default new EasyManage({
    resources,
    store,
    i18n,
    router,
    routes,
    <%_ if (dataProvider) { _%>
    <%_ if (dataProvider === "custom") { _%>
    dataProvider: dataProvider(http),
    <%_ } else { _%>
    dataProvider: <%- dataProvider %>DataProvider(http),
    <%_ } _%>
    <%_ } _%>
    <%_ if (authProvider) { _%>
    <%_ if (authProvider === "custom") { _%>
    authProvider: authProvider(http),
    <%_ } else if(authProvider === "oauth2") { _%>
    authProvider: oauth2AuthProvider(http, {
        authServicePrefix: "<%- oauth2.authServicePrefix %>",
        userServicePrefix: "<%- oauth2.userServicePrefix %>",
        authClient: process.env.VUE_APP_EM_AUTH_CLIENT_ID || "auth-client",
    }),
    <%_ } else { _%>
    authProvider: <%- authProvider %>AuthProvider(
        <%_ if (authProvider !== "fake") { _%>
        http
        <%_ } _%>
    ),
    <%_ } _%>
    <%_ } _%>
})
