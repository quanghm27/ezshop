<template>
    <alert v-model="active" placement="top-right" duration="3000" :type="type" width="400px" dismissable>
        <strong>{{ title }}</strong>
        <p>{{ message }}</p>
        <ul v-if="errors.length > 0">
            <li v-for="e in errors">{{ e }}</li>
        </ul>
    </alert>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import extend from 'extend';
    import Alert from 'vue-strap/src/alert';

    export default {
        components: { Alert },
        computed: {
            active: {
                get() {
                    return this.$store.state.alert.active;
                },
                set(newValue) {
                    if (!newValue)
                        this.alertHide();
                }
            },
            ...mapGetters({
                type: 'alertType',
                title: 'alertTitle',
                message: 'alertMessage',
                errors: 'alertErrors'
            })
        },
        methods: {
            ...mapActions(['alertHide'])
        }
    }
</script>