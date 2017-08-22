<template>
    <div>
        <div v-if="loading" class="loading">
            <div class="loading-icon"><i class="fa fa-cog fa-spin fa-3x fa-fw"></i></div>
            <div class="loading-text">Đang tải dữ liệu...</div>
        </div>
        <div v-else>
            <div class="float-right">
                <button type="button" class="btn" :class="[showAllFlg?'btn-success':'btn-outline-secondary']" @click="showAllProduct()">
                    <i class="fa fa-align-justify" aria-hidden="true"></i>Tất cả
                </button>
                <button type="button" class="btn" :class="[inventoryFlg?'btn-info':'btn-outline-secondary']" @click="showInventory()">
                    <i class="fa fa-pie-chart" aria-hidden="true"></i>Tồn kho
                </button>
                <button type="button" class="btn" :class="[soldOutFlg?'btn-danger':'btn-outline-secondary']" @click="showSoldOut()">
                    <i class="fa fa-remove" aria-hidden="true"></i>Hết hàng
                </button>   
            </div>
            <div class="has-danger">
              <label class="custom-control">
                <span class="custom-control-description">Tìm được tất cả {{searchResult.length}} sản phẩm trong kho.</span>
              </label>
            </div>
            <div class="row" style="margin-top: 20px;">
              <div class="col-lg-6">
                <div class="input-group has-success">
                    <span class="input-group-addon"><i class="fa fa-search"></i></span>
                    <input v-model="keyword" placeholder="Nhập tên, mã sản phẩm hoặc khuyến mãi ..." class="form-control">
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
            <div>
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
            <p v-if="all.length === 0">Không có sản phẩm nào</p>
            <table v-else="" class="table table-condensed">
                <thead>
                <tr style="cursor: pointer;">
                    <th @click="sortByIdFunc()">Mã <i class="fa" :class="[sortById?'fa-sort-alpha-desc':'fa-sort-alpha-asc']"></i></th>
                    <th @click="sortByNameFunc()">Tên <i class="fa" :class="[sortByName?'fa-sort-alpha-desc':'fa-sort-alpha-asc']"></i></th>
                    <th @click="sortByQuantityFunc()">Kho <i class="fa" :class="[sortByQuantity?'fa-sort-numeric-desc':'fa-sort-numeric-asc']"></i></th>
                    <th @click="sortByPriceFunc()">Giá (VNĐ) <i class="fa" :class="[sortByPrice?'fa-sort-numeric-desc':'fa-sort-numeric-asc']"></i></th>
                    <th>Khuyến mãi (%)</th>
                    <th>Ảnh</th>
                    <th>Thao tác</th>
                </tr>
                </thead>
                <tr v-for="product in all">
                    <td :class="[product.quantity==0?'table-warning':'']">
                        <button class="btn btn-secondary btn-sm" @click="showProductOrderModal(product)">
                           {{ product.code }}
                        </button>
                    </td>
                    <td :class="[product.quantity==0?'table-warning':'']" style="word-break: break-all">{{ product.name }}</td>
                    <td :class="[product.quantity==0?'table-warning':'']">{{ product.quantity }}</td>
                    <td :class="[product.quantity==0?'table-warning':'']" v-if="product.discount === 0 && product.discount_event === 0">{{ formatMoney(product.price) }}</td>
                    <td :class="[product.quantity==0?'table-warning':'']" v-else-if="product.discount_event > 0">
                        <span style="text-decoration: line-through;">{{ formatMoney(product.price) }}</span>
                        <br>
                        <span>{{ formatMoney(product.price * (1 - product.discount_event / 100)) }}</span>
                    </td>
                    <td :class="[product.quantity==0?'table-warning':'']" v-else="product.discount > 0">
                        <span style="text-decoration: line-through;">{{ formatMoney(product.price) }}</span>
                        <br>
                        <span>{{ formatMoney(product.price * (1 - product.discount / 100)) }}</span>
                    </td>
                    <td :class="[product.quantity==0?'table-warning':'']" v-if="product.discount_event > 0">
                        <span class="btn btn btn-outline-danger"><i class="fa fa-star"></i> {{ product.discount_event }}%</span>
                    </td>
                    <td :class="[product.quantity==0?'table-warning':'']" v-else-if="product.discount > 0">
                    <span class="btn btn-outline-primary">{{ product.discount }}%</span>
                    </td>
                    <td :class="[product.quantity==0?'table-warning':'']" v-else="">
                    <span></span>
                    </td>
                    <td :class="[product.quantity==0?'table-warning':'']">
                        <img v-if="product.image" :src="product.image" class="image-preview small"/>
                        <img v-else class="image-preview small" src="/img/no-image.jpg"/>
                    </td>
                    <td :class="[product.quantity==0?'table-warning':'']">
                        <button class="btn btn-outline-success" @click="showUpdateQuantityModal(product)">
                            <i class="fa fa-calendar-plus-o" aria-hidden="true"></i>Số lượng
                        </button>
                        <button class="btn btn-primary" @click="showEditModal(product)">
                            <i class="fa fa-pencil-square-o" aria-hidden="true"></i>Sửa
                        </button>
                        <button class="btn btn-danger" @click="showDeleteModal(product)">
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
    import accounting from 'accounting';

    export default {
        created() {
            this.$store.dispatch('products/getAll');
        },
        computed: {
            ...mapGetters('products', {
                loading: 'loading',
                products: 'all'
            }),
            all: function () {
                if (this.keyword !== '') {
                    this.currentPage = 1;
                    this.searchResult = this.products.filter(product => {
                        let keyword = this.convertTiengViet(this.keyword);

                        let productName = product.name;
                        productName = this.convertTiengViet(productName);

                        return (productName.indexOf(keyword) > -1 ||
                            (product.discount_event > 0
                                ? product.discount_event.toString().indexOf(keyword) > -1
                                : product.discount.toString().indexOf(keyword) > -1
                                ) ||
                        product.code.toLowerCase().indexOf(keyword) > -1);
                    });
                return this.paginate(this.searchResult);
                } else if (this.inventoryFlg) {
                    this.currentPage = 1;
                    this.searchResult = this.products.filter(product => {

                        return (product.quantity > 0);
                    });
                    return this.paginate(this.searchResult);
                }  else if (this.soldOutFlg) {
                    this.currentPage = 1;
                    this.searchResult = this.products.filter(product => {

                        return (product.quantity === 0);
                    });
                    return this.paginate(this.searchResult);
                }
                 else {
                    this.searchResult = this.products;
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
            ...mapActions('products', ['showEditModal', 'showDeleteModal', 'showUpdateQuantityModal', 'sortProduct', 'showProductOrderModal']),
            formatMoney(value) {
                return accounting.formatNumber(value);
            },
            sortByIdFunc: function () {
                let name = 'id';
                let reverse = this.sortById;
                this.$store.dispatch('products/sortProduct', {name, reverse});
                this.sortById = this.sortById ? false : true;
            },
            sortByNameFunc: function () {
                let name = 'name';
                let reverse = this.sortByName;
                this.$store.dispatch('products/sortProduct', {name, reverse});
                this.sortByName = this.sortByName ? false : true;
            },
            sortByQuantityFunc: function () {
                let name = 'quantity';
                let reverse = this.sortByQuantity;
                this.$store.dispatch('products/sortProduct', {name, reverse});
                this.sortByQuantity = this.sortByQuantity ? false : true;
            },
            sortByPriceFunc: function () {
                let name = 'price';
                let reverse = this.sortByPrice;
                this.$store.dispatch('products/sortProduct', {name, reverse});
                this.sortByPrice = this.sortByPrice ? false : true;
            },
            paginate(list) {
                this.resultCount = list.length;

                if (this.proPerPage === '' || this.proPerPage === null) {
                    this.proPerPage = 0;
                }
                var index = (this.currentPage-1) * this.proPerPage;
                return list.slice(index, (Math.ceil(index) + Math.ceil(this.proPerPage)));
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
            },
            showInventory() {
                if (!this.inventoryFlg) {
                    this.inventoryFlg = true;
                    this.soldOutFlg = false;
                    this.showAllFlg = false;
                }
            },
            showSoldOut() {
                if (!this.soldOutFlg) {
                    this.inventoryFlg = false;
                    this.soldOutFlg = true;
                    this.showAllFlg = false;
                }
            },
            showAllProduct() {
                if (!this.showAllFlg) {
                    this.inventoryFlg = false;
                    this.soldOutFlg = false;
                    this.showAllFlg = true;
                }
            }
        },
        data() {
            return {
                keyword: '',
                searchResult: [],
                currentPage: 1,
                resultCount: 0,
                proPerPage: 10,
                sortByName: false,
                sortById: false,
                sortByQuantity: false,
                sortByPrice: false,
                inventoryFlg: false,
                soldOutFlg: false,
                showAllFlg: true
            }
        }
    }
</script>
