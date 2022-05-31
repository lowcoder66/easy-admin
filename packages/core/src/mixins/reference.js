export default {
  data() {
    return {
      loading: false,
      referenceData: [],
    }
  },
  props: {
    reference: String,
    fetchFilter: {
      type: [Object, Function],
      default() {
        return {}
      },
    },
  },
  computed: {
    referenceFetchFilter() {
      if (typeof this.fetchFilter === "function") {
        return this.fetchFilter(this.formState ? this.formState.model : null)
      } else {
        return this.fetchFilter
      }
    },
  },
  async created() {
    this.referenceData = await this.fetchReferenceItems()
  },
  watch: {
    referenceFetchFilter: {
      async handler() {
        this.referenceData = await this.fetchReferenceItems()
      },
      immediate: true,
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
      if (fetchResult) {
        allItems = allItems.concat(fetchResult.data);
        while (!fetchResult.lastPage) {
          fetchResult = await this.fetchPage(++currentPage)
          allItems = allItems.concat(fetchResult.data)
        }
      }

      this.loading = false
      return allItems
    },
    async fetchPage(currentPage) {
      return await this.$store.dispatch(`${this.reference}/getList`, {
        filter: this.referenceFetchFilter,
        pagination: {
          page: currentPage,
          perPage: 50,
        },
      })
    },
  },
}
