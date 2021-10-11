import Vue from "vue"
import EasyManage from "@lowcoder/easy-admin"

import resources from "../admin/resources"
import routes from "../admin/routes"
import router from "../router"

import i18n from "./i18n"
import store from "../store"

import { springDataProvider, oauth2AuthProvider } from "@lowcoder/easy-admin/src/providers"
import { AxiosHttp } from "@lowcoder/easy-admin/src/providers"

Vue.use(EasyManage)

// http client
const baseURL = process.env.NODE_ENV === "development" ? "/api" : process.env.VUE_APP_EM_API_URL
const http = new AxiosHttp({
  overrideOptions: {
    baseURL,
  },
  store,
  router,
})

export default new EasyManage({
  resources,
  store,
  i18n,
  router,
  routes,
  dataProvider: springDataProvider(http),
  authProvider: oauth2AuthProvider(http, {
    authServicePrefix: "/uac",
    userServicePrefix: "/org/management",
    authClient: process.env.VUE_APP_EM_AUTH_CLIENT_ID || "auth-client",
  }),
  options: {
    defaultActionDisplayMode: "page", // dialog drawer page
  },
})
