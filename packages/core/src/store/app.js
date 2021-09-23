export default {
  namespaced: true,
  state: {
    loading: false,
    messages: [],
    navDrawer: true,
  },
  mutations: {
    setNavDrawer(state, show) {
      state.navDrawer = show
    },
    setLoading(state, loading) {
      state.loading = loading
    },
    setMessages(state, messages) {
      state.messages = messages
    },
    addMessage(state, message) {
      state.messages.splice(0, 0, message)
    },
    delMessage(state, uid) {
      let index = state.messages.findIndex((a) => a.uid === uid)
      if (index > -1) {
        state.messages.splice(index, 1)
      }
    },
  },
  actions: {
    loading({ commit }) {
      commit("setLoading", true)
    },
    loaded({ commit }) {
      commit("setLoading", false)
    },
    showMsg({ commit, state }, msg) {
      let def = {
        uid: state.messages.length + "_" + Date.now(),
        live: 1500,
        type: "info",
      }

      let msgObj = typeof msg === "string" ? { ...def, message: msg } : Object.assign(def, msg)
      commit("addMessage", msgObj)
    },
    errorMsg({ dispatch }, msg) {
      let msgObj = typeof msg === "string" ? { type: "error", message: msg } : { ...msg, type: "error" }
      dispatch("showMsg", msgObj)
    },
    successMsg({ dispatch }, msg) {
      let msgObj = typeof msg === "string" ? { type: "success", message: msg } : { ...msg, type: "success" }
      dispatch("showMsg", msgObj)
    },
  },
}
