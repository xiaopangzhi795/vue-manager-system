import { uuid } from 'vue-uuid'; // uuid object is also exported to things

export default {
    data () {
        return {
            uuid: ''
        };
    },
    created() {
        this.uuid = uuid.v1()
    },
    methods: {
        handleUUIDv1() {
            this.uuid = this.$uuid.v1()
        },
        handleUUIDv4() {
            this.uuid = this.$uuid.v4()
        }
    }
}