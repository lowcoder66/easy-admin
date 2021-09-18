import axios from 'axios'

const defaultErrorHandler = (error, store, router) => {
  let errMsg = null
  if (error && error.response) {
    if (error.response.data && error.response.data.message) {
      errMsg = error.response.data.message
    } else if (error.message) {
      errMsg = error.message
    }

    // 401 to login
    if (error.response.status === 401) {
      router.push({
        name: "login"
      }, null, null)
    }
  } else if(error && error.message) {
    store.dispatch("app/errorMsg", error.message)
  }

  if (errMsg) {
    store.dispatch("app/errorMsg", errMsg)
  }

  return error
}

const successAlert = (response, store) => {
  if (response && response.data && response.data.message) {
    store.dispatch("app/successMsg", response.data.message)
  }
}

class AxiosHttp {
  constructor ({ overrideOptions, store, router,}) {
    this.queue = {}

    this.store = store
    this.router = router

    return this.create(overrideOptions)
  }
  getInsideConfig () {
    return {
      authenticated: true,
      errorHandler: (error) => defaultErrorHandler(error, this.store, this.router),
    }
  }
  destroy (url) {
    delete this.queue[url]
    if (!Object.keys(this.queue).length) {
      setTimeout(() => {this.store.dispatch('app/loaded')}, 500)
    }
  }
  interceptors (instance) {
    instance.interceptors.request.use(config => {
      if (!Object.keys(this.queue).length) {
        this.store.dispatch("app/loading")
      }
      this.queue[config.url] = true

      return config
    }, error => {
      let errorHandler = error.config.errorHandler || null
      return Promise.reject(errorHandler ? errorHandler(error) : error)
    })

    // 响应拦截
    instance.interceptors.response.use(resp => {
      this.destroy(resp.config.url)

      new Promise(() => {
        successAlert(resp, this.store)
      }).then(() => {});

      return resp
    }, error => {
      this.destroy(error.config.url)

      let errorHandler = error.config.errorHandler || null
      return Promise.reject(errorHandler ? errorHandler(error) : error)
    })
  }
  create(options) {
    let finalOptions = Object.assign({}, this.getInsideConfig(), options)
    const instance = axios.create(finalOptions)

    this.interceptors(instance)
    return instance
  }
}

export default AxiosHttp
