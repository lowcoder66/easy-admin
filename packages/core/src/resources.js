import upperFirst from "lodash/upperFirst"
import lowerCase from "lodash/lowerCase"
import { camelCase, kebabCase, startCase } from "lodash/string"

export const completeResourcesObject = (resources = [], admin) => {
  return resources
    .map((r) => {
      return typeof r === "string" ? { name: r } : r
    }) // string to object : { name: 'resourceName' }
    .map((r) => {
      // actions
      let actions
      if (!r.actions) {
        actions = [...admin.options.defaultActions]
      } else {
        actions = [...r.actions]
      }
      actions = completeActionsObject(actions, admin)

      // parents
      let parents = []
      if (r.parents) {
        parents = [...r.parents]
      }
      parents = completeParentsObject(parents, admin)

      // resource object
      return {
        ...r,
        icon: r.icon || admin.options.defaultResourceIcon,
        actions,
        parents,
      }
    })
}
const completeActionsObject = (actions, admin) => {
  return actions
    .map((a) => {
      let actionObj
      const aliasReg = /^(\w+)?=(\w+)$/
      if (typeof a === "string") {
        let aliasMatched = a.match(aliasReg)
        if (aliasMatched) {
          actionObj = {
            name: aliasMatched[1],
            alias: aliasMatched[2],
            key: a,
          }
        } else {
          actionObj = {
            name: a,
            key: a,
          }
        }
      } else {
        actionObj = a
      }

      // alias
      if (a.key && !a["alias"] && a.key.match(aliasReg)) {
        actionObj["alias"] = a.key.match(aliasReg)[2]
      }

      // displayMode and retrieveLayout
      actionObj.key = actionObj.key || actionObj.name
      let displayMode = "N/A"
      switch (actionObj.name) {
        case "retrieve":
          displayMode = "page"
          break
        case "create":
        case "update":
        case "show":
          displayMode = actionObj.displayMode || admin.options.defaultActionDisplayMode
          break
        case "operate":
          displayMode = actionObj.displayMode || "dialog"
      }
      actionObj.displayMode = displayMode

      // link path and icon
      let actionAlias = actionObj["alias"] ? "-" + kebabCase(actionObj["alias"]) : ""
      switch (actionObj.name) {
        case "retrieve":
          actionObj.path = actionObj.path || (actionAlias ? "retrieve" + actionAlias : "")
          actionObj.icon = actionObj.icon || "mdi-view-list"
          break
        case "create":
          actionObj.path = actionObj.path || "create" + actionAlias
          actionObj.icon = actionObj.icon || "mdi-plus"
          break
        case "update":
          actionObj.path = actionObj.path || ":id/update" + actionAlias
          actionObj.icon = actionObj.icon || "mdi-pencil"
          break
        case "show":
          actionObj.path = actionObj.path || ":id/show" + actionAlias
          actionObj.icon = actionObj.icon || "mdi-dots-horizontal-circle"
          break
        case "operate":
          actionObj.path = actionObj.path || ":id/operate" + actionAlias
          actionObj.icon = actionObj.icon || "mdi-cogs"
          break
      }

      return actionObj
    })
    .filter(
      (a) =>
        a.name &&
        (admin.options.defaultActions.includes(a.name) || (admin.options.enableOperateAction && a.name === "operate"))
    )
}
const completeParentsObject = (parents, admin) => {
  return parents.map((p) => {
    let parentObj
    if (typeof p === "string") {
      parentObj = {
        name: p,
        field: camelCase(`${p}_${admin.options.defaultIdKey || "id"}`),
      }
    } else {
      parentObj = p
    }
    return parentObj
  })
}

export const hasActionPermission = (resource, action, admin) => {
  action = admin.getAction(resource, action)
  if (!action) {
    return false
  }

  const userPermissions = admin.authProvider ? admin.store.getters["auth/getPermissions"] : []

  if (action.permissions) {
    if (typeof action.permissions === "function") {
      return action.permissions(userPermissions)
    } else {
      return admin.defaultPermissionEvaluator(
        userPermissions,
        Array.isArray(action.permissions) ? action.permissions : [action.permissions]
      )
    }
  }

  return admin.options.defaultActionPermissionEvaluator(userPermissions, admin.getResource(resource), action)
}
export const getResourceTitle = (resource, count = 10, admin) => {
  let resourceNameKey = `resources.${resource.name}.name`
  return admin.i18n && admin.i18n.te(resourceNameKey) ? admin.i18n.tc(resourceNameKey, count) : startCase(resource.name)
}

export const getActionTitle = (resource, action, admin) => {
  let count = action.name === "retrieve" ? 10 : 1
  let resourceTitle = getResourceTitle(resource, count, admin)
  let actionNameKey = `ea.title.actions.${action.name}`
  return admin.i18n && admin.i18n.te(actionNameKey)
    ? admin.i18n.t(actionNameKey, { resource: resourceTitle })
    : startCase(`${action.name}_${resource.name}`)
}
const setDocTitle = (to, resource, action, admin) => {
  let resourceObj = admin.getResource(resource)
  let actionObj = admin.getAction(resourceObj, action)

  let actionTitle = resourceObj && actionObj && getActionTitle(resourceObj, actionObj, admin)
  to.meta.title = actionTitle || `${lowerCase(`${resource} - ${action}`)}`
  document.title = `${to.meta.title} | ${admin.options.title}`
}
const resourceActionRoute = (resource, action, admin) => {
  const { name, path } = action
  return {
    path,
    name: actionLink(resource, action),
    props: true,
    component: {
      props: ["id"],
      render(c) {
        let componentName = `${upperFirst(camelCase(resource.name))}${upperFirst(name)}`

        let props = {
          id: this.id,
          title: this.$route.meta["title"],
          resource: resource,
          action: action,
          item: admin.store.state[resource.name].item,
          permissions: admin.store.getters["auth/getPermissions"],
        }

        if (componentName in this.$options.components) {
          return c(componentName, {
            props,
          })
        }

        return c(`Ea${upperFirst(action.name)}Guesser`, {
          props,
        })
      },
      async beforeRouteEnter(to, from, next) {
        /**
         * Initialize from query if available
         */
        let id = to.params.id || to.query.source

        if (id) {
          /**
           * Route model binding
           */
          try {
            let { data } = await admin.store.dispatch(`${resource.name}/getOne`, {
              id,
            })

            /**
             * Insert model into route & resource store
             */
            admin.store.commit(`${resource.name}/setItem`, data)

            if (to.params.id) {
              setDocTitle(to, resource, action, admin)
              return next()
            }
          } catch ({ status, message }) {
            to.meta.title = message
            document.title = message
            /*admin.store.commit(`messages/setError`, {
                            status,
                            message:
                                status === 404
                                    ? admin.i18n.t("ea.pages.not_found", {
                                        //resource: resource.singularName,
                                        id,
                                    })
                                    : message,
                        });*/
            return next()
          }
        }

        setDocTitle(to, resource, action, admin)
        next()
      },
      beforeRouteLeave(to, from, next) {
        admin.store.commit(`${resource.name}/removeItem`)
        next()
      },
    },
    meta: {
      authenticated: true,
      resource: resource.name,
      action: action.key,
      icon: action.icon || resource.icon,
    },
  }
}

export const resourceNavItems = (
  name, // resource name
  { action, icon, text }, // override params
  admin
) => {
  let resourceObj = admin.getResource(name)
  if (!resourceObj) {
    return false
  }

  let permittedActions = resourceObj.actions.filter((a) => hasActionPermission(resourceObj, a, admin))

  let actionObj = action && permittedActions.find((a) => a.key === action)
  if (!actionObj) {
    let newPageActions = permittedActions.filter((a) => ["create", "retrieve"].indexOf(a.name) > -1) // create or retrieve

    actionObj =
      newPageActions.find((pa) => pa.name === "retrieve" && !pa.alias) ||
      newPageActions.find((pa) => pa.name === "retrieve") ||
      newPageActions[0]
  }

  if (!actionObj) {
    return false
  }

  return {
    icon: icon || resourceObj.icon || actionObj.icon,
    text: text || getActionTitle(resourceObj, actionObj, admin),
    link: { name: actionLink(resourceObj, actionObj) },
  }
}
// resource_action[-actionAlias]
export const actionLink = (resource, action) => {
  return `${resource.name}_${action.name}` + (action.alias ? `-${action.alias}` : "")
}
export const resourceRoutes = (resource, admin) => {
  return {
    path: `/${kebabCase(resource.name)}`,
    component: {
      render(c) {
        return c("router-view")
      },
    },
    meta: {
      title: getResourceTitle(resource, 10, admin),
    },
    children: resource.actions
      .filter((a) => a.displayMode === "page")
      .map((a) => resourceActionRoute(resource, a, admin)),
  }
}
