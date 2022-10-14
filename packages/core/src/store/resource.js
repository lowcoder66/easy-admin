import * as methods from "../providers/data/actions"

let storeActions = {}
export default ({ provider, resource, i18n, options }) => {
  let { name, api, parents } = resource

  Object.values(methods).forEach(
    (action) =>
      (storeActions[action] = async ({ state }, params) => {
        try {
          if (!provider) {
            throw new Error("No data provider defined")
          }

          if (!provider[action]) {
            throw new Error(`Data provider action '${action}' not implemented`)
          }

          let resourceApi = api || name
          if (parents) {
            parents.forEach((parent) => {
              let { name: parentResource, field } = parent
              const parentItem = state.parents[parentResource]
              if (parentItem) {
                resourceApi = api.replace(`{${field}}`, encodeURIComponent(String(parentItem[options.defaultIdKey])))
              }
            })
          }

          let response = await provider[action](resourceApi, {
            locale: state.locale,
            ...params,
          })

          return Promise.resolve(response)
        } catch (e) {
          return Promise.reject(e)
        }
      })
  )

  return {
    namespaced: true,
    state: {
      item: null,
      locale: i18n.locale,
      parents: {},
    },
    mutations: {
      setItem(state, item) {
        state.item = item
      },
      removeItem(state) {
        state.item = null
      },
      setParent(state, parent) {
        let { name, item } = parent
        state.parents = { ...state.parents, [name]: item }
      },
    },
    actions: {
      ...storeActions,
    },
  }
}
