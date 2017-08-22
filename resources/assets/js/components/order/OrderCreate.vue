<template>
    <div class="wrapper">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-header">
                            <i class="fa fa-align-justify"></i> Khách hàng
                        </div>
                        <div class="card-block">
                            <button type="button" class="btn btn-primary" @click="showCustomerSearchModal">
                                <i class="fa fa-search" aria-hidden="true"></i>Tìm khách hàng
                            </button>
                            &nbsp;hoặc&nbsp;
                            <button type="button" class="btn btn-danger" @click="showCustomerAddModal">
                                <i class="fa fa-plus" aria-hidden="true"></i>Tạo khách hàng
                            </button>
                            <hr>
                            <div v-if="customer">
                                <div v-if="customerLoading" class="loading">
                                    <div class="loading-icon"><i class="fa fa-cog fa-spin fa-3x fa-fw"></i></div>
                                    <div class="loading-text">Đang tải dữ liệu...</div>
                                </div>
                                <ul v-else>
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
                                                   min="1"
                                                   :max="product.quantity"/>
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
                    <h4>Tổng tiền: {{ formatCurrency(totalPrice) }} VNĐ</h4>
                    <br><br>
                    <button class="btn btn-success btn-lg"
                            @click="saveOrder(totalPrice)"
                            :disabled="!customer || products.length === 0">
                        <i class="fa fa-floppy-o" aria-hidden="true"></i>Lưu đơn hàng
                    </button>
                    <br><br>
                </div>
            </div>
        </div>
        <customer-modal :callback="setCustomer"></customer-modal>
        <order-customer-search-modal></order-customer-search-modal>
        <order-product-search-modal></order-product-search-modal>
    </div>
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';
    import accounting from 'accounting';

    import OrderCustomerSearchModal from './OrderCustomerSearchModal.vue';
    import OrderProductSearchModal from './OrderProductSearchModal.vue';
    import CustomerModal from '../customer/CustomerModal.vue';


    export default {
        components: {
            OrderCustomerSearchModal, CustomerModal, OrderProductSearchModal
        },
        mounted() {
            this.$store.dispatch('customers/getAll');
            this.$store.dispatch('products/getAll');
            this.setCustomer(null);
            this.setProducts([]);
        },
        computed: {
            ...mapGetters('orders', ['customerLoading', 'customer', 'productLoading', 'products']),
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
                showCustomerSearchModal: 'showCustomerModal',
                setCustomer: 'setCustomer',
                showProductSearchModal: 'showProductModal',
                setProducts: 'setProducts',
                removeProduct: 'removeProduct',
                saveOrder: 'saveOrder'
            }),
            ...mapActions('customers', {
                showCustomerAddModal: 'showAddModal'
            }),
            formatCurrency(value) {
                return accounting.formatNumber(value);
            },
            updateProduct(product, key, value, isFormat = false) {
                if (isFormat) {
                    if (value.indexOf('-') > -1) {
                        value = value.substring(1);
                    }
                    value = this.formatCurrency(value);
                }
                if (key === 'sell' && value > product.quantity)
                    value = product.quantity;
                let modifiedFlg = false;
                this.$store.dispatch('orders/updateProduct', {product, key, value, modifiedFlg});
            },
        }
    };
</script>