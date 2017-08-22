<template>
    <div class="wrapper">
        <div class="animated fadeIn">
            <div class="row">
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-header">
                            <i class="fa fa-align-justify"></i> Thống kê doanh số
                        </div>
                        <div class="card-block row">
                            <div class="col-md-6">
                            	<div class="input-group">
                            		<span class="input-group-btn">
                                        <span class="btn btn-primary"></i> Ngày bắt đầu</span>
                                    </span>
                                    <datepicker input-class="calendar-height" :format="format" language="vi" v-model="fromDate"></datepicker>
                            	</div>
                            </div>
                            <div class="col-md-6">
                            	<div class="input-group">
                            		<span class="input-group-btn">
                                        <span class="btn btn-danger"></i> Ngày kết thúc</span>
                                    </span>
                                    <datepicker input-class="calendar-height" :format="format" language="vi" v-model="toDate"></datepicker>
                            	</div>
                            </div>
                        </div>
                        <div class="row" style="padding-left: 1.25rem; padding-bottom: 1.25rem;">
                            <div class="col-md-6">
                                <div class="input-group">
                                    <button @click="searchOrderWithDateBtn()" type="button" class="btn btn-success"><i aria-hidden="true" class="fa fa-search"></i>Thống kê</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-12">
                    <div class="card">
                        <div class="card-header">
                            <i class="fa fa-flag"></i> Kết quả thống kê
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
                                <p v-if="orders.length === 0">Không có đơn hàng nào.</p>
                                <div v-else="">
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
                                    <table class="table table-condensed">
                                        <thead>
                                            <tr>
                                                <th  style="width: 5%;">Mã</th>
                                                <th  style="width: 35%;">Thông tin khách hàng</th>
                                                <th>Thông tin sản phẩm đã mua</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="order in all">
                                                <td>{{ order.id }}</td>
                                                <td>
                                                    <h6>{{ order.customer.name }}</h6>
                                                    <div class="text-danger"><span><i class="fa fa-phone-square" aria-hidden="true"></i> {{ order.customer.phone_number }}</span></div>
                                                    <div class="text-primary"><span>Ngày mua: {{ formatDateFromNow(order.created_at) }}</span></div>
                                                    <div class="text-default"><span>Số sản phẩm đã mua: <b>{{ order.products.length }}</b> sản phẩm</span></div>
                                                    <div class="text-default"><strong>Tổng tiền: {{ formatCurrency(order.total_price) }} VNĐ</strong></div>
                                                </td>
                                                <td>
                                                <div class="row">
                                                  <div class="col-sm-4 col-md-3" v-for="product in order.products">
                                                    <div class="card">
                                                      <div v-if="product.image !== null" class="card-block text-center image-product-statistic" v-bind:style="{ 'background-image' : 'linear-gradient(180deg, transparent 0, rgba(37, 19, 19, 0.7)), url(' + product.image + ')'}">
                                                        <div class="text-white">[{{product.code}}]</div>
                                                        <div class="text-white small ellipsis-text" v-bind:title="product.name">{{product.name}}</div>
                                                        <div class="h3 text-white">{{product.pivot.quantity}}</div>
                                                      </div>
                                                      <div v-else="" class="card-block text-center image-product-statistic" style="background-image : linear-gradient(180deg, transparent 0, rgba(37, 19, 19, 0.7)), url('/img/no-image.jpg')">
                                                        <div class="text-black">[{{product.code}}]</div>
                                                        <div class="text-black small ellipsis-text" v-bind:title="product.name">{{product.name}}</div>
                                                        <div class="h3">{{product.pivot.quantity}}</div>
                                                      </div>
                                                    </div>
                                                  </div><!--/col-->
                                                </div><!--/row-->
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <hr>
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
                        <div class="card-footer affix" data-spy="affix" data-offset-top="300">
                            <span class="text-success lead"><strong><b>Tổng tiền tất cả hóa đơn: {{ formatCurrency(total) }} VNĐ</b></strong></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import accounting from 'accounting';
	import Datepicker from 'vuejs-datepicker';
    import moment from 'moment';
    import { mapGetters, mapActions } from 'vuex';

    export default {
    	components: {Datepicker},
        name: 'orderSaleStatistics',
        created() {
            this.fromDateDisplay = moment();
            this.toDateDisplay = moment();
            this.$store.dispatch('orders/searchOrderWithDate', {fromDate: this.formatDate(moment()), toDate: this.formatDate(moment().add(1, 'days'))});
        },
        computed: {
            ...mapGetters('orders', {
                loading: 'orderLoading',
                orders: 'dataOrder'
            }),
            fromDateNow: function() {
                return this.formatDate(moment()); 
            },
            all: function () {
                this.searchResult = this.orders;
                 return this.paginate(this.searchResult);
            },
            total: function(){
			    return this.orders.reduce(function(prev, order){
			      return prev + order.total_price; 
			    }, 0);
			},
            modalActive: {
                get() {
                    return this.$store.state.orders.list.modal;
                },
                set(newValue) {
                    if (this.modalActive && !newValue)
                        this.hideListModal();
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
            }
        },
        methods: {
            ...mapActions('orders', ['showListModal', 'hideListModal']),
            formatCurrency(value) {
                return accounting.formatNumber(value);
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
            formatDate(value) {
                return moment(String(value)).format('YYYY-MM-DD');
            },
            formatDateFromNow(value) {
                return moment(moment(String(value)).format('MMMM Do YYYY, h:mm:ss a'), "MMMM Do YYYY, h:mm:ss a").lang('vi').fromNow();
            },
            searchOrderWithDateBtn() {
                this.fromDateDisplay = this.formatDate(this.fromDate);
                this.toDateDisplay = this.formatDate(this.toDate);
            	let toDateNew = moment(this.toDate).add(1, 'days');
            	this.$store.dispatch('orders/searchOrderWithDate', {fromDate: this.formatDate(this.fromDate), toDate: this.formatDate(toDateNew)});
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
	    data () {
	        return {
	            format: 'dd/MM/yyyy',
                fromDateDisplay: '',
                toDateDisplay: '',
                fromDate: '',
                toDate: '',
                totalAllOrder: 0,
                currentPage: 1,
                resultCount: 0,
                proPerPage: 10
	        }
	    }
    };
</script>