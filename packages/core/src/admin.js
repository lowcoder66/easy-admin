import storeAppModule from "./store/app"
import {
  actionLink,
  completeResourcesObject,
  getActionTitle,
  getResourceTitle,
  hasActionPermission,
  resourceNavItems,
  resourceRoutes,
} from "./resources"
import resourceCrudModule from "./store/resource"
import authStore from "./store/auth"
import guestStore from "./store/guest"
import { snakeCase, startCase, upperFirst } from "lodash/string"
import { zh } from "./locales"

const defaultOptions = {
  title: "Easy Admin",

  defaultActionDisplayMode: "dialog", // dialog drawer page
  defaultTreeActionDisplayMode: "dialog", // dialog drawer page
  defaultResourceIcon: "mdi-view-grid", //
  defaultActionPermissionEvaluator: function () {
    // args: userPermissions, resource, action
    return true
  },
  defaultPermissionEvaluator: function (userPermissions, actionPermissions) {
    return actionPermissions.every((p) => userPermissions.includes(p))
  },
  defaultActions: ["create", "delete", "update", "retrieve", "show"],
  enableOperateAction: true,
  defaultIdKey: "id",
  defaultPerPage: 10,
  defaultItemLabelKey: "name",
  refreshItemBeforeClickAction: true,
  dateFormat: "YYYY-MM-DD",
  timeFormat: "HH:mm:ss",
  dateTimeFormat: "YYYY-MM-DD HH:mm:ss",
}

export default class EasyAdmin {
  constructor({ resources, store, authProvider, dataProvider, i18n, locales, router, routes = [], options }) {
    this.options = Object.assign({}, defaultOptions, options)
    this.authProvider = authProvider
    this.dataProvider = dataProvider
    this.store = store
    this.i18n = i18n
    this.locales = locales
    this.router = router
    //this.routes = routes
    this.resources = completeResourcesObject(resources, this)

    // i18n
    i18n.mergeLocaleMessage("zh", { ea: zh })
    if (this.locales) {
      Object.keys(this.locales).forEach((locale) => {
        i18n.mergeLocaleMessage(locale, { ea: this.locales[locale] })
      })
    }

    // helpers
    /**
     * generate nav items by resource and parent nav
     * @param resource target resource
     * @param name parent nav name
     * @returns {boolean|{icon, link: {name: string}, text}}
     */
    this.getResourceNavItems = (resource, { name }) => {
      let navNameKey = `menu.${snakeCase(
        (name || "") +
          upperFirst(typeof resource === "string" ? resource : typeof resource === "object" && resource.name)
      )}`
      let navText = this.i18n.te(navNameKey) && this.i18n.t(navNameKey)

      if (typeof resource === "object" && resource.name) {
        return resourceNavItems(resource.name, { ...resource, text: navText }, this)
      } else if (typeof resource === "string") {
        return resourceNavItems(resource, { text: navText }, this)
      }
      return false
    }
    /**
     * generate nav items by resources and parent nav
     * @param resources target resources array
     * @param parent parent nav
     * @returns {*} nav items
     */
    this.getResourcesNavItems = (resources, parent = { name: null }) => {
      return resources
        .map((res) => {
          if (typeof res === "object") {
            if (res.children) {
              return res
            }

            return this.getResourceNavItems(res, parent)
          }
          return this.getResourceNavItems({ name: res }, parent)
        })
        .filter((r) => r)
    }
    this.getResource = (resource) => {
      let res = null
      if (typeof resource === "string") {
        res = this.resources.find((r) => r.name === resource)
      } else if (resource.name) {
        res = this.resources.find((r) => r.name === resource.name)
      }

      return res
    }
    this.getAction = (resource, action) => {
      let res = this.getResource(resource)
      let a = null
      if (res) {
        if (typeof action === "string") {
          a = res.actions.find((ra) => ra.key === action)
        } else if (typeof action === "object" && action.key) {
          a = res.actions.find((ra) => ra.key === action.key)
        }
      }

      return a
    }
    this.getActionLabel = (resource, actionKey) => {
      const res = this.getResource(resource)
      const action = this.getAction(res, actionKey)
      if (action) {
        return getActionTitle(res, action, this)
      }

      return `${resource}-${actionKey}`
    }
    this.getActionLink = (resource, action) => {
      const res = this.getResource(resource)
      const a = this.getAction(res, action)
      if (res && a) {
        return actionLink(res, a)
      }

      return "index"
    }
    this.getResourceLabel = (resource, count) => {
      const res = this.getResource(resource)
      if (res) {
        return getResourceTitle(res, count, this)
      }

      return "resource"
    }
    this.getFieldLabel = (resource, field) => {
      let key = `resources.${resource}.fields.${field}`
      let label = null
      if (i18n.te(key)) {
        const result = i18n.t(key)
        if (typeof result === "object" && result.fieldName) {
          label = result.fieldName
        } else {
          label = result
        }
      }
      if (!label) {
        label = startCase(field.replace(".", " "))
      }

      return label
    }
    this.getResourceItemLabel = (resource, item) => {
      let itemLabelKey = null,
        resourceItemLabelFunc = this.getResource(resource)["itemLabel"]
      if (resourceItemLabelFunc && typeof resourceItemLabelFunc === "function") {
        itemLabelKey = resourceItemLabelFunc(item)
      }

      if (!itemLabelKey) {
        let key = this.getResource(resource)["itemLabelKey"] || this.options.defaultItemLabelKey
        itemLabelKey = Object.keys(item).indexOf(key) !== -1 ? item[key] : item["id"]
      }

      return itemLabelKey
    }
    this.hasActionPermission = (resource, action) => hasActionPermission(resource, action, this)

    // store modules
    store.registerModule("app", storeAppModule)
    store.registerModule("auth", this.authProvider ? authStore(this.authProvider, router) : guestStore)
    if (this.dataProvider) {
      this.resources.forEach((resource) =>
        store.registerModule(
          resource.name,
          resourceCrudModule({
            provider: this.dataProvider,
            resource,
            i18n,
            options: this.options,
          })
        )
      )
    }

    // routes
    let rootRoute = routes.find((r) => r._adminRoot)
    if (rootRoute) {
      rootRoute.children = this.resources
        .map((resource) => resourceRoutes(resource, this))
        .concat(
          (rootRoute.children || []).map((r) => {
            r.meta = { ...(r.meta || {}), authenticated: true }
            return r
          })
        )
    }
    routes.forEach((route) => router.addRoute(route))

    /**
     * Check Auth after each navigation
     */
    router.beforeEach(async (to, from, next) => {
      /**
       * Set main and document title
       */
      document.title = to.meta.title ? `${to.meta.title} | ${this.options.title}` : this.options.title

      if (to.meta.authenticated) {
        /**
         * Check and refresh authenticated user with last permissions
         * after each navigation
         */
        let user = await store.dispatch("auth/checkAuth")
        /**
         * If logged
         */
        if (user) {
          return next()
        }

        /**
         * Force redirect to login if not logged for authenticated routes
         */
        return next({ name: "login" })
      } else {
        next()
      }
    })
  }
}
