<template>
    <div class="wrapper">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-header">
                            <i class="fa fa-align-justify"></i> Quản lý khách hàng
                        </div>
                        <div class="card-block">
                            <button type="button" class="btn btn-primary" @click="showAddModal">
                                <i class="fa fa-plus" aria-hidden="true"></i>Thêm khách hàng
                            </button>
                            <br><br>
                            <customer-list></customer-list>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <customer-modal></customer-modal>
    </div>

</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    import CustomerList from './CustomerList.vue';
    import CustomerModal from './CustomerModal.vue';

    export default {
        name: 'Product',
        components: {
            CustomerList, CustomerModal
        },
        methods: {
            ...mapActions('customers', {
                showAddModal: 'showAddModal'
            })
        }
    }
</script>