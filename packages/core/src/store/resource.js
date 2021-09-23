import * as methods from "../providers/data/actions"

let storeActions = {}
export default ({ provider, resource, i18n }) => {
  let { name, api } = resource

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

          let response = await provider[action](api || name, {
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
    },
    mutations: {
      setItem(state, item) {
        state.item = item
      },
      removeItem(state) {
        state.item = null
      },
    },
    actions: {
      ...storeActions,
    },
  }
}
