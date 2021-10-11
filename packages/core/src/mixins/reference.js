export default {
  data() {
    return {
      loading: false,
    }
  },
  props: {
    reference: String,
    fetchFilter: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  methods: {
    async fetchReferenceItems() {
      if (!this.reference || this.loading) {
        return
      }
      this.loading = true

      let allItems = []
      let currentPage = 1
      let fetchResult = await this.fetchPage(currentPage)
      allItems = allItems.concat(fetchResult.data)
      while (!fetchResult.lastPage) {
        fetchResult = await this.fetchPage(++currentPage)
        allItems = allItems.concat(fetchResult.data)
      }

      this.loading = false
      return allItems
    },
    async fetchPage(currentPage) {
      return await this.$store.dispatch(`${this.reference}/getList`, {
        filter: this.fetchFilter,
        pagination: {
          page: currentPage,
          perPage: 50,
        },
      })
    },
  },
}
