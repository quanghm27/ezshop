<template>
    <div class="wrapper">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-header">
                            <i class="fa fa-align-justify"></i> Danh sách đơn hàng
                        </div>
                        <div class="card-block">
                            <div v-if="loading" class="loading">
                                <div class="loading-icon"><i class="fa fa-cog fa-spin fa-3x fa-fw"></i></div>
                                <div class="loading-text">Đang tải dữ liệu...</div>
                            </div>
                            <div v-else>
                                <div class="has-danger">
                                  <label class="custom-control">
                                    <span class="custom-control-description">Có tất cả {{orders.length}} đơn hàng trong hệ thống.</span>
                                  </label>
                                </div>
                                <div class="row">
                                  <div class="col-lg-6">
                                    <div class="input-group has-success">
                                        <span class="input-group-addon"><i class="fa fa-search"></i></span>
                                        <input v-model="keyword" placeholder="Nhập tên, số điện thoại hoặc email ..." class="form-control">
                                    </div>
                                  </div>
                                  <div class="col-lg-6">
                                    <div class="input-group">
                                        <label for="example-text-input" class="col-5 col-form-label text-right">Số sản phẩm / trang:</label>
                                        <input class="form-control" type="number" min="1" max="100" v-model="proPerPage" />
                                    </div>
                                  </div>
                                </div>
                                <br>
                                <nav aria-label="Page navigation">
                                  <ul class="pagination pagination-lg">
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
                                <hr>
                                <p v-if="orders.length === 0">Không có đơn hàng nào.</p>
                                <table v-else="" class="table table-condensed">
                                    <thead>
                                        <tr>
                                            <th>Mã</th>
                                            <th>Tên khách hàng</th>
                                            <th>Số điện thoại</th>
                                            <th>Tổng giá (VNĐ)</th>
                                            <th>Ngày</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="order in all">
                                            <td>{{ order.id }}</td>
                                            <td>{{ order.customer.name }}</td>
                                            <td>{{ order.customer.phone_number }}</td>
                                            <td>{{ formatCurrency(order.total_price) }}</td>
                                            <td>{{ order.created_at }}</td>
                                            <td>
                                                <button class="btn btn-primary" @click="goToDetail(order)">
                                                    <i class="fa fa-file-text-o" aria-hidden="true"></i>Chi tiết
                                                </button>
                                                <button class="btn btn-danger" @click="showConfirmModal(order)">
                                                    <i class="fa fa-trash" aria-hidden="true"></i>Xóa
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <nav aria-label="Page navigation">
                              <ul class="pagination pagination-lg">
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
                </div>
            </div>
        </div>

        <modal title="Xóa đơn hàng" v-model="modalActive" effect="zoom" :large="true">
            <div slot="modal-header" class="modal-header">
                <h4 class="modal-title">Xóa đơn hàng</h4>
            </div>
            <p>Hãy xác nhận việc xóa đơn hàng này</p>
            <div slot="modal-footer" class="modal-footer">
                <button type="button" class="btn btn-default" @click="hideListModal">
                    <i class="fa fa-times" aria-hidden="true"></i>Hủy
                </button>
                <button type="button" class="btn btn-success" @click="remove">
                    <i class="fa fa-trash" aria-hidden="true"></i>Xóa
                </button>
            </div>
        </modal>
    </div>
</template>

<script>
    import accounting from 'accounting';
    import { mapGetters, mapActions } from 'vuex';
    import Modal from 'vue-strap/src/modal';

    export default {
        created() {
            this.$store.dispatch('orders/getAll');
        },
        components: {Modal},
        computed: {
            ...mapGetters('orders', {
                loading: 'orderLoading',
                orders: 'orders'
            }),
            all: function () {
                if (this.keyword !== '') {
                    this.currentPage = 1;
                    this.searchResult = this.orders.filter(order => {
                        let keyword = this.convertTiengViet(this.keyword);

                        let customerName = order.customer.name;
                        customerName = this.convertTiengViet(customerName);

                        return (customerName.indexOf(keyword) > -1 ||
                            order.customer.phone_number.indexOf(keyword) > -1);
                    });
                return this.paginate(this.searchResult);
                } else {
                    this.searchResult = this.orders;
                    return this.paginate(this.searchResult);
                }
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
            },
            modalActive: {
                get() {
                    return this.$store.state.orders.list.modal;
                },
                set(newValue) {
                    if (this.modalActive && !newValue)
                        this.hideListModal();
                }
            }
        },
        methods: {
            ...mapActions('orders', ['showListModal', 'hideListModal']),
            formatCurrency(value) {
                return accounting.formatNumber(value);
            },
            showConfirmModal(order) {
                this.showListModal();
                this.currentOrder = order;
            },
            remove() {
                this.$store.dispatch('orders/deleteOrder', this.currentOrder);
            },
            goToDetail(order) {
                this.$router.push({
                    name: 'OrderDetail',
                    params: {
                        id: order.id
                    }
                });
            },
            convertTiengViet(str) {
                str = str.toLowerCase();
                str = str.replace(/à|á|ạ|ả|ã|ầ|ấ|ậ|ẫ|â|ằ|ắ|ặ|ẳ|ẵ|ă/g, "a");
                str = str.replace(/è|é|ẹ|ẻ|ẽ|ề|ế|ệ|ể|ễ|ê/g, "e");
                str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
                str = str.replace(/ò|ó|ọ|ỏ|õ|ồ|ố|ộ|ổ|ỗ|ô|ờ|ớ|ợ|ở|ỡ|ơ/g, "o");
                str = str.replace(/ù|ú|ụ|ủ|ũ|ừ|ứ|ự|ử|ữ|ư/g, "u");
                str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
                str = str.replace(/đ/g, "d");

                return str;
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
                currentOrder: null,
                keyword: '',
                searchResult: [],
                currentPage: 1,
                resultCount: 0,
                proPerPage: 10
            };
        }
    }
</script>