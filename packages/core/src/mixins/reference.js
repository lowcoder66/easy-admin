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
            }
        }
    },
    methods: {
        async fetchReferenceItems() {
            if (!this.reference || this.loading) {
                return;
            }
            this.loading = true;

            let { data } = await this.$store.dispatch(`${this.reference}/getList`, {
                filter: this.fetchFilter,
            });

            this.loading = false;
            return data;
        },
    },
};
