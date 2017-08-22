<template>
    <div class="wrapper">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-header">
                            <i class="fa fa-align-justify"></i> Thông tin khuyến mãi
                        </div>
                        <div class="card-block">
                            <div class="col-5">
                                <div class="input-group">
                                    <span class="input-group-addon"><i class="fa fa-percent"></i></span>
                                    <input autofocus="true" class="form-control" type="number" v-model="discount"
                                           placeholder="Nhập % giảm giá">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-header">
                            <i class="fa fa-align-justify"></i> Thêm sản phẩm cho đợt khuyến mãi
                        </div>
                        <div class="card-block">
                            <div class="form-group col-5">
                                <div class="input-group">
                                    <span class="input-group-addon">
                                                  <i class="fa fa-search"></i>
                                                </span>
                                    <input class="form-control" v-model="keyword" @input="searchProduct"
                                           placeholder="Nhập tên hoặc mã sản phẩm (> 2 ký tự)...">
                                </div>
                            </div>
                            <div class="row col-7">
                                <div class="col-sm-12">
                                    <span v-if="searchResult.length === 0">Không tìm thấy sản phẩm nào</span>
                                    <div v-else class="list-group">
                                        <a v-for="result in searchResult" href="#"
                                           @click.prevent="selectProduct(result)"
                                           @dblclick="save"
                                           :class="{active: selected && result.id === selected.id}"
                                           class="d-flex list-group-item list-group-item-action flex-row align-items-center">
                                            <div style="margin-right: 1em">
                                                <img v-if="result.image" class="image-preview tiny"
                                                     :src="result.image"/>
                                                <img v-else class="image-preview tiny" src="/img/no-image.jpg"/>
                                            </div>
                                            <div class="">
                                                <h5 class="mb-1">
                                                    [{{ result.code }}] {{ result.name }}
                                                    <span v-if="result.discount_event > 0"
                                                          class="badge badge-pill badge-danger">
                                                        <i class="fa fa-star"
                                                           aria-hidden="true"></i> -{{ result.discount_event }}%
                                                    </span>
                                                    <span v-else-if="result.discount > 0"
                                                          class="badge badge-pill badge-info">
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
                            <hr>
                            <div>
                                <button type="submit" class="btn btn-sm btn-success" @click="save">Thêm sản phẩm
                                </button>
                            </div>
                            <br><br>
                            <div v-if="products">
                                <div v-if="productLoading" class="loading">
                                    <div class="loading-icon"><i class="fa fa-cog fa-spin fa-3x fa-fw"></i></div>
                                    <div class="loading-text">Đang tải dữ liệu...</div>
                                </div>
                                <table v-else="" class="table table-condensed">
                                    <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th style="width: 200px">Khuyến mãi (%)</th>
                                        <th style="width: 200px">Thành tiền (VNĐ)</th>
                                        <th style="width: 120px">Thao tác</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="product in products">
                                        <td>
                                            <div class="d-flex flex-row align-items-center">
                                                <div style="margin-right: 1em">
                                                    <img v-if="product.image" class="image-preview tiny"
                                                         :src="product.image"/>
                                                    <img v-else class="image-preview tiny" src="/img/no-image.jpg"/>
                                                </div>
                                                <div>
                                                    <h5 class="mb-1">
                                                        [{{ product.code }}] {{ product.name }}
                                                        <span v-if="product.discount_event > 0"
                                                              class="badge badge-pill badge-danger">
                                                            <i class="fa fa-star"
                                                               aria-hidden="true"></i> -{{ product.discount_event }}%
                                                        </span>
                                                        <span v-else-if="product.discount > 0"
                                                              class="badge badge-pill badge-info">
                                                            -{{ product.discount }}%
                                                        </span>
                                                    </h5>
                                                    <h5 class="mb-1">
                                                        <span class="badge badge-primary">
                                                            Kho: {{ product.quantity }}
                                                        </span>
                                                        <span v-if="product.discount_event > 0"
                                                              class="badge badge-success">
                                                            Giá:
                                                            <span class="price-original">{{formatCurrency(product.price)}}</span>
                                                            <span>
                                                                {{ formatCurrency(product.price * (1 - product.discount_event / 100))}} VNĐ
                                                            </span>
                                                        </span>
                                                        <span v-else-if="product.discount > 0"
                                                              class="badge badge-success">
                                                            Giá:
                                                            <span class="price-original">{{formatCurrency(product.price)}}</span>
                                                            <span>
                                                                {{ formatCurrency(product.price * (1 - product.discount / 100))}} VNĐ
                                                            </span>
                                                        </span>
                                                        <span v-else="" class="badge badge-success">
                                                            Giá: {{formatCurrency(product.price)}} VNĐ
                                                        </span>
                                                    </h5>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {{product.discountNew}}%
                                        </td>
                                        <td>{{formatCurrency(product.total)}} VNĐ</td>
                                        <td>
                                            <button class="btn btn-danger" @click="removeProductEvent(product)">
                                                <i class="fa fa-trash" aria-hidden="true"></i>Xóa
                                            </button>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div v-if="this.products.length > 0" class="card-footer">
                            <button @click="updateDiscount()" type="button" class="btn btn-danger btn-lg"><i
                                    class="fa fa-star"></i>&nbsp; Cập nhật khuyến mãi
                            </button>
                        </div>
                    </div>

                    <div class="card">
                        <div class="card-header">
                            <i class="fa fa-align-justify"></i> Sản phẩm đang trong đợt khuyến mãi
                        </div>
                        <div class="card-block">
                            <div class="row">
                                <div v-if="allProductsEvent.length === 0" class="col-sm-6 col-lg-4">
                                    <span> Không có sản phẩm nào trong đợt khuyến mãi.</span>
                                </div>
                                <div v-for="result in allProductsEvent" class="col-sm-6 col-lg-6"
                                     style="margin-bottom: 10px;">
                                    <div href="#" class="d-flex list-group-item list-group-item-action flex-row"
                                         style="padding: 5px 10px;">
                                        <div style="margin-right: 1em;">
                                            <img v-if="result.image" class="image-preview small" :src="result.image"/>
                                            <img v-else class="image-preview small" src="/img/no-image.jpg"/>
                                        </div>
                                        <div>
                                            <h6 class="mb-1">
                                                <span>[{{ result.code }}] {{ result.name }}</span>
                                                <br>
                                                <span v-if="result.discount_event > 0"
                                                      class="badge badge-pill badge-danger">
                                                <i class="fa fa-star" aria-hidden="true"></i> -{{ result.discount_event
                                                    }}%
                                            </span>
                                                <span v-else="result.discount > 0" class="badge badge-pill badge-info">
                                                -{{ result.discount }}%
                                            </span>
                                            </h6>
                                            <h6 class="mb-1">
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
                                                <span v-else="result.discount > 0" class="badge badge-success">
                                                Giá:
                                                <span class="price-original">{{formatCurrency(result.price)}}</span>
                                                <span>
                                                    {{ formatCurrency(result.price * (1 - result.discount / 100))}} VNĐ
                                                </span>
                                            </span>
                                                <span v-else="" class="badge badge-success">
                                                Giá: {{ formatCurrency(result.price) }} VNĐ
                                            </span>
                                            <br>
                                            <div style="padding-top: 8px;">
                                                <button type="button" @click="closeDiscountForProduct(result.id)" class="btn btn-outline-success btn-sm"><i class="fa fa-close"></i>&nbsp;Hủy sự kiện</button>
                                            </div>
                                            </h6>
                                        </div>
                                    </div>
                                </div>
                                <!--/.col-->
                            </div><!--/.row-->
                        </div>
                        <div class="card-footer">
                            <button type="button" v-if="allProductsEvent.length > 0" @click="showConfirmModal"
                                    class="btn btn-outline-danger btn-lg"><i class="fa fa-ban"></i>&nbsp;
                                Kết thúc sự kiện
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <modal v-model="active" effect="zoom" :large="false">
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title"Xác nhận kết thúc sự kiện</h4>
            </div>
            <p>Hãy xác nhận việc kết thúc sự kiện giảm giá này</p>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="hideConfirmModal">
                    <i class="fa fa-times" aria-hidden="true"></i>Hủy
                </button>
                <button type="button" class="btn btn-success" @click="closeDiscount">
                    <i class="fa fa-trash" aria-hidden="true"></i>Xóa
                </button>
            </div>
        </modal>
    </div>
</template>

<script>
    import Vue from 'vue';
    import {mapGetters, mapActions} from 'vuex';
    import accounting from 'accounting';
    import Modal from 'vue-strap/src/modal';

    export default {
        components: {
            Modal
        },
        mounted() {
            this.$store.dispatch('products/getAll');
            this.$store.dispatch('products/getAllEvent');
        },
        computed: {
            active: {
                get() {
                    return this.$store.state.events.modal.active;
                },
                set(newValue) {
                    if (this.active && !newValue) {
                        this.hide();
                    }
                }
            },
            ...mapGetters('orders', ['products', 'productLoading']),
            ...mapGetters('events', ['products', 'productIds']),
            ...mapGetters('products', {
                allProducts: 'all',
                allProductsEvent: 'allEvent'
            }),
        },
        methods: {
            ...mapActions('events', {
                showConfirmModal: 'showModal',
                hideConfirmModal: 'hideModal'
            }),
            ...mapActions('events', ['setProduct', 'updateDiscountEvent', 'removeProduct', 'closeDiscountEvent', 'closeDiscountProduct']),
            formatCurrency(value) {
                return accounting.formatNumber(value);
            },
            searchProduct() {
                if (this.keyword.length < 3) {
                    this.searchResult = [];
                } else {
                    this.updateSearchResult();
                }
            },
            removeProductEvent(product) {
                this.removeProduct(product);
                this.updateSearchResult();
            },
            save() {
                if (this.selected !== null) {
                    this.selected.discountNew = this.discount;
                }
                this.setProduct(this.selected);
                if (this.searchResult.length > 0) {
                    this.updateSearchResult();
                }
            },
            updateSearchResult() {
                this.searchResult = this.allProducts.filter(product => {
                    let keyword = this.keyword.toLowerCase();
                    if (this.productIds.hasOwnProperty(product.id)) return false;
                    if (product.quantity === 0) return false;
                    return (product.name.toLowerCase().indexOf(keyword) > -1 ||
                    product.code.toLowerCase().indexOf(keyword) > -1);
                });
            },
            updateDiscount() {
                this.updateDiscountEvent();
                this.keyword = '';
                this.searchResult = [];
                this.selected = null;
            },
            closeDiscount() {
                this.closeDiscountEvent();
                this.keyword = '';
                this.searchResult = [];
                this.selected = null;
            },
            closeDiscountForProduct(id) {
                this.closeDiscountProduct(id);
            },
            updatew() {
                this.$store.dispatch('products/getAll');
            },
            selectProduct(product) {
                this.selected = Object.assign({}, product);
            }
        },
        data() {
            return {
                keyword: '',
                discount: '',
                searchResult: [],
                selected: null
            }
        }
    };
</script>