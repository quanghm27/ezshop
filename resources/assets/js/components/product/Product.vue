<template>
    <div class="wrapper">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-header">
                            <i class="fa fa-align-justify"></i> Chức năng
                        </div>
                        <div class="card-block">
                            <button type="button" class="btn btn-primary" @click="showAddModal">
                                <i class="fa fa-plus" aria-hidden="true"></i>Thêm sản phẩm
                            </button>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <i class="fa fa-align-justify"></i> Quản lý sản phẩm
                        </div>
                        <div class="card-block">
                            <product-list></product-list>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <product-modal></product-modal>
    </div>

</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    import ProductList from './ProductList.vue';
    import ProductModal from './ProductModal.vue';

    export default {
        name: 'Product',
        components: {
            ProductList, ProductModal
        },
        methods: {
            ...mapActions('products', {
                showAddModal: 'showAddModal'
            })
        }
    }
</script>