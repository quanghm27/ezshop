<template>
    <modal v-model="active" effect="zoom" :large="true">
        <div slot="modal-header" class="modal-header">
            <h4 class="modal-title">Tìm sản phẩm</h4>
        </div>
        <div class="row">
            <div class="col-sm-12">
                <div class="form-group">
                    <div class="input-group">
                        <span class="input-group-addon"><i class="fa fa-search"></i></span>
                        <input class="form-control" v-model="keyword" @input="searchProduct"
                               placeholder="Nhập tên hoặc mã sản phẩm (> 2 ký tự)...">
                    </div>
                </div>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-sm-12">
                <p v-if="searchResult.length === 0">Không tìm thấy sản phẩm nào</p>
                <div v-else class="list-group search-result">
                    <a v-for="result in searchResult" href="#"
                       @click.prevent="selectProduct(result)"
                       @dblclick="save"
                       :class="{active: selected && result.id === selected.id}"
                       class="d-flex list-group-item list-group-item-action flex-row align-items-center">
                        <div style="margin-right: 1em">
                            <img v-if="result.image" class="image-preview tiny" :src="result.image"/>
                            <img v-else class="image-preview tiny" src="/img/no-image.jpg"/>
                        </div>
                        <div class="">
                            <h5 class="mb-1">
                                [{{ result.code }}] {{ result.name }}
                                <span v-if="result.discount_event > 0" class="badge badge-pill badge-danger">
                                    <i class="fa fa-star" aria-hidden="true"></i> -{{ result.discount_event }}%
                                </span>
                                <span v-else-if="result.discount > 0" class="badge badge-pill badge-info">
                                    -{{ result.discount }}%
                                </span>
                            </h5>
                            <h5 class="mb-1">
                                <span class="badge badge-primary">
                                    Kho: {{ result.quantity }}
                                </span>
                                <span v-if="result.discount_event > 0" class="badge badge-success">
                                    Giá:
                                    <span class="price-original">{{formatCurrency(result.price)}}</span>
                                    <span>
                                        {{ formatCurrency(result.price * (1 - result.discount_event / 100))}} VNĐ
                                    </span>
                                </span>
                                <span v-else-if="result.discount > 0" class="badge badge-success">
                                    Giá:
                                    <span class="price-original">{{formatCurrency(result.price)}}</span>
                                    <span>
                                        {{ formatCurrency(result.price * (1 - result.discount / 100))}} VNĐ
                                    </span>
                                </span>
                                <span v-else="" class="badge badge-success">
                                    Giá: {{ formatCurrency(result.price) }} VNĐ
                                </span>
                            </h5>
                        </div>
                    </a>
                </div>
            </div>
        </div>
        <div slot="modal-footer" class="modal-footer">
            <button type="button" class="btn btn-default" @click="hide">
                <i class="fa fa-times" aria-hidden="true"></i>Hủy
            </button>
            <button type="button" class="btn btn-success" @click="save">
                <i class="fa fa-check" aria-hidden="true"></i>Chọn
            </button>
        </div>
    </modal>
</template>

<script>
    import Vue from 'vue';
    import accounting from 'accounting';
    import {mapGetters, mapActions} from 'vuex';

    import Modal from 'vue-strap/src/modal';

    export default {
        components: {Modal},
        computed: {
            ...mapGetters('orders', ['products', 'productIds']),
            ...mapGetters('products', {
                allProducts: 'all'
            }),
            active: {
                get() {
                    return this.$store.state.orders.product.modal;
                },
                set(newValue) {
                    if (this.active && !newValue) {
                        this.hide();
                    }

                }
            },
        },
        methods: {
            ...mapActions('orders', ['hideProductModal', 'addProduct']),
            formatCurrency(value) {
                return accounting.formatNumber(value);
            },
            hide() {
                this.keyword = '';
                this.searchResult = [];
                this.selected = null;
                this.hideProductModal();
            },
            save() {
                this.addProduct(this.selected);
                this.hide();
            },
            searchProduct() {
                if (this.keyword.length < 3) {
                    this.searchResult = [];
                } else {
                    this.searchResult = this.allProducts.filter(product => {
                        let keyword = this.keyword.toLowerCase();
                        if (this.productIds.indexOf(product.id) > -1) return false;
                        if (product.quantity === 0) return false;
                        return (product.name.toLowerCase().indexOf(keyword) > -1 ||
                        product.code.toLowerCase().indexOf(keyword) > -1);
                    });
                }
            },
            selectProduct(product) {
                this.selected = product;
            }
        },
        data() {
            return {
                keyword: '',
                searchResult: [],
                selected: null
            }
        }
    }
</script>