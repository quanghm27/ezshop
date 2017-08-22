<template>
    <div class="wrapper">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-lg-12">
                    <button class="btn btn-secondary" @click="backToList">
                        <i class="fa fa-chevron-left" aria-hidden="true"></i>Quay lại danh sách đơn hàng
                    </button>
                    <br><br>
                    <div v-if="valid">
                        <div class="card">
                            <div class="card-header">
                                <i class="fa fa-align-justify"></i> Khách hàng
                            </div>
                            <div class="card-block">
                                <div v-if="customerLoading" class="loading">
                                    <div class="loading-icon"><i class="fa fa-cog fa-spin fa-3x fa-fw"></i></div>
                                    <div class="loading-text">Đang tải dữ liệu...</div>
                                </div>
                                <div v-else="">
                                    <button type="button" class="btn btn-primary" @click="showCustomerSearchModal">
                                        <i class="fa fa-search" aria-hidden="true"></i>Đổi khách hàng
                                    </button>
                                    <hr>
                                    <ul v-if="customer">
                                        <li><strong>Tên: </strong>{{ customer.name }}</li>
                                        <li><strong>SĐT: </strong>{{ customer.phone_number }}</li>
                                        <li><strong>Facebook: </strong>{{ customer.facebook_link }}</li>
                                        <li><strong>Email: </strong>{{ customer.email }}</li>
                                        <li><strong>Địa chỉ: </strong>{{ customer.address }}</li>
                                        <li><strong>Ghi chú: </strong>{{ customer.note }}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="card">
                            <div class="card-header">
                                <i class="fa fa-align-justify"></i> Sản phẩm
                            </div>
                            <div class="card-block">
                                <div v-if="productLoading" class="loading">
                                    <div class="loading-icon"><i class="fa fa-cog fa-spin fa-3x fa-fw"></i></div>
                                    <div class="loading-text">Đang tải dữ liệu...</div>
                                </div>
                                <div v-else="">
                                    <div class="card-block">
                                        <button type="button" class="btn btn-primary" @click="showProductSearchModal">
                                            <i class="fa fa-plus" aria-hidden="true"></i>Thêm sản phẩm
                                        </button>
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
                                                    <th style="width: 120px">Số lượng</th>
                                                    <th style="width: 200px">Giảm giá (VNĐ)</th>
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
                                                        <input class="form-control" type="number"
                                                               :value="product.sell"
                                                               @input="updateProduct(product, 'sell', $event.target.value)"
                                                               min="1" :max="product.quantityOld+product.sellOld"/>
                                                    </td>
                                                    <td>
                                                        <input class="form-control" type="text"
                                                               :value="formatCurrency(product.totalDiscount)"
                                                               @input="updateProduct(product, 'totalDiscount', $event.target.value, true)"/>
                                                    </td>
                                                    <td>{{formatCurrency(product.total)}} VNĐ</td>
                                                    <td>
                                                        <button class="btn btn-danger" @click="removeProduct(product)">
                                                            <i class="fa fa-trash" aria-hidden="true"></i>Xóa
                                                        </button>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <h4>Tổng tiền: {{ formatCurrency(totalPrice) }} VNĐ</h4>
                        <br><br>
                        <button class="btn btn-success btn-lg"
                            :disabled="!customer || products.length === 0"
                            @click="updateOrder($route.params.id)">
                            <i class="fa fa-floppy-o" aria-hidden="true"></i>Lưu đơn hàng
                        </button>
                        <br><br>
                    </div>
                    <h4 v-else="">Mã đơn hàng không hợp lệ!</h4>
                </div>
            </div>
        </div>
        <order-customer-search-modal></order-customer-search-modal>
        <order-product-search-modal></order-product-search-modal>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import accounting from 'accounting';

    import OrderCustomerSearchModal from './OrderCustomerSearchModal.vue';
    import OrderProductSearchModal from './OrderProductSearchModal.vue';

    export default {
        components: {
            OrderCustomerSearchModal, OrderProductSearchModal
        },
        mounted() {
            this.getOrderDetail(this.$route.params.id);
            this.$store.dispatch('customers/getAll');
            this.$store.dispatch('products/getAll');
            if (this.$route.params.productCall == 1) {
                //document.body.className = document.body.className.replace(" modal-open","");
                const body = document.body;
                body.classList.remove('modal-open');
            }
        },
        computed: {
            ...mapGetters('orders', {
                valid: 'detailValid',
                customerLoading: 'customerLoading',
                customer: 'customer',
                productLoading: 'productLoading',
                products: 'products',
                originalCustomer: 'detailCustomer',
                originalProducts: 'detailProducts'
            }),
            totalPrice() {
                let total = 0;
                this.products.forEach(product => {
                    total += product.total;
                });
                return total;
            }
        },
        methods: {
            ...mapActions('orders', {
                getOrderDetail: 'getOrderDetail',
                showCustomerSearchModal: 'showCustomerModal',
                setCustomer: 'setCustomer',
                showProductSearchModal: 'showProductModal',
                removeProduct: 'removeProduct',
                updateOrder: 'updateOrder'
            }),
            formatCurrency(value) {
                return accounting.formatNumber(value);
            },
            backToList() {
                this.$router.push({name: 'OrderList'});
            },
            updateProduct(product, key, value, isFormat = false) {
                if (isFormat) {
                    if (value.indexOf('-') > -1) {
                        value = value.substring(1);
                    }
                    value = this.formatCurrency(value);
                }
                let modifiedFlg = true;
                this.$store.dispatch('orders/updateProduct', {product, key, value: accounting.unformat(value), modifiedFlg});
            },
        },
        watch: {
            '$route' (to, from) {
                console.log(this.$route.params.id);
            }
        }
    };
</script>