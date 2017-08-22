<template>
    <div>
        <modal v-if="type === 'add' || type === 'edit'" :title="title" v-model="active" effect="zoom" :large="true">
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title">{{ title }}</h4>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="name">Tên khách hàng</label>
                        <input id="name" type="text" class="form-control" :value="customer.name" @input="updateCustomer('name', $event.target.value)">
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="phone">Số điện thoại</label>
                        <input id="phone" type="text" class="form-control" :value="customer.phone_number" @input="updateCustomer('phone_number', $event.target.value)">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input id="email" type="email" class="form-control" :value="customer.email" @input="updateCustomer('email', $event.target.value)">
                    </div>
                </div>
                <div class="col-sm-6">
                    <div class="form-group">
                        <label for="facebook_link">Facebook</label>
                        <input id="facebook_link" type="text" class="form-control" :value="customer.facebook_link" @input="updateCustomer('facebook_link', $event.target.value)">
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <div class="form-group">
                        <label for="address">Địa chỉ</label>
                        <textarea id="address" class="form-control" :value="customer.address" @input="updateCustomer('address', $event.target.value)"></textarea>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <div class="form-group">
                        <label for="note">Ghi chú</label>
                        <textarea id="note" class="form-control" :value="customer.note" @input="updateCustomer('note', $event.target.value)"></textarea>
                    </div>
                </div>
            </div>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="hideModal">
                    <i class="fa fa-times" aria-hidden="true"></i>Hủy
                </button>
                <button v-if="type === 'add'" type="button" class="btn btn-success" @click="add">
                    <i class="fa fa-floppy-o" aria-hidden="true"></i>Thêm khách hàng
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
            <p>Hãy xác nhận việc xóa khách hàng này</p>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="hideModal">
                    <i class="fa fa-times" aria-hidden="true"></i>Hủy
                </button>
                <button type="button" class="btn btn-success" @click="remove">
                    <i class="fa fa-trash" aria-hidden="true"></i>Xóa
                </button>
            </div>
        </modal>

        <modal v-if="type === 'customerOrder'" v-model="active" effect="zoom" :large="true">
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title">{{ title }}</h4>
            </div>
            <div class="row">
                <div class="col-sm-12">
                    <div class="list-group">
                        <div class="d-flex">
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
            </div>
  
            <hr>
            <div class="card-block" style="padding-top: 0; padding-bottom: 0">
                <div v-if="loading" class="loading">
                    <div class="loading-icon"><i class="fa fa-cog fa-spin fa-3x fa-fw"></i></div>
                    <div class="loading-text">Đang tải dữ liệu...</div>
                </div>
                <div v-else-if="cusOrders.length > 0" class="row">
                    <div class="has-danger">
                      <label class="custom-control">
                        <span class="custom-control-description">Có tất cả: {{cusOrders.length}} hóa đơn được mua bởi: <b>{{ customer.name }}</b></span>
                      </label>
                    </div>
                    <div style="width: 100%;">
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
                                <th class="text-center">Mã hóa đơn</th>
                                <th class="text-center">Số sản phẩm đã mua</th>
                                <th class="text-center">Tổng giá trị đơn hàng</th>
                                <th class="text-center">Ngày mua</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="result in cusOrdersAll" @click="goToDetail(result.id)" style="cursor: pointer">
                                <td class="text-center">
                                    <div class="avatar"><img src="/img/no-image.jpg" class="img-avatar">
                                        <span class="avatar-status badge-success"></span>
                                    </div>
                                </td>
                                <td class="text-center">
                                    <div class="clearfix">
                                        <strong>{{ result.id }}</strong>
                                    </div>
                                </td>
                                <td class="text-center">
                                    <div class="clearfix">
                                        <strong>{{ result.totalProduct }}</strong>
                                    </div>

                                </td>
                                <td class="text-center">
                                    <div class="clearfix">
                                        <strong>{{ formatCurrency(result.totalPrice) }} VNĐ</strong>
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
                <div v-if="cusOrders.length == 0" class="col-lg-8 has-danger">
                    <span>Không có hóa đơn nào nào mua bởi: <b>{{customer.name}}</b>.</span>
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
    import {mapGetters, mapActions} from 'vuex';
    import accounting from 'accounting';
    import moment from 'moment';
    import Modal from 'vue-strap/src/modal';

    export default {
        props: ['callback'],
        components: {Modal},
        computed: {
            ...mapGetters('customers', {
                customer: 'modalCustomer',
                type: 'modalType',
                cusOrders: 'cusOrderDetail',
                loading: 'orderLoading'
            }),
            active: {
                get() {
                    return this.$store.state.customers.modal.active;
                },
                set(newValue) {
                    if (this.active && !newValue)
                        this.hideModal();
                }
            },
            cusOrdersAll: function () {
                return this.paginate(this.cusOrders);
            },
            title() {
                if (this.type === 'add')
                    return 'Thêm khách hàng';
                else if (this.type === 'edit')
                    return 'Sửa khách hàng';
                else if (this.type === 'delete')
                    return 'Xóa khách hàng';
                else if (this.type === 'customerOrder')
                    return 'Tổng hợp hóa đơn của khách hàng';
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
            ...mapActions('customers', ['hideModal']),
            updateCustomer(key, value) {
                this.$store.dispatch('customers/updateCustomer', {key, value});
            },
            add() {
                this.$store.dispatch('customers/add', {callback: this.callback});
            },
            edit() {
                this.$store.dispatch('customers/edit');
            },
            remove() {
                this.$store.dispatch('customers/delete');
            },
            formatCurrency(value) {
                return accounting.formatNumber(value);
            },
            formatDate(value) {
                return moment(String(value)).format('DD/MM/YYYY');
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
                    currentPage: 1,
                    resultCount: 0,
                    proPerPage: 5
                }
            }
    }
</script>