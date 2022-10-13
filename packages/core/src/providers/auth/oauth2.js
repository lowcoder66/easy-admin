import { CHECK_AUTH, CHECK_ERROR, GET_USERNAME, GET_USER, GET_NAME, GET_PERMISSIONS, LOGIN, LOGOUT } from "./actions"

import { add, compare } from "../../utils/dateUtils"

export default (
  axios,
  params = {
    authServicePrefix: "",
    userServicePrefix: "",
  }
) => {
  params = {
    routes: {
      login: params.authServicePrefix + "/oauth/token",
      logout: params.authServicePrefix + "/accounts/logout",
      refresh: params.authServicePrefix + "/oauth/token",
      user: params.userServicePrefix + "/users?principal",
    },
    authClient: params.authClient || "auth-client",
    tokenStorageKey: params.tokenStorageKey || process.env.VUE_APP_EM_STORAGE_TOKEN_KEY || "EA:token",
    userInfoStorageKey: params.userInfoStorageKey || process.env.VUE_APP_EM_STORAGE_USERINFO_KEY || "EA:userinfo",
    getToken: () => {
      let storageTokenStr = localStorage.getItem(tokenStorageKey)
      return storageTokenStr ? JSON.parse(storageTokenStr) : null
    },
    storeToken: (token) => {
      token.request_time = Date.now()
      let tokenStr = token ? JSON.stringify(token) : {}
      localStorage.setItem(tokenStorageKey, tokenStr)
    },
    clearToken: () => {
      localStorage.removeItem(tokenStorageKey)
    },
    readUserInfo: () => {
      let storageUserInfoStr = localStorage.getItem(userInfoStorageKey)
      return storageUserInfoStr ? JSON.parse(storageUserInfoStr) : null
    },
    storeUserInfo: (user) => {
      let userStr = user
        ? JSON.stringify({
            id: user.id,
            name: user.name,
            email: user.email,
          })
        : {}
      localStorage.setItem(userInfoStorageKey, userStr)
    },
    getGrantRequestParams: (p) => {
      let requestParams = {
        client_id: authClient,
        grant_type: p.grant_type || "password",
      }

      switch (requestParams["grant_type"]) {
        case "sms_code":
          requestParams.phone = p.username
          requestParams.code = p.code
          break
        case "password":
          requestParams.username = p.username
          requestParams.password = p.password
          break
        case "refresh_token":
          requestParams.refresh_token = p.refresh_token
          break
      }

      return requestParams
    },
    getName: (u) => u.name,
    getUsername: (u) => u.phone,
    getPermissions: (u) => [].concat(u["roles"]).concat(u["authorities"]),
    ...params,
  }

  // request header
  axios.interceptors.request.use(function (config) {
    let token = params.getToken()
    let authenticated = config["authenticated"]
    if (authenticated && token && token["access_token"]) {
      config.headers["Authorization"] = `Bearer ${token["access_token"]}`
    }

    return config
  })

  let {
    routes,
    authClient,
    tokenStorageKey,
    userInfoStorageKey,
    getGrantRequestParams,
    getName,
    getUsername,
    getPermissions,
    getToken,
    storeToken,
    clearToken,
    storeUserInfo,
  } = params

  const provider = {
    [LOGIN]: async (params) => {
      let response = await axios.post(routes.login, getGrantRequestParams(params), {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        transformRequest: [
          (data) => {
            return Object.keys(data)
              .map((key) => {
                return encodeURIComponent(key) + "=" + encodeURIComponent(data[key])
              })
              .join("&")
          },
        ],
        authenticated: false,
      })

      if (response["status"] < 200 || response["status"] >= 300) {
        throw new Error(response["statusText"])
      }

      storeToken(response["data"])
      return Promise.resolve()
    },
    [LOGOUT]: async () => {
      let storageToken = getToken()
      if (routes.logout && storageToken) {
        await axios.post(routes.logout, null, {})
      }

      clearToken()
      return Promise.resolve()
    },
    [CHECK_AUTH]: async () => {
      /**
       * Refresh token
       */
      let storageToken = getToken()
      if (routes.refresh) {
        let expireTime = add(storageToken["request_time"], storageToken["expires_in"] - 60, "s", null)
        if (expireTime == null || compare(new Date(), expireTime) >= 0) {
          await provider[LOGIN]({
            grant_type: "refresh_token",
            refresh_token: storageToken["refresh_token"],
          })
        }
      }

      /**
       * Get user infos
       */
      let userInfo = null
      if (routes.user) {
        let response = await axios.get(routes.user, {})

        if (response["status"] < 200 || response["status"] >= 300) {
          throw new Error(response["statusText"])
        }

        userInfo = response["data"]

        storeUserInfo(userInfo)
      }

      return userInfo
        ? Promise.resolve({
            data: userInfo,
          })
        : Promise.reject()
    },
    [CHECK_ERROR]: ({ status }) => {
      if (status === 401 || status === 403) {
        clearToken()
        return Promise.reject()
      }
      return Promise.resolve()
    },
    [GET_NAME]: (user) => getName(user),
    [GET_USERNAME]: (user) => getUsername(user),
    [GET_PERMISSIONS]: (user) => getPermissions(user),
    [GET_USER]: (user) => user,
  }

  return provider
}
