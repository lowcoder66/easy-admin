import {
  CREATE,
  DELETE,
  DELETE_MANY,
  GET_LIST,
  GET_MANY,
  GET_ONE,
  GET_TREE,
  HTTP_CLIENT,
  OPERATE,
  UPDATE,
  UPDATE_MANY,
} from "./actions"
import qs from "qs"

export default (httpClient) => {
  httpClient.interceptors.response.use(
    (response) => {
      return response
    },
    ({ message, response }) => {
      if (response) {
        let { status, statusText, data } = response

        return Promise.reject({
          status,
          message: statusText,
          ...data,
        })
      }

      return Promise.reject({
        message,
      })
    }
  )

  const withSort = (sort) => {
    if (sort && sort.length) {
      return {
        sort: sort.map((item) => item.by + (item.desc ? ",desc" : "")),
      }
    }

    return {}
  }

  return {
    [HTTP_CLIENT]: httpClient,
    [GET_TREE]: async (resource, params) => {
      const { sort, filter } = params
      let query = {
        ...filter,
        tree: true,
      }

      // sort
      query = {
        ...query,
        ...withSort(sort),
      }

      let { data } = await httpClient.get(`${resource}?${qs.stringify(query, { arrayFormat: "repeat" })}`)
      return {
        data,
        total: data.length,
      }
    },
    [GET_LIST]: async (resource, params) => {
      const { pagination, sort, filter } = params
      let query = {
        ...filter,
      }

      if (pagination) {
        let { page, perPage } = pagination

        query = {
          ...query,
          page: page - 1,
          // ! 并不是真的显示全部条目，而是999条
          size: perPage < 1 ? 999 : perPage,
        }
      }

      if (sort && sort.length) {
        query = {
          ...query,
          sort: sort.map((item) => item.by + (item.desc ? ",desc" : "")),
        }
      }

      let response = await httpClient.get(`${resource}?${qs.stringify(query, { arrayFormat: "repeat" })}`)
      let { data } = response
      // spring page response, {content: []}
      if (
        Object.prototype.hasOwnProperty.call(data, "content") &&
        Object.prototype.hasOwnProperty.call(data, "totalElements")
      ) {
        let content = data["content"]
        let totalElements = data["totalElements"]
        let pageNumber = (Number(data["number"] ? data["number"] : query.page) || 0) + 1
        let lastPage = Object.prototype.hasOwnProperty.call(data, "last")
          ? data["last"]
          : pageNumber * query.size >= totalElements
        return {
          data: content,
          total: totalElements,
          lastPage: lastPage,
          page: pageNumber,
          rawResponse: response,
        }
      } else if (data instanceof Array) {
        // common list, []
        return {
          data,
          total: data.length,
          lastPage: true,
          page: 1,
        }
      } else {
        console.warn("Incomprehensible format.")
        return {
          data: [],
          total: 0,
          lastPage: true,
          page: 1,
        }
      }
    },
    [GET_MANY]: (resource, params) => httpClient.get(`${resource}/${params.ids.join(",")}`),
    [GET_ONE]: (resource, params) => httpClient.get(`${resource}/${params.id}`),
    [CREATE]: (resource, params) => httpClient.post(resource, params.data),
    [UPDATE]: (resource, params) => httpClient.put(`${resource}/${params.id}`, params.data),
    [UPDATE_MANY]: (resource, params) => {
      return Promise.all(params.ids.map((id) => httpClient.put(`${resource}/${id}`, params.data))).then(() =>
        Promise.resolve()
      )
    },
    [DELETE]: (resource, params) => httpClient.delete(`${resource}/${params.id}`),
    [DELETE_MANY]: (resource, params) => {
      return Promise.all(params.ids.map((id) => httpClient.delete(`${resource}/${id}`))).then(() => Promise.resolve())
    },
    [OPERATE]: (resource, params) => {
      let resourceUrl = `${resource}`
      if (params.id) {
        resourceUrl += `/${params.id}`
      }
      resourceUrl += `?${params.operateKey}`

      return httpClient.post(resourceUrl, params.data)
    },
  }
}
