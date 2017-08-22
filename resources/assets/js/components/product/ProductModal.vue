<template>
    <div>
        <modal v-if="type === 'add' || type === 'edit'" :title="title" v-model="active" effect="zoom" :large="true">
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title">{{ title }}</h4>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="code">Mã sản phẩm</label>
                        <input id="code" type="text" class="form-control" :value="product.code.toUpperCase()" @input="updateProduct('code', $event.target.value.toUpperCase())">
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="name">Tên sản phẩm</label>
                        <input id="name" type="text" class="form-control" :value="product.name" @input="updateProduct('name', $event.target.value)">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="quantity">Số lượng</label>
                        <input id="quantity" type="number" class="form-control" :value="product.quantity" @input="updateProduct('quantity', $event.target.value)">
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="price">Đơn giá</label>
                        <div class="input-group">
                            <input id="price" class="form-control" :value="formatCurrency(product.price)" @input="updateProduct('price', $event.target.value, true)">
                            <span class="input-group-addon">VNĐ</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="discount">Khuyến mãi</label>
                        <input id="discount" type="number" class="form-control" :value="product.discount" @input="updateProduct('discount', $event.target.value)">
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="description">Ghi chú</label>
                        <textarea id="description" class="form-control" :value="product.description" @input="updateProduct('description', $event.target.value)"></textarea>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <div class="form-group">
                        <label for="image">Ảnh sản phẩm</label>
                        <input id="image" type="file" ref="imageInput" @change="imageSelected" class="form-control"
                               hidden/>
                        <br>
                        <button class="btn btn-default" @click="selectImage">
                            <i class="fa fa-upload" aria-hidden="true"></i>{{ type === 'add' ? 'Upload ảnh' : 'Thay ảnh' }}
                        </button>
                        <img class="image-preview" :src="product.image"/>
                    </div>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="hideModal">
                    <i class="fa fa-times" aria-hidden="true"></i>Hủy
                </button>
                <button v-if="type === 'add'" type="button" class="btn btn-success" @click="add">
                    <i class="fa fa-floppy-o" aria-hidden="true"></i>Thêm sản phẩm
                </button>
                <button v-if="type === 'edit'" type="button" class="btn btn-success" @click="edit">
                    <i class="fa fa-floppy-o" aria-hidden="true"></i>Lưu thay đổi
                </button>
            </div>
        </modal>

        <modal v-if="type === 'delete'" :title="title" v-model="active" effect="zoom" :large="true">
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title">{{ title }}</h4>
            </div>
            <p>Hãy xác nhận việc xóa sản phẩm này</p>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="hideModal">
                    <i class="fa fa-times" aria-hidden="true"></i>Hủy
                </button>
                <button type="button" class="btn btn-success" @click="remove">
                    <i class="fa fa-trash" aria-hidden="true"></i>Xóa
                </button>
            </div>
        </modal>

        <modal v-if="type === 'updateQuantity'" v-model="active" effect="zoom" :large="false">
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title">{{ title }}</h4>
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <div class="list-group">
                        <div class="d-flex">
                            <div style="margin-right: 1em">
                                <img v-if="product.image" class="image-preview tiny" :src="product.image"/>
                                <img v-else="" class="image-preview tiny" src="/img/no-image.jpg"/>
                            </div>
                            <div class="">
                                <h5 class="mb-1">[{{ product.code }}] {{ product.name }}</h5>
                                    <div class="input-group">
                                        <span class="input-group-addon">Số lượng mới: {{ this.newQuantity }}</span>
                                        <input type="number" autofocus :value="newValueQ" style="text-align: center;" class="form-control col-sm-8"
                                        @input="reCount($event.target.value)">
                                    </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="hideModal">
                    <i class="fa fa-times" aria-hidden="true"></i>Hủy
                </button>
                <button type="button" class="btn btn-success" @click="updateQuantity">
                    <i class="fa fa-floppy-o" aria-hidden="true"></i>Lưu thay đổi
                </button>
            </div>
        </modal>

        <modal v-if="type === 'productOrder'" v-model="active" effect="zoom" :large="true">
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title">{{ title }}</h4>
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <div class="list-group">
                        <div class="d-flex">
                            <div style="margin-right: 1em">
                                <img v-if="product.image" class="image-preview small" :src="product.image"/>
                                <img v-else="" class="image-preview tiny" src="/img/no-image.jpg"/>
                            </div>
                            <div>
                                <h6 class="mb-1">
                                    <span>[{{ product.code }}] {{ product.name }}</span>
                                    <br>
                                    <span v-if="product.discount_event > 0"
                                          class="badge badge-pill badge-danger">
                                    <i class="fa fa-star" aria-hidden="true"></i> -{{ product.discount_event
                                        }}%
                                </span>
                                    <span v-else="product.discount > 0" class="badge badge-pill badge-info">
                                    -{{ product.discount }}%
                                </span>
                                </h6>
                                <h6 class="mb-1">
                                <span class="badge badge-primary">
                                    Kho: {{ product.quantity }}
                                </span>
                                    <span v-if="product.discount_event > 0" class="badge badge-success">
                                    Giá:
                                    <span class="price-original">{{formatCurrency(product.price)}}</span>
                                    <span>
                                        {{ formatCurrency(product.price * (1 - product.discount_event / 100))}} VNĐ
                                    </span>
                                </span>
                                    <span v-else="product.discount > 0" class="badge badge-success">
                                    Giá:
                                    <span class="price-original">{{formatCurrency(product.price)}}</span>
                                    <span>
                                        {{ formatCurrency(product.price * (1 - product.discount / 100))}} VNĐ
                                    </span>
                                </span>
                                    <span v-else="" class="badge badge-success">
                                    Giá: {{ formatCurrency(product.price) }} VNĐ
                                </span>
                                <br>
                                </h6>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <hr>
            <div class="card-block" style="padding-top: 0; padding-bottom: 0">
                <div v-if="loading" class="loading">
                    <div class="loading-icon"><i class="fa fa-cog fa-spin fa-3x fa-fw"></i></div>
                    <div class="loading-text">Đang tải dữ liệu...</div>
                </div>
                <div v-else-if="ordersProduct.length > 0" class="row">
                    <div class="has-danger">
                      <label class="custom-control">
                        <span class="custom-control-description">Có tất cả {{ordersProduct.length}} khách hàng mua sản phẩm này.</span>
                      </label>
                    </div>
                    <div style="width: 100%">
                        <nav aria-label="Page navigation">
                          <ul class="pagination pagination">
                            <li class="page-item" :class="{disabled: currentPage == 1}">
                              <a @click.prevent="togglePage('prev')" href="#" class="page-link" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                                <span class="sr-only">Previous</span>
                              </a>
                            </li>
                            <li class="page-item" :class="{active: currentPage == 1}"><a @click.prevent="togglePage(1)" class="page-link" href="#">1</a></li>
                            <li class="page-item"><span v-if="currentPage >= 5 && totalPages > 10" class="page-link">...</span></li>
                            <li v-for="pageNumber in centerPartPage" class="page-item" :class="{active: currentPage === (pageNumber+1)}">
                                <a @click.prevent="togglePage(pageNumber + 1)" class="page-link" href="#">{{pageNumber+1}}</a>
                            </li>
                            <li class="page-item"><span v-if="totalPages > 10 && totalPages - currentPage > 5" class="page-link">...</span></li>
                            <li v-for="pageNumber in lastPartPage" class="page-item" :class="{active: currentPage === (pageNumber+1)}">
                                <a @click.prevent="togglePage(pageNumber + 1)" class="page-link" href="#">{{pageNumber+1}}</a>
                            </li>
                            <li class="page-item" :class="{disabled: currentPage === totalPages}">
                              <a class="page-link" @click.prevent="togglePage('next')" href="#" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                                <span class="sr-only">Next</span>
                              </a>
                            </li>
                          </ul>
                        </nav>
                    </div>
                    <table class="table table-hover table-outline mb-0 hidden-sm-down">
                        <thead class="thead-default">
                            <tr>
                                <th class="text-center"><i class="icon-people"></i></th>
                                <th>Khách hàng</th>
                                <th class="text-center">Số lượng bán</th>
                                <th class="text-center">Đơn giá</th>
                                <th class="text-center">Ngày mua</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="result in ordersProductAll" @click="goToDetail(result.id)" style="cursor: pointer">
                                <td class="text-center">
                                    <div class="avatar"><img src="/img/no-image.jpg" class="img-avatar">
                                        <span class="avatar-status badge-success"></span>
                                    </div>
                                </td>
                                <td>
                                    <div><strong>
                                    <span>
                                       {{ result.customer.name }}
                                    </span>
                                    </strong></div>
                                    <div class="normal"><span><i class="fa fa-phone-square" aria-hidden="true"></i> {{ result.customer.phone_number }}</span>
                                    </div>
                                    <div class="normal"><span><i class="fa fa-facebook-square" aria-hidden="true"></i> {{ result.customer.facebook_link }}</span>
                                    </div>
                                </td>
                                <td class="text-center">
                                    <div class="clearfix">
                                        <strong>{{ result.sell }}</strong>
                                    </div>
                                </td>
                                <td class="text-center">
                                    <div class="clearfix">

                                        <strong>{{ formatCurrency(result.price) }} VNĐ</strong>
                                    </div>

                                </td>
                                <td class="text-center">
                                    <strong>{{ formatDate(result.dateCreated.date) }}</strong>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div style="width: 100%; margin-top: 20px">
                        <nav aria-label="Page navigation">
                          <ul class="pagination pagination">
                            <li class="page-item" :class="{disabled: currentPage == 1}">
                              <a @click.prevent="togglePage('prev')" href="#" class="page-link" aria-label="Previous">
                                <span aria-hidden="true">&laquo;</span>
                                <span class="sr-only">Previous</span>
                              </a>
                            </li>
                            <li class="page-item" :class="{active: currentPage == 1}"><a @click.prevent="togglePage(1)" class="page-link" href="#">1</a></li>
                            <li class="page-item"><span v-if="currentPage >= 5 && totalPages > 10" class="page-link">...</span></li>
                            <li v-for="pageNumber in centerPartPage" class="page-item" :class="{active: currentPage === (pageNumber+1)}">
                                <a @click.prevent="togglePage(pageNumber + 1)" class="page-link" href="#">{{pageNumber+1}}</a>
                            </li>
                            <li class="page-item"><span v-if="totalPages > 10 && totalPages - currentPage > 5" class="page-link">...</span></li>
                            <li v-for="pageNumber in lastPartPage" class="page-item" :class="{active: currentPage === (pageNumber+1)}">
                                <a @click.prevent="togglePage(pageNumber + 1)" class="page-link" href="#">{{pageNumber+1}}</a>
                            </li>
                            <li class="page-item" :class="{disabled: currentPage === totalPages}">
                              <a class="page-link" @click.prevent="togglePage('next')" href="#" aria-label="Next">
                                <span aria-hidden="true">&raquo;</span>
                                <span class="sr-only">Next</span>
                              </a>
                            </li>
                          </ul>
                        </nav>
                    </div>
                </div>
                <div v-if="ordersProduct.length == 0" class="col-sm-6 col-lg-6">
                    <span>Không có khách hàng nào mua sản phẩm này.</span>
                </div>
            </div>
  
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="hideModal">
                    <i class="fa fa-times" aria-hidden="true"></i>Đóng
                </button>
            </div>
        </modal>
    </div>
</template>

<script>
    import Vue from 'vue';
    import accounting from 'accounting';
    import moment from 'moment';
    import extend from 'extend';
    import {mapGetters, mapActions} from 'vuex';

    import Modal from 'vue-strap/src/modal';

    export default {
        components: {Modal},
        computed: {
            ...mapGetters('products', {
                product: 'modalProduct',
                type: 'modalType',
                allProducts: 'all',
                ordersProduct: 'orderDetail',
                loading: 'orderLoading'
            }),
            ordersProductAll: function () {
                return this.paginate(this.ordersProduct);
            },
            active: {
                get() {
                    return this.$store.state.products.modal.active;
                },
                set(newValue) {
                    this.newQuantity = this.product.quantity;
                    this.newValueQ = '';
                    if (this.active && !newValue)
                        this.hideModal();

                }
            },
            title() {
                if (this.type === 'add')
                    return 'Thêm sản phẩm';
                else if (this.type === 'edit')
                    return 'Sửa sản phẩm';
                else if (this.type === 'delete')
                    return 'Xóa sản phẩm';
                else if (this.type === 'updateQuantity')
                    return 'Cập nhật số lượng sản phẩm';
                else if (this.type === 'productOrder')
                    return 'Thông tin khách hàng đã mua sản phẩm';
                else
                    return '';
            },
            totalPages: function() {
                if (this.proPerPage === '' || this.proPerPage === null) {
                    this.proPerPage = 0;
                }
                return Math.ceil(this.resultCount / this.proPerPage);
            },
            centerPartPage() {
              if (this.totalPages > 10 && this.currentPage >= 5) {
                if (this.totalPages - this.currentPage > 5) {
                  return this.currentPage === this.totalPages ? [this.currentPage - 3, this.currentPage - 2, this.currentPage - 1] : [this.currentPage - 2, this.currentPage - 1, this.currentPage];
                } else {
                  const r = [];

                  for(let i = this.totalPages - 6; i < this.totalPages; i++) {
                    r.push(i);
                  }
                  return r;
                }
              } else if(this.totalPages > 10) {
                const r = [];

                for(let i = 1; i < 5; i++) {
                  r.push(i);
                }
                return r;
              } else {
                const r = [];

                for(let i = 1; i < this.totalPages; i++) {
                  r.push(i);
                }
                return r;
              }
            },
            lastPartPage() {
              if (this.totalPages > 10 && this.totalPages - this.currentPage > 5) {
                return [this.totalPages - 1];
              }else {
                return [];
              }
            },

            firstRow() {
              return this.currentPage === 1 ? 0 : this.proPerPage * (this.currentPage - 1);
            },

            lastRow() {
              return this.proPerPage * this.currentPage > resultCount ? this.resultCount : this.proPerPage * this.currentPage;
            }
        },
        methods: {
            ...mapActions('products', ['hideModal']),
            formatCurrency(value) {
                return accounting.formatNumber(value);
            },
            formatDate(value) {
                return moment(String(value)).format('DD/MM/YYYY');
            },
            updateProduct(key, value, isFormat = false) {
                if (isFormat)
                    value = this.formatCurrency(value);
                this.$store.dispatch('products/updateProduct', {key, value});
            },
            reCount(value) {
                this.newValueQ = value;
                if (value.length > 0) {
                    this.newQuantity = parseInt(this.product.quantity) + parseInt(value);
                } else {
                    this.newQuantity = parseInt(this.product.quantity);
                } 
            },
            selectImage() {
                this.$refs.imageInput.click();
            },
            imageSelected() {
                if (this.$refs.imageInput.files.length > 0) {
                    let reader = new FileReader();
                    let vm = this;
                    reader.onload = e => {
                        vm.updateProduct('image', e.target.result);
                    };
                    reader.readAsDataURL(this.$refs.imageInput.files[0]);
                }
            },
            makeFormData() {
                let formData = new FormData();
                formData.append('code', this.product.code);
                formData.append('name', this.product.name);
                formData.append('quantity', this.product.quantity);
                formData.append('price', accounting.unformat(this.product.price));
                formData.append('discount', this.product.discount);
                formData.append('description', this.product.description);
                if (this.$refs.imageInput.files.length > 0)
                    formData.append('image', this.$refs.imageInput.files[0]);

                return formData;
            },
            add() {
                let formData = this.makeFormData();
                this.$store.dispatch('products/add', {formData});
            },
            edit() {
                let formData = this.makeFormData();
                formData.append('_method', 'patch');
                this.$store.dispatch('products/edit', {id: this.product.id, formData});
            },
            remove() {
                this.$store.dispatch('products/delete', {product: this.product});
            },
            updateQuantity() {
                this.$store.dispatch('products/updateQuantity', {id: this.product.id, quantity: this.newQuantity});
            },
            goToDetail(orderId) {
                this.$router.push({
                    name: 'OrderDetail',
                    params: {
                        id: orderId,
                        productCall : 1
                    }
                });
            },
            paginate(list) {
                this.resultCount = list.length;

                if (this.proPerPage === '' || this.proPerPage === null) {
                    this.proPerPage = 0;
                }
                var index = (this.currentPage-1) * this.proPerPage;
                return list.slice(index, (Math.ceil(index) + Math.ceil(this.proPerPage)));
            },
            togglePage(page) {
              switch(page) {
                case 'prev': 
                  if(this.currentPage <= 1) return ;
                  this.currentPage--;
                  break;
                case 'next':
                  if (this.currentPage >= this.totalPages) return ;
                  this.currentPage++;
                  break;
                default:
                  if(this.currentPage == page) return ;
                  this.currentPage = page;
              }
            }
        },
        data() {
                return {
                    keyword: '',
                    searchResult: [],
                    selected: null,
                    newQuantity: 0,
                    newValueQ: '',
                    currentPage: 1,
                    resultCount: 0,
                    proPerPage: 5
                }
            }
    }
</script>