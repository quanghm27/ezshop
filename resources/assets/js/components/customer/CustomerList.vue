<template>
    <div>
        <div v-if="loading" class="loading">
            <div class="loading-icon"><i class="fa fa-cog fa-spin fa-3x fa-fw"></i></div>
            <div class="loading-text">Đang tải dữ liệu...</div>
        </div>
        <div v-else>
            <div class="has-danger">
              <label class="custom-control">
                <span class="custom-control-description">Có tất cả {{customers.length}} khách hàng trong hệ thống.</span>
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
            <p v-if="all.length === 0">Không có khách hàng nào</p>
            <table v-else="" class="table table-hover mb-0 hidden-sm-down">
                <thead class="thead-default">
                <tr>
                    <th>Mã</th>
                    <th>Tên</th>
                    <th class="text-center">Thao tác</th>
                </tr>
                </thead>
                <tr v-for="customer in all">
                    <td>{{ customer.id }}</td>
                    <td style="width: 70%;">
                            <button class="btn btn-secondary btn-sm" @click="showCustomerOrderModal(customer)">{{ customer.name }}</button>
                            <div class="text-danger"><span><i class="fa fa-phone-square" aria-hidden="true"></i> {{ customer.phone_number }}</span></div>
                            <div class="text-danger"><span><i class="fa fa-envelope" aria-hidden="true"></i> {{ customer.email }}</span></div>
                            <div class="text-primary"><span><i class="fa fa-facebook-square" aria-hidden="true"></i> <a href="#">{{ customer.facebook_link }}</a></span></div>
                            <div class="text-primary"><span><i class="fa fa-road" aria-hidden="true"></i> {{ customer.address }}</span></div>
                            <div class="text-default"><span><i class="fa fa-sticky-note-o" aria-hidden="true"></i> {{ customer.note }}</span></div>
                    </td>
                    <td class="text-center align-middle">
                        <button class="btn btn-primary" @click="showEditModal(customer)">
                            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>Sửa
                        </button>
                        <button class="btn btn-danger" @click="showDeleteModal(customer)">
                            <i class="fa fa-trash" aria-hidden="true"></i>Xóa
                        </button>
                    </td>
                </tr>
            </table>
        </div>
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
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';

    export default {
        created() {
            this.$store.dispatch('customers/getAll');
        },
        computed: {
            ...mapGetters('customers', {
                loading: 'loading',
                customers: 'all'
            }),
            all: function () {
                if (this.keyword !== '') {
                    this.currentPage = 1;
                    this.searchResult = this.customers.filter(customer => {
                        let keyword = this.convertTiengViet(this.keyword);

                        let customerName = customer.name;
                        customerName = this.convertTiengViet(customerName);

                        let email = customer.email;
                        email = this.convertTiengViet(email);

                        return (customerName.indexOf(keyword) > -1 ||
                            customer.phone_number.indexOf(keyword) > -1 ||
                            customer.email.indexOf(keyword) > -1);
                    });
                return this.paginate(this.searchResult);
                } else {
                    this.searchResult = this.customers;
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
            }
        },
        methods: {
            ...mapActions('customers', ['showEditModal', 'showDeleteModal', 'showCustomerOrderModal']),
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
                keyword: '',
                searchResult: [],
                currentPage: 1,
                resultCount: 0,
                proPerPage: 10
            }
        }
    }
</script>