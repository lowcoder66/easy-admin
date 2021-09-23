import {
  LOGIN,
  LOGOUT,
  CHECK_AUTH,
  CHECK_ERROR,
  GET_NAME,
  GET_USERNAME,
  GET_PERMISSIONS,
  GET_USER,
} from "../providers/auth/actions"

export default (provider, router) => {
  return {
    namespaced: true,
    state: { user: null },
    mutations: {
      setUser(state, user) {
        state.user = user
      },
    },
    getters: {
      [GET_NAME](state) {
        if (state.user && provider[GET_NAME]) {
          return provider[GET_NAME](state.user)
        }
      },
      [GET_USERNAME](state) {
        if (state.user && provider[GET_USERNAME]) {
          return provider[GET_USERNAME](state.user)
        }
      },
      [GET_PERMISSIONS](state) {
        if (state.user && provider[GET_PERMISSIONS]) {
          return provider[GET_PERMISSIONS](state.user) || []
        }
        return []
      },
      [GET_USER](state) {
        if (state.user && provider[GET_USER]) {
          return provider[GET_USER](state.user)
        }
      },
    },
    actions: {
      /**
       * Server login with given credentials
       * checkAuth action will set fresh user infos on store automatically
       */
      [LOGIN]: async (context, credentials) => {
        await provider[LOGIN](credentials)
        router.push({ name: "index" })
      },
      /**
       * Explicit logout action, remove user from storage
       */
      [LOGOUT]: async () => {
        await provider[LOGOUT]()
        router.push({ name: "login" })
      },
      /**
       * Check valid auth on target route server by retrieving user infos
       * Set fresh user infos on store
       * Called after each URL navigation
       */
      [CHECK_AUTH]: async ({ commit, state }) => {
        if (!state.user) {
          try {
            let response = await provider[CHECK_AUTH]()
            if (response) {
              commit("setUser", response.data)
            }
          } catch (e) {
            commit("setUser", null)
          }
        }
        return state.user
      },
      /**
       * Check API error status
       * Called after each API error (4xx, 5xx)
       * Do automatic logout if reject promise returned
       */
      [CHECK_ERROR]: async ({ dispatch }, error) => {
        try {
          await provider[CHECK_ERROR](error)
        } catch (e) {
          dispatch("logout")
        }
      },
    },
  }
}
